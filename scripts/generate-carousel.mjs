#!/usr/bin/env node
/**
 * Batch carousel generation.
 *
 *   node scripts/generate-carousel.mjs <spec-id-or-path> [--server http://localhost:3000]
 *
 * Reads a carousel spec, posts it to /api/carousel/zip, saves the zip
 * to output/carousels/<spec.id>.zip and extracts it to output/carousels/<spec.id>/.
 *
 * Requires the dev server to be running locally (or pass --server pointing at prod).
 * Auth: reads ADMIN_PASSWORD from .env.local, logs in, then posts.
 */

import fs from "node:fs/promises";
import { existsSync, createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = { positional: [], server: "http://localhost:3000" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--server") out.server = argv[++i];
    else out.positional.push(a);
  }
  return out;
}

async function loadEnvLocal() {
  const envFile = path.join(ROOT, ".env.local");
  if (!existsSync(envFile)) return {};
  const text = await fs.readFile(envFile, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

async function login(server, password) {
  const r = await fetch(`${server}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!r.ok) throw new Error(`Admin login failed: ${r.status} ${await r.text()}`);
  const setCookie = r.headers.get("set-cookie") || "";
  const m = setCookie.match(/flowi_admin=([^;]+)/);
  if (!m) throw new Error("No flowi_admin cookie in login response");
  return `flowi_admin=${m[1]}`;
}

async function resolveSpec(arg) {
  // Try as direct file path first.
  if (existsSync(arg)) {
    return JSON.parse(await fs.readFile(arg, "utf8"));
  }
  // Then as a spec ID under content/carousel-specs/.
  const candidate = path.join(ROOT, "content", "carousel-specs", `${arg}.json`);
  if (existsSync(candidate)) {
    return JSON.parse(await fs.readFile(candidate, "utf8"));
  }
  throw new Error(`Spec not found: ${arg} (tried ${candidate})`);
}

// Minimal store-only ZIP reader.
function readZip(buf) {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const entries = [];
  let i = 0;
  while (i < buf.length - 4) {
    const sig = view.getUint32(i, true);
    if (sig !== 0x04034b50) break;
    const method = view.getUint16(i + 8, true);
    const csize = view.getUint32(i + 18, true);
    const nameLen = view.getUint16(i + 26, true);
    const extraLen = view.getUint16(i + 28, true);
    const name = new TextDecoder().decode(
      buf.subarray(i + 30, i + 30 + nameLen)
    );
    const dataStart = i + 30 + nameLen + extraLen;
    if (method !== 0) {
      throw new Error(`Compressed entries not supported (${name})`);
    }
    const data = buf.subarray(dataStart, dataStart + csize);
    entries.push({ name, data });
    i = dataStart + csize;
  }
  return entries;
}

async function main() {
  const { positional, server } = parseArgs(process.argv.slice(2));
  if (positional.length === 0) {
    console.error(
      "usage: node scripts/generate-carousel.mjs <spec-id-or-path> [--server URL]"
    );
    process.exit(1);
  }

  const env = await loadEnvLocal();
  const password = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD not found in env or .env.local");
  }

  const cookie = await login(server, password);
  console.log(`> logged in to ${server}`);

  for (const arg of positional) {
    const spec = await resolveSpec(arg);
    if (!spec.id) throw new Error(`Spec ${arg} missing id`);
    console.log(`> rendering ${spec.id} (${spec.slides.length} slides)`);

    const r = await fetch(`${server}/api/carousel/zip`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(spec),
    });
    if (!r.ok) {
      throw new Error(`Zip render failed: ${r.status} ${await r.text()}`);
    }
    const buf = Buffer.from(await r.arrayBuffer());

    const outDir = path.join(ROOT, "output", "carousels", spec.id);
    await fs.mkdir(outDir, { recursive: true });

    const zipPath = path.join(outDir, `${spec.id}.zip`);
    await fs.writeFile(zipPath, buf);

    for (const entry of readZip(buf)) {
      const dest = path.join(outDir, entry.name);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, entry.data);
    }
    console.log(`  -> ${outDir}/`);
  }
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
