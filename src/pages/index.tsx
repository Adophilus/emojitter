import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

import { RouterOutputs, api } from "~/utils/api";
import Loading from "~/components/loading";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null

  return (
    <div className="flex w-full gap-x-3">
      <img className="w-14 h-14 rounded-full" src={user.profileImageUrl} alt="profile" />
      <input placeholder="Type some emojis!" className="bg-transparent grow outline-none" />
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div className="flex gap-x-3">
      <Image className="flex w-14 h-14 rounded-full" src={author.profilePicture} alt={`@${author.username}'s profile picture`} width={56} height={56} />
      <div className="flex flex-col">
        <div className="space-x-1 text-slate-300">
          <span>@{author.username}</span>
          <span>•</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <div>
          <span className="text-2xl">{post.content}</span>
        </div>
      </div>
    </div>
  )
}

const PostsFeed = () => {
  const { data, isLoading: isLoadingPosts } = api.posts.getAll.useQuery();

  if (isLoadingPosts) return <Loading />

  if (!data) return null

  return (<div className="p-4 border-b border-slate-400">
    {data.map((fullPost) => <PostView key={fullPost.post.id} {...fullPost} />)}
  </div>)
}

const Home: NextPage = () => {
  const { user, isSignedIn: isUserSignedIn, isLoaded: hasLoadedUser } = useUser()

  if (!hasLoadedUser) return null

  return (
    <>
      <Head>
        <title>Emojitter</title>
        <meta name="description" content="Chat app but emojis only 😀" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full md:max-w-2xl border-x border-slate-400">
          <div className="flex p-4 border-b border-slate-400">
            <div className="grow">
              {!isUserSignedIn ? <SignInButton /> : <CreatePostWizard />}
            </div>
          </div>
          <PostsFeed />
        </div>
      </main>
    </>
  );
};

export default Home;
