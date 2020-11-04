import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "../css/global.tailwind.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
