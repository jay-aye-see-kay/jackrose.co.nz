import { formatDate } from "../lib/datetime";
import { Post } from "../lib/content";

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
    <pre className="px-1 text-xs text-gray-600">
      ---
      <div>Posted: {formatDate(post.created)}</div>
      {post.updated && <div>Updated: {formatDate(post.updated)}</div>}
      <div>
        Reading time: {readingTime}min ({wordCount} words)
      </div>
      ---
    </pre>
  );
};
