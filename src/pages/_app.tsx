import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { ClerkProvider } from '@clerk/nextjs';

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Head>
        <title>Emojitter</title>
        <meta name="description" content="Chat app but emojis only 😀" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </ClerkProvider>);
};

export default api.withTRPC(MyApp);
