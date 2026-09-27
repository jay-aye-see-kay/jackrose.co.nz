// https://llmstxt.org — a plain map of the site for language models.
import type { APIRoute } from "astro";
import { cv, contact } from "../lib/cv";
import { site as me } from "../site";

const summary = cv.sections.find((s) => s.slug === "summary");
const summaryText = (summary?.html ?? "")
  .replace(/<\/p>\s*<p>/g, "\n\n")
  .replace(/<[^>]+>/g, "")
  .trim();
const email = contact.find((c) => c.href?.startsWith("mailto:"))?.value;

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const body = `# ${cv.name} — ${me.tagline}

> Personal site of ${cv.name}: a short about page, contact details, and a CV.

${summaryText}

## CV

- [CV (Markdown, canonical)](${url("/cv.md")}): the source of truth; the web view is generated from it
- [CV (web view)](${url("/cv")}): the same content as HTML

## About

- [Home](${url("/")}): about and contact
${email ? `- Email: ${email}\n` : ""}`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
