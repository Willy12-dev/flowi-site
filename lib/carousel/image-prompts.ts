/**
 * Image prompts library — every visual asset the system needs has a
 * prompt template here. Loader + resolver consumes `content/prompts.json`.
 *
 * Resolution flow:
 *   1. caller picks a template by id or asset_class
 *   2. fills `vars` (each variable falls back to its default)
 *   3. style block (base + negative) is merged into the template body via
 *      {style.base} and {style.negative} placeholders
 *
 * The final rendered prompt is paste-ready for ChatGPT image gen, Gemini
 * Imagen, Midjourney, or Flux.
 */

import { promises as fs } from "fs";
import path from "path";

export interface PromptStyle {
  label: string;
  base: string;
  negative: string;
}

export interface PromptVariable {
  name: string;
  default: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  asset_class: string;
  asset_path: string;
  uses: string;
  size: string;
  aspect: string;
  style_default: string;
  prompt_template: string;
  variables: PromptVariable[];
}

interface PromptsFile {
  styles: Record<string, PromptStyle>;
  templates: PromptTemplate[];
}

let cache: PromptsFile | null = null;

export async function loadPrompts(): Promise<PromptsFile> {
  if (cache) return cache;
  const p = path.join(process.cwd(), "content", "prompts.json");
  const text = await fs.readFile(p, "utf8");
  cache = JSON.parse(text) as PromptsFile;
  return cache;
}

export function getTemplateById(
  registry: PromptsFile,
  id: string
): PromptTemplate | null {
  return registry.templates.find((t) => t.id === id) ?? null;
}

export function getTemplatesByClass(
  registry: PromptsFile,
  cls: string
): PromptTemplate[] {
  return registry.templates.filter((t) => t.asset_class === cls);
}

/**
 * Resolve a template into a paste-ready prompt string.
 * `vars` overrides defaults — anything missing falls back to the template's default.
 * `styleId` overrides the template's default style.
 */
export function resolvePrompt(
  registry: PromptsFile,
  templateId: string,
  vars: Record<string, string> = {},
  styleId?: string
): { prompt: string; assetPath: string; size: string; aspect: string } {
  const t = getTemplateById(registry, templateId);
  if (!t) throw new Error(`Unknown prompt template: ${templateId}`);

  const sId = styleId ?? t.style_default;
  const style = registry.styles[sId];
  if (!style) throw new Error(`Unknown style: ${sId}`);

  let prompt = t.prompt_template
    .replace(/{style\.base}/g, style.base)
    .replace(/{style\.negative}/g, style.negative);

  for (const v of t.variables) {
    const value = vars[v.name] ?? v.default;
    prompt = prompt.replace(new RegExp(`\\{${v.name}\\}`, "g"), value);
  }

  return {
    prompt,
    assetPath: t.asset_path,
    size: t.size,
    aspect: t.aspect,
  };
}
