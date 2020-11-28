import { GetStaticProps } from "next";
import { DefaultLayout } from "../components/Layouts";
import { ContactDetails } from "../components/ContactDetails";
import { PageTitle } from "../components/PageTitle";
import { readMarkdownFile } from "../lib/content";
import { markdownToReact } from "../lib/parseMarkdown";

type Props = {
  markdown: string;
};

const About = ({ markdown }: Props) => {
  return (
    <DefaultLayout>
      <div className="page-content">
        <PageTitle>About me</PageTitle>
        {markdownToReact(markdown)}
        <ContactDetails />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { markdown } = readMarkdownFile("about");
  return {
    props: { markdown },
  };
};

export default About;
