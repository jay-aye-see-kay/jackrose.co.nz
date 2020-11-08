import { GetStaticProps, GetStaticPaths } from "next";

import { DefaultLayout } from "../../components/Layouts";
import { PostMeta } from "../../components/PostMeta";
import {
  Post,
  getAllPosts,
  getPostBySlug,
  markdownToHtml,
} from "../../lib/content";

type Props = {
  post: Post;
  content: string;
};

const PostPage = ({ post, content }: Props) => {
  return (
    <DefaultLayout>
      <div className="page-content">
        <h1 className="page-title">{post.title}</h1>
        <PostMeta post={post} />
        <div
          className="markdown-styles"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!(params && typeof params.slug === "string")) {
    throw new Error("invalid slug");
  }
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content);
  return {
    props: { post, content },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let posts = getAllPosts();

  // Don't build draft posts in prod
  if (process.env.NODE_ENV === "production") {
    posts = posts.filter((post) => !post.draft);
  }

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export default PostPage;
