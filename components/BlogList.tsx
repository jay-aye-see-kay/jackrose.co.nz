import Link from "next/link";

import { BlogListItem } from "../components/BlogListItem";
import { Post } from "../lib/codecs";

type Props = {
  posts: Post[];
  lastLink: {
    label: string;
    href: string;
  };
};

export const BlogList = ({ posts, lastLink }: Props) => {
  return (
    <ul className="mt-4">
      {posts.map((post) => (
        <>
          <BlogListItem key={post.slug} post={post} />
          <div className="text-center">~</div>
        </>
      ))}
      <div className="text-center">
        <Link href={lastLink.href}>{lastLink.label}</Link>
      </div>
    </ul>
  );
};
