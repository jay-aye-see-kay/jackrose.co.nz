import React from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export const DefaultLayout: React.FC<Props> = ({
  header,
  children,
  footer,
}) => {
  return (
    <div>
      {header ? <div>{header}</div> : <Header />}
      <div>{children}</div>
      {footer ? <div>{footer}</div> : <Footer />}
    </div>
  );
};
