import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import mapUserToAuthor from "~/server/helpers/mapUserToAuthor";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});


export const postsRouter = createTRPCRouter({
  create: privateProcedure.input(z.object({
    content: z.string().emoji("Only emojis are allowed").min(1).max(200)
  })).mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId

    const { success } = await ratelimit.limit(authorId);
    if (!success)
      throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests" });

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content
      }
    })
    return post
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100, orderBy: [{ createdAt: "desc" }] });
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
