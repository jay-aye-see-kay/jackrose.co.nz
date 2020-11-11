import { GetStaticProps } from "next";

import { DefaultLayout } from "../components/Layouts";
import { BlogList } from "../components/BlogList";
import { getAllPosts } from "../lib/content";
import { Post } from "../lib/codecs";
import { PageTitle } from "../components/PageTitle";

type Props = {
  posts: Post[];
};

const Posts = ({ posts }: Props) => {
  return (
    <DefaultLayout>
      <div className="page-content">
        <PageTitle>Blog posts</PageTitle>
        <BlogList
          posts={posts}
          lastLink={{ label: "Archived posts »", href: "/blog-archive" }}
        />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((post) => !post.archived && !post.draft);
  return {
    props: { posts },
  };
};

export default Posts;
