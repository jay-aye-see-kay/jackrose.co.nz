import { format } from "date-fns";

import { Post } from "../lib/api";

const formatDate = (date?: string) => {
  if (!date) return;
  return format(new Date(date), "yyyy-MM-dd");
};

type Props = {
  post: Post;
};

export const PostMeta = ({ post }: Props) => {
  return (
    <pre className="px-1 text-xs text-gray-600">
      ---
      <div>Posted: {formatDate(post.created)}</div>
      {post.updated && <div>Updated: {formatDate(post.updated)}</div>}
      ---
    </pre>
  );
};
