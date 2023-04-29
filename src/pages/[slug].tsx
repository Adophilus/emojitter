import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson'

dayjs.extend(relativeTime)

import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>
const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({ username })

  if (!data) return <div>No user found</div>

  return (
    <>
      <Head>
        <title>Emojitter | Profile</title>
      </Head>
      <main className="flex justify-center min-h-screen">
        {data.username}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson
  });
  const slug = context.params?.slug

  if (typeof slug !== 'string') throw new Error("No slug!")

  const username = slug.slice(1)

  await ssg.profile.getUserByUsername.prefetch({ username })
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}

export const getStaticPaths = () => {
  return {
    paths: [], fallback: "blocking"
  }
}

export default ProfilePage;
