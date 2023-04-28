import { User } from "@clerk/nextjs/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const mapUserToAuthor = (user: User) => {
  return { id: user.id, username: user.username, profilePicture: user.profileImageUrl };
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 });
    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100
    })

    return posts.map(post => {
      const user = users.find(user => user.id === post.authorId)

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for post not found!" })

      const author = mapUserToAuthor(user)
      const email = user.emailAddresses[0]?.emailAddress.match(/^([^@]+)@/)?.[1]

      if (!email) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Invalid email address!" })

      return {
        post,
        author: {
          ...author,
          username: email
        }
      }
    })
  }),
});
