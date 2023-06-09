import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";

import { api } from "~/utils/api";
import Loading from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner, { Size } from "~/components/loading-spinner";
import PageLayout from "~/components/layout";
import PostView from "~/components/post-view";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [postContent, setPostContent] = useState("")
  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0])
        toast.error(errorMessage[0])
      else
        toast.error("Failed to post. Please try again later!")
    },
    onSuccess: async () => {
      setPostContent("")
      await ctx.posts.getAll.invalidate()
    }
  })

  const createPost = () => {
    mutate({ content: postContent })
  }

  if (!user) return null

  return (
    <form onSubmit={
      (e) => {
        e.preventDefault()
        if (!isPosting)
          createPost()
      }} className="flex w-full gap-x-3" >
      <Image className="flex w-14 h-14 rounded-full" src={user.profileImageUrl} alt={`@${user.id}'s profile picture`} width={56} height={56} />
      <input placeholder="Type some emojis!" onChange={(e) => setPostContent(e.target.value)} value={postContent} className="bg-transparent grow outline-none" disabled={isPosting} />
      <div className="flex justify-center items-center">
        {postContent !== "" && !isPosting ? <button type="submit">Post</button> : null}
        {isPosting ? <LoadingSpinner size={Size.small} /> : null}
      </div>
    </form>
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
      <PageLayout>
        <div className="flex p-4 border-b border-slate-400">
          <div className="grow">
            {!isUserSignedIn ? <SignInButton /> : <CreatePostWizard />}
          </div>
        </div>
        <PostsFeed />
      </PageLayout>
    </>
  );
};

export default Home;
