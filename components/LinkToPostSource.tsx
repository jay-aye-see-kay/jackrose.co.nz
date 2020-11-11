import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Post } from "../lib/codecs";

const POSTS_BASE_URL =
  "https://github.com/jay-aye-see-kay/jackrose.co.nz/blob/master/";

type Props = {
  post: Post;
};

export const LinkToPostSource = ({ post }: Props) => {
  return (
    <div className="py-4 my-8 text-right bg-black1 text-white1">
      <div className="page-content">
        <a href={POSTS_BASE_URL + post.path}>
          <FontAwesomeIcon className="mr-2 text-xs" icon={faExternalLinkAlt} />
          <span>View this post's source on GitHub</span>
        </a>
      </div>
    </div>
  );
};
