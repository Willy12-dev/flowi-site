/**
 * Font loader for Satori (next/og).
 *
 * Satori does NOT support woff2 (it throws "Unsupported OpenType signature wOF2").
 * It accepts raw TTF/OTF only. We use @fontsource packages that ship .woff/.ttf
 * subsets, then decompress woff to ttf at runtime via the `wawoff2` WASM module.
 *
 * Implementation: read .woff2 from node_modules/@fontsource/*, decompress to
 * a TTF Uint8Array in memory, cache for the lifetime of the serverless instance.
 *
 * Fonts used across themes:
 *   - Fraunces 700 (display headlines)
 *   - Fraunces 700 italic (italic accent words)
 *   - Inter 400 (body sans)
 *   - Inter 600 (body sans semibold)
 *   - JetBrains Mono 400 (eyebrows, code, tables)
 */

import { promises as fs } from "fs";
import path from "path";

interface FontFile {
  name: string;
  weight: 400 | 600 | 700;
  style: "normal" | "italic";
  // Path under node_modules/@fontsource/<pkg>/files/
  fontsourcePath: string;
}

const FILES: FontFile[] = [
  {
    name: "Fraunces",
    weight: 700,
    style: "normal",
    fontsourcePath: "@fontsource/fraunces/files/fraunces-latin-700-normal.woff2",
  },
  {
    name: "FrauncesItalic",
    weight: 700,
    style: "italic",
    fontsourcePath: "@fontsource/fraunces/files/fraunces-latin-700-italic.woff2",
  },
  {
    name: "Inter",
    weight: 400,
    style: "normal",
    fontsourcePath: "@fontsource/inter/files/inter-latin-400-normal.woff2",
  },
  {
    name: "Inter",
    weight: 600,
    style: "normal",
    fontsourcePath: "@fontsource/inter/files/inter-latin-600-normal.woff2",
  },
  {
    name: "JetBrainsMono",
    weight: 400,
    style: "normal",
    fontsourcePath:
      "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
  },
];

export interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: "normal" | "italic";
}

let cache: LoadedFont[] | null = null;

export async function loadFonts(): Promise<LoadedFont[]> {
  if (cache) return cache;

  // Lazy-import wawoff2 — the WASM binary is ~140KB so we don't want it
  // pulled into Edge bundles unconditionally.
  const wawoff = await import("wawoff2");

  const out: LoadedFont[] = [];
  for (const f of FILES) {
    const fullPath = path.join(process.cwd(), "node_modules", f.fontsourcePath);
    let bytes: Uint8Array;
    try {
      bytes = await fs.readFile(fullPath);
    } catch (e) {
      throw new Error(
        `Font not found at ${fullPath}: ${(e as Error).message}. Run \`npm install @fontsource/fraunces @fontsource/inter @fontsource/jetbrains-mono\`.`
      );
    }
    let ttf: Uint8Array;
    try {
      ttf = await wawoff.decompress(bytes);
    } catch (e) {
      throw new Error(
        `Failed decompressing ${f.fontsourcePath}: ${(e as Error).message}`
      );
    }
    out.push({
      name: f.name,
      data: ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength) as ArrayBuffer,
      weight: f.weight,
      style: f.style,
    });
  }

  cache = out;
  return out;
}
