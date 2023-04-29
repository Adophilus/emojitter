import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

import { RouterOutputs, api } from "~/utils/api";
import Loading from "~/components/loading";
import { useRef } from "react";

const CreatePostWizard = () => {
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement>()
  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      if (!inputRef.current) return

      inputRef.current.value = ''
      ctx.posts.getAll.invalidate()
    }
  })

  const createPost = () => {
    if (!inputRef.current) return

    mutate({ content: inputRef.current.value })
  }

  if (!user) return null

  return (
    <form onSubmit={
      (e) => {
        e.preventDefault()
        if (!isPosting)
          createPost()
      }} className="flex w-full gap-x-3" >
      <img className="w-14 h-14 rounded-full" src={user.profileImageUrl} alt="profile" />
      <input placeholder="Type some emojis!" ref={inputRef} className="bg-transparent grow outline-none" />
      <button type="submit" disabled={isPosting}>Post</button>
    </form>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div className="flex gap-x-3 p-4 border-b border-slate-400">
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

  return (
    <div>
      {data.map((fullPost) => <PostView key={fullPost.post.id} {...fullPost} />)}
    </div>
  )
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
