import html from "remark-html";
import remark from "remark";

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};
