import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import mapUserToAuthor from "~/server/helpers/mapUserToAuthor";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    console.log(input.username)
    const users = await clerkClient.users.getUserList({
      emailAddress: [`${input.username}@gmail.com`]
    })
    const user = users[0]
    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    const email = user.emailAddresses[0]?.emailAddress.match(/^([^@]+)@/)?.[1]
    const author = mapUserToAuthor(user)
    return {
      ...author,
      username: email
    }
  })
});
