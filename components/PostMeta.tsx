import { formatDate } from "../lib/datetime";
import { Post } from "../lib/codecs";

import { PageTitle } from "./PageTitle";

const AVG_READING_WPM = 200;
const AVG_WORD_LENGTH = 5;

const countWords = (content: string) => {
  const charCount = content.replace(/\W/g, "").length;
  const wordCount = Math.round(charCount / AVG_WORD_LENGTH);
  const readingTime = Math.round(wordCount / AVG_READING_WPM);
  return { wordCount, readingTime: readingTime < 1 ? 1 : readingTime };
};

type Props = {
  post: Post;
};

export const PostMeta = ({ post }: Props) => {
  const { wordCount, readingTime } = countWords(post.content);

  return (
    <div className="pt-2 pb-4 my-4 bg-black1">
      <PageTitle>{post.title}</PageTitle>
      <pre className="text-sm text-white page-content">
        <div>Posted: {formatDate(post.created)}</div>
        {post.updated && <div>Updated: {formatDate(post.updated)}</div>}
        <div>
          Reading time: {readingTime}min ({wordCount} words)
        </div>
        {post.draft && <div>Draft: true</div>}
        {post.archived && <div>_This post has been archived_</div>}
      </pre>
    </div>
  );
};
