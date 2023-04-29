import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { ClerkProvider } from '@clerk/nextjs';

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Component {...pageProps} />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </ClerkProvider>);
};

export default api.withTRPC(MyApp);
