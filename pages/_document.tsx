import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <link rel="icon" href="data:," />
        <body>
          <Main />
          <NextScript />
          // TODO whitelist this tag in the remove js script
          <script
            data-goatcounter="https://jackrose.goatcounter.com/count"
            async
            src="//gc.zgo.at/count.js"
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
