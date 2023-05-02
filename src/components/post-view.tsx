import Link from "next/link"
import Image from "next/image"
import type { RouterOutputs } from "~/utils/api"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div className="flex gap-x-3 p-4 border-b border-slate-400">
      <Link href={`/@${author.username}`}>
        <Image className="flex w-14 h-14 rounded-full" src={author.profilePicture} alt={`@${author.username}'s profile picture`} width={56} height={56} />
      </Link>
      <div className="flex flex-col">
        <div className="space-x-1 text-slate-300">
          <Link href={`/@${author.username}`}><span>@{author.username}</span></Link>
          <span>•</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <div>
          <Link href={`/post/${post.id}`}><span className="text-2xl">{post.content}</span></Link>
        </div>
      </div>
    </div>
  )
}

export default PostView
