/**
 * Courses registry loader.
 *
 * Reads `content/courses.json` and exposes typed helpers for matching a
 * carousel's `topic` (or vertical fallback) to the right funnel — primary
 * course CTA + secondary "next step" mention.
 *
 * Status values:
 *   - "live"        → user-facing Gumroad URL is live; CTA links there
 *   - "waitlist"    → landing page collects emails; CTA invites signups
 *   - "coming_soon" → no page yet; CTA defaults to DM mechanic
 */

import { promises as fs } from "fs";
import path from "path";
import type { Vertical } from "./types";

export type CourseStatus = "live" | "waitlist" | "coming_soon";

export interface Course {
  slug: string;
  title: string;
  topics: string[];
  vertical: Vertical;
  price_usd: number;
  status: CourseStatus;
  url: string;
  cta_keyword: string;
  cta_promise: string;
}

export interface SecondaryRoute {
  name: string;
  url: string;
  tagline: string;
}

interface CoursesFile {
  courses: Course[];
  secondary_routes: Record<Vertical, SecondaryRoute>;
}

let cache: CoursesFile | null = null;

async function load(): Promise<CoursesFile> {
  if (cache) return cache;
  const p = path.join(process.cwd(), "content", "courses.json");
  const text = await fs.readFile(p, "utf8");
  cache = JSON.parse(text) as CoursesFile;
  return cache;
}

/**
 * Synchronous accessor for code that already has the registry in hand.
 * Most call sites should use `loadCourses()` instead.
 */
export function getCachedCourses(): CoursesFile {
  if (!cache) {
    throw new Error("courses registry not loaded — call loadCourses() first");
  }
  return cache;
}

export async function loadCourses(): Promise<CoursesFile> {
  return load();
}

/**
 * Pick the primary course for a carousel given its (optional) topic + vertical.
 * Matching order:
 *   1. exact topic match in course.topics[]
 *   2. exact vertical match — return the first live course in that vertical
 *   3. null (caller falls back to a generic CTA)
 */
export function pickPrimaryCourse(
  registry: CoursesFile,
  vertical: Vertical,
  topic?: string
): Course | null {
  if (topic) {
    const byTopic = registry.courses.find((c) =>
      c.topics.includes(topic.toLowerCase())
    );
    if (byTopic) return byTopic;
  }
  const byVertical = registry.courses.find(
    (c) => c.vertical === vertical && c.status === "live"
  );
  return byVertical ?? null;
}

export function getSecondaryRoute(
  registry: CoursesFile,
  vertical: Vertical
): SecondaryRoute | null {
  return registry.secondary_routes[vertical] ?? null;
}

/**
 * Format the CTA line for a given course, adapted to its status.
 */
export function ctaLineFor(course: Course): string {
  switch (course.status) {
    case "live":
      return `Comment "${course.cta_keyword}" — I'll DM you the link. Or grab it directly: ${course.url}`;
    case "waitlist":
      return `Comment "${course.cta_keyword}" and I'll add you to the waitlist (launch this month). Or sign up: ${course.url}`;
    case "coming_soon":
      return `Comment "${course.cta_keyword}" — I'll DM you when it drops.`;
  }
}
