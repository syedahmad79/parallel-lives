import { readFile, writeFile } from "node:fs/promises";
const raw = process.argv[2];
if (!raw)
  throw new Error(
    "Usage: node scripts/set-public-url.mjs https://your-domain.example/",
  );
const url = new URL(raw);
if (
  url.protocol !== "https:" ||
  url.username ||
  url.password ||
  url.search ||
  url.hash
)
  throw new Error(
    "Provide a public HTTPS URL without credentials, queries, or fragments.",
  );
if (!url.pathname.endsWith("/")) url.pathname += "/";
const safe = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
let html = await readFile(new URL("../index.html", import.meta.url), "utf8");
html = html.replace(
  /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
  `<meta property="og:image" content="${safe(new URL("social-preview.png", url).href)}"/>`,
);
html = html
  .replace(/<meta\s+property="og:url"[^>]*>/g, "")
  .replace(/<link\s+rel="canonical"[^>]*>/g, "");
html = html.replace(
  "</head>",
  `<meta property="og:url" content="${safe(url.href)}"/><link rel="canonical" href="${safe(url.href)}"/></head>`,
);
await writeFile(new URL("../index.html", import.meta.url), html);
console.log(
  "Public metadata configured. Run npm run build and deploy the new dist folder.",
);
