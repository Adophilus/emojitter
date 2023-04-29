import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

import { RouterOutputs, api } from "~/utils/api";
import Loading from "~/components/loading";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner, { Size } from "~/components/loading-spinner";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <main className="flex justify-center min-h-screen">
        <div>Post View</div>
      </main>
    </>
  );
};

export default SinglePostPage;
