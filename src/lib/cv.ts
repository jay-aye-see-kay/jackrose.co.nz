// Parses copy/cv.md into structured data for the /cv page.
//
// copy/cv.md is the source of truth (it's also served verbatim at /cv.md).
// This file only reads the *shape* of the markdown, it never adds content:
//
//   # CV - Name                          -> cv.name
//   ## Section                           -> a section, keyed by slug(title)
//   ### Start - End - Title @ Company    -> a job (inside any section)
//   **Role (Start - End)** + list        -> a role with bullets (roomy layout)
//   **Role (Start - End)** inline text   -> a role with a one-liner (compact)
//   anything else                        -> rendered as plain HTML, in order
//
// If a heading doesn't match the expected pattern it degrades to plain text
// rather than failing the build — the page should never be emptier than the
// markdown.

import type {
  Heading,
  List,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import source from "../../copy/cv.md?raw";

export { source };

export interface CV {
  name: string;
  sections: Section[];
}

export interface Section {
  title: string;
  slug: string;
  /** Free-form content before the first job, as HTML. */
  html: string;
  jobs: Job[];
}

export interface Job {
  heading: string;
  title: string;
  company?: string;
  /** Parenthetical after the company, e.g. "Melbourne Agency". */
  companyNote?: string;
  period?: Period;
  /** Paragraphs/lists that aren't attached to a role, as HTML. */
  html: string;
  roles: Role[];
}

export interface Role {
  title: string;
  /** "Staff SRE - Developer Experience" -> team "Developer Experience". */
  team?: string;
  period?: Period;
  /** Inline text after the bold title, as HTML (compact roles). */
  summary?: string;
  /** List items, as HTML (roomy roles). */
  bullets: string[];
}

export interface Period {
  label: string;
  start: YearMonth;
  end: YearMonth | "present";
  /** Inclusive month count, "present" measured to build time. */
  months: number;
}

export interface YearMonth {
  year: number;
  month: number; // 1-12
}

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseYearMonth(text: string): YearMonth | undefined {
  const m = text.trim().match(/^([A-Za-z]{3})[a-z]* (\d{4})$/);
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[1].toLowerCase()) + 1;
  if (month === 0) return undefined;
  return { year: Number(m[2]), month };
}

const now = new Date();
const NOW: YearMonth = { year: now.getFullYear(), month: now.getMonth() + 1 };

export function parsePeriod(text: string): Period | undefined {
  const m = text.match(/^(.+?)\s+-\s+(.+)$/);
  if (!m) return undefined;
  const start = parseYearMonth(m[1]);
  const end = /^present$/i.test(m[2].trim()) ? "present" : parseYearMonth(m[2]);
  if (!start || !end) return undefined;
  const e = end === "present" ? NOW : end;
  const months = (e.year - start.year) * 12 + (e.month - start.month) + 1;
  return { label: text.trim(), start, end, months };
}

/** "Jul 2022 – Present" (en dash, for display). */
export function formatPeriod(p: Period): string {
  return p.label.replace(/\s+-\s+/, " – ");
}

/** "4 yrs 2 mos", "11 mos", "2 yrs" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} mo${m === 1 ? "" : "s"}`);
  return parts.join(" ") || "0 mos";
}

/** "Jul 2022 - Present - Multiple Roles @ Culture Amp" */
function parseJobHeading(text: string): Omit<Job, "html" | "roles"> {
  const m = text.match(
    /^([A-Za-z]{3,} \d{4}\s+-\s+(?:Present|[A-Za-z]{3,} \d{4}))\s+-\s+(.+)$/i,
  );
  if (!m) return { heading: text, title: text };
  const period = parsePeriod(m[1]);
  const [title, companyPart] = m[2].split(/\s+@\s+/, 2);
  let company = companyPart;
  let companyNote: string | undefined;
  const note = companyPart?.match(/^(.+?)\s*\((.+)\)$/);
  if (note) {
    company = note[1];
    companyNote = note[2];
  }
  return { heading: text, title: title.trim(), company, companyNote, period };
}

// ---------------------------------------------------------------- rendering

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tiny inline renderer: the CV only uses a handful of node types. */
function inline(nodes: PhrasingContent[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
          return escape(n.value);
        case "strong":
          return `<strong>${inline(n.children)}</strong>`;
        case "emphasis":
          return `<em>${inline(n.children)}</em>`;
        case "inlineCode":
          return `<code>${escape(n.value)}</code>`;
        case "link":
          return `<a href="${escape(n.url)}">${inline(n.children)}</a>`;
        case "break":
          return "<br>";
        default:
          return escape(toString(n));
      }
    })
    .join("");
}

function listItems(list: List): string[] {
  return list.children.map((item) =>
    item.children
      .map((c) => (c.type === "paragraph" ? inline(c.children) : block(c)))
      .join(" "),
  );
}

function block(node: RootContent): string {
  switch (node.type) {
    case "paragraph":
      return `<p>${inline(node.children)}</p>`;
    case "list": {
      const tag = node.ordered ? "ol" : "ul";
      const items = listItems(node).map((i) => `<li>${i}</li>`).join("");
      return `<${tag}>${items}</${tag}>`;
    }
    case "heading":
      return `<h${node.depth}>${inline(node.children)}</h${node.depth}>`;
    case "thematicBreak":
      return "<hr>";
    default:
      return `<p>${escape(toString(node))}</p>`;
  }
}

// ------------------------------------------------------------------ parsing

/** A paragraph starting with **bold** is a role: "**Title (dates)** rest". */
function asRole(p: Paragraph): Role | undefined {
  const [first, ...rest] = p.children;
  if (first?.type !== "strong") return undefined;
  const label = toString(first).trim();
  const m = label.match(/^(.+?)\s*\((.+)\)$/);
  const period = m ? parsePeriod(m[2]) : undefined;
  const full = period && m ? m[1] : label;
  const [title, team] = full.split(/\s+-\s+/, 2);
  const summary = inline(rest).trim();
  return { title, team, period, summary: summary || undefined, bullets: [] };
}

function parseJob(heading: Heading, body: RootContent[]): Job {
  const job: Job = { ...parseJobHeading(toString(heading)), html: "", roles: [] };
  let role: Role | undefined;
  for (const node of body) {
    const r = node.type === "paragraph" ? asRole(node) : undefined;
    if (r) {
      role = r;
      job.roles.push(r);
    } else if (node.type === "list" && role && !role.summary) {
      role.bullets.push(...listItems(node));
    } else {
      role = undefined;
      job.html += block(node);
    }
  }
  return job;
}

function parseSection(heading: Heading, body: RootContent[]): Section {
  const title = toString(heading);
  const section: Section = { title, slug: slugify(title), html: "", jobs: [] };
  let jobHeading: Heading | undefined;
  let jobBody: RootContent[] = [];
  const flush = () => {
    if (jobHeading) section.jobs.push(parseJob(jobHeading, jobBody));
    jobBody = [];
  };
  for (const node of body) {
    if (node.type === "heading" && node.depth === 3) {
      flush();
      jobHeading = node;
    } else if (jobHeading) {
      jobBody.push(node);
    } else {
      section.html += block(node);
    }
  }
  flush();
  return section;
}

export function parseCV(markdown: string): CV {
  const tree: Root = fromMarkdown(markdown);
  let name = "";
  const sections: Section[] = [];
  let heading: Heading | undefined;
  let body: RootContent[] = [];
  const flush = () => {
    if (heading) sections.push(parseSection(heading, body));
    body = [];
  };
  for (const node of tree.children) {
    if (node.type === "heading" && node.depth === 1) {
      name = toString(node).replace(/^CV\s*[-–—:]\s*/i, "");
    } else if (node.type === "heading" && node.depth === 2) {
      flush();
      heading = node;
    } else if (heading) {
      body.push(node);
    }
  }
  flush();
  return { name, sections };
}

/** "- **Email**: hey@..." list items -> label/value/href. */
export function parseContact(markdown: string): ContactItem[] {
  const tree = fromMarkdown(markdown);
  const section = findSection(tree, "contact");
  const list = section.find((n): n is List => n.type === "list");
  if (!list) return [];
  return list.children.map((item) => {
    const text = toString(item);
    const m = text.match(/^([^:]+):\s*(.+)$/);
    const label = m ? m[1].trim() : "";
    const value = (m ? m[2] : text).trim();
    return { label, value, href: contactHref(value) };
  });
}

function contactHref(value: string): string | undefined {
  if (/^[^@\s]+@[^@\s]+\.[a-z]+$/i.test(value)) return `mailto:${value}`;
  if (/^https?:\/\//.test(value)) return value;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(value)) return `https://${value}`;
  return undefined;
}

function findSection(tree: Root, slug: string): RootContent[] {
  const out: RootContent[] = [];
  let inside = false;
  for (const node of tree.children) {
    if (node.type === "heading" && node.depth <= 2) {
      inside = node.depth === 2 && slugify(toString(node)) === slug;
    } else if (inside) {
      out.push(node);
    }
  }
  return out;
}

export const cv = parseCV(source);
export const contact = parseContact(source);
