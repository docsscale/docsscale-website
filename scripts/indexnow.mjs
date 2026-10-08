// Tells search engines that take IndexNow (Bing and its partners; not Google,
// which reads the sitemap) that pages changed, so they are crawled sooner.
//   node scripts/indexnow.mjs --posts slug-a,slug-b    new or updated posts
//   node scripts/indexnow.mjs https://docsscale.com/x/  any live addresses
//   add --dry-run to print what would be sent and send nothing
//
// A post also changes the blog list and the home page's "From the blog"
// section, so those two addresses go with every post.
//
// The key proves the addresses are ours. It is public by design: the file
// web/public/<key>.txt holds it and is served at https://docsscale.com/<key>.txt.
// It is not a secret and gives no access to anything.
//
// Never fails a release: the pages are already live when this runs, so a
// refusal is reported as a warning and the exit code stays 0.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "docsscale.com";
const SITE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keyFiles = fs
  .readdirSync(path.join(root, "web/public"))
  .filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (keyFiles.length !== 1) {
  console.log(
    `::warning::IndexNow: expected one key file in web/public, found ${keyFiles.length}; nothing sent.`,
  );
  process.exit(0);
}
const key = keyFiles[0].replace(".txt", "");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const postsArg = args.includes("--posts")
  ? args[args.indexOf("--posts") + 1]
  : "";
const slugs = postsArg
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const given = args.filter((a) => a.startsWith(`${SITE}/`));

const urls = [
  ...new Set([
    ...slugs.map((slug) => `${SITE}/blog/${slug}/`),
    ...(slugs.length ? [`${SITE}/blog/`, `${SITE}/`] : []),
    ...given,
  ]),
];
if (urls.length === 0) {
  console.log("IndexNow: no addresses given; nothing sent.");
  process.exit(0);
}

const body = {
  host: HOST,
  key,
  keyLocation: `${SITE}/${key}.txt`,
  urlList: urls,
};
if (dryRun) {
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  // 200: received. 202: received, key still being checked (normal the first time).
  if (res.status === 200 || res.status === 202) {
    console.log(
      `IndexNow: ${urls.length} address(es) sent (${res.status}):\n  ${urls.join("\n  ")}`,
    );
  } else {
    console.log(
      `::warning::IndexNow answered ${res.status}: ${(await res.text()).slice(0, 300)}`,
    );
  }
} catch (error) {
  console.log(`::warning::IndexNow could not be reached: ${error.message}`);
}
