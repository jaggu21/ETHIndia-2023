import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { AnonAadhaarProvider } from "anon-aadhaar-react";
import "./loginpage.css";


const app_id = process.env.NEXT_PUBLIC_APP_ID || "29893474373487345678";

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <AnonAadhaarProvider _appId={app_id}>
          <Component {...pageProps} />
        </AnonAadhaarProvider>
      ) : null}
    </>
  );
}
