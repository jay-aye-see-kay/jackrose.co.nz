import Link from "next/link";

import { Post } from "../lib/codecs";
import { formatDate } from "../lib/datetime";

type Props = {
  post: Post;
};

export const BlogListItem = ({ post }: Props) => {
  return (
    <li key={post.slug}>
      <Link href={`blog/${post.slug}`}>{post.title}</Link>
      {post.description && <div className="text-sm">{post.description}</div>}
      <div className="text-sm">{formatDate(post.created)}</div>
    </li>
  );
};
