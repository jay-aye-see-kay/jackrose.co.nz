import Head from "next/head";

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
      <h1 className="mt-4 text-2xl text-boldgreen"># {children}</h1>
    </>
  );
};
