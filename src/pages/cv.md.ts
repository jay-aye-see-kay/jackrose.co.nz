// The canonical CV, served byte-for-byte from copy/cv.md.
// In production the Content-Type comes from public/_headers (static hosting
// ignores endpoint headers); setting it here keeps `just dev` honest.
import type { APIRoute } from "astro";
import { source } from "../lib/cv";

export const GET: APIRoute = () =>
  new Response(source, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
