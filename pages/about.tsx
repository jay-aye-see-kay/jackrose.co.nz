import { GetStaticProps } from "next";
import { DefaultLayout } from "../components/Layouts";
import { ContactDetails } from "../components/ContactDetails";
import { getMarkdownContent } from "../lib/content";

type Props = {
  content: string;
};

const About = ({ content }: Props) => {
  return (
    <DefaultLayout>
      <div className="page-content">
        <h1 className="page-title">About me</h1>
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
  const { content } = await getMarkdownContent("about");
  return {
    props: { content },
  };
};

export default About;
