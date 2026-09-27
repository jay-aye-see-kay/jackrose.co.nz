import type { APIRoute } from "astro";

// Three URLs don't need an integration. When a blog arrives, either list
// posts here from the content collection or switch to @astrojs/sitemap.
const paths = ["/", "/cv"];

export const GET: APIRoute = ({ site }) => {
  const urls = paths
    .map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
