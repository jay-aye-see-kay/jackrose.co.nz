import { GetStaticProps } from "next";
import { DefaultLayout } from "../components/Layouts";
import { ContactDetails } from "../components/ContactDetails";
import { readMarkdownFile } from "../lib/content";
import { PageTitle } from "../components/PageTitle";

type Props = {
  content: string;
};

const About = ({ content }: Props) => {
  return (
    <DefaultLayout>
      <div className="page-content">
        <PageTitle>About me</PageTitle>
        <div
          className="mt-4 markdown-styles"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <ContactDetails />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { content } = readMarkdownFile("about");
  return {
    props: { content },
  };
};

export default About;
