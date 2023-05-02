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
import Loading from "~/components/loading";
import PostView from "~/components/post-view";

type PageProps = { postId: string }
const SinglePostPage: NextPage<PageProps> = ({ postId }) => {
  const { data, isLoading } = api.posts.getById.useQuery({ postId })

  if (isLoading) return <Loading />
  if (!data) return <div>No post found</div>

  return (
    <>
      <Head>
        <title>Emojitter | {data.post.content.slice(0, 10)}</title>
      </Head>
      <PageLayout>
        <div>
          <PostView post={data.post} author={data.author} />
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
  const id = context.params?.id

  if (typeof id !== 'string') throw new Error("No id!")

  await ssg.posts.getById.prefetch({ postId: id })
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId: id
    }
  }
}

export const getStaticPaths = () => {
  return {
    paths: [], fallback: "blocking"
  }
}

export default SinglePostPage;
