import html from "remark-html";
import remark from "remark";

export const markdownToHtml = async (markdown) => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};
