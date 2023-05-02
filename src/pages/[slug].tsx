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
import PageLayout from "~/components/layout";
import Image from "next/image";

type PageProps = { username: string }
const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({ username })

  if (!data) return <div>No user found</div>

  return (
    <>
      <Head>
        <title>Emojitter | Profile</title>
      </Head>
      <PageLayout>
        <div className="border-b border-slate-400 bg-slate-600 h-40">
        </div>
        <div>
          <Image src={data.profilePicture} alt={`${data.username ?? ''}'s profile picture`} width={48} height={48} className="-translate-y-1/2 mx-4 bg-black bottom-0 h-24 w-24 rounded-full border-4 border-black" />
        </div>
        <div className="p-4 -mt-10 border-b border-slate-400 w-full">
          <h2 className="text-2xl font-bold">@{data.username}</h2>
        </div>
      </PageLayout>
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
