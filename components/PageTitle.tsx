import Head from "next/head";

import { H1 } from "./Text";

type Props = {
  pageTitle?: string;
  children: string;
};

export const PageTitle = ({ pageTitle, children }: Props) => {
  return (
    <>
      <Head>
        <title>{pageTitle || children}</title>
      </Head>
      <H1>{children}</H1>
    </>
  );
};
