import * as t from "io-ts";
import { isRight } from "fp-ts/Either";

export const MetaCodec = t.intersection([
  t.type({
    title: t.string,
    created: t.string,
  }),
  t.partial({
    updated: t.string,
    description: t.string,
    draft: t.boolean,
    archived: t.boolean,
  }),
]);

export const decodePostMeta = (data: unknown) => {
  const maybePostMeta = MetaCodec.decode(data);
  if (isRight(maybePostMeta)) {
    return maybePostMeta.right;
  }
  console.log(maybePostMeta.left);
  throw new Error("could not decode post");
};

export type PostMeta = t.TypeOf<typeof MetaCodec>;
export type Post = PostMeta & {
  slug: string;
  content: string;
  markdown: string;
  path: string;
};
