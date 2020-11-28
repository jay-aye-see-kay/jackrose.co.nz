import React from "react";

const maxWidth = "max-w-xl mx-auto";
const headerColor = "text-boldgreen";

export const H1: React.FC = ({ children }) => (
  <h1 className={`my-4 text-2xl ${headerColor} ${maxWidth}`}># {children}</h1>
);

export const H2: React.FC = ({ children }) => (
  <h2 className={`my-2 text-xl ${headerColor} ${maxWidth}`}>## {children}</h2>
);

export const H3: React.FC = ({ children }) => (
  <h3 className={`my-2 text-lg ${headerColor} ${maxWidth}`}>### {children}</h3>
);

export const H4: React.FC = ({ children }) => (
  <h4 className={`my-2 ${headerColor} ${maxWidth}`}>#### {children}</h4>
);

export const H5: React.FC = ({ children }) => (
  <h5 className={`my-2 ${headerColor} ${maxWidth}`}>##### {children}</h5>
);

export const H6: React.FC = ({ children }) => (
  <h6 className={`my-2 ${headerColor} ${maxWidth}`}>###### {children}</h6>
);

export const P: React.FC = ({ children }) => (
  <p className={`mb-4 ${maxWidth}`}>{children}</p>
);
