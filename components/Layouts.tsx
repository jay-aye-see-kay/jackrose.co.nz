import React from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
};

export const DefaultLayout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
};
