/**
 * Gumroad API helper.
 *
 * Reads sales + product data using GUMROAD_ACCESS_TOKEN (set on Vercel).
 * All calls happen server-side. The token never leaves Vercel's runtime.
 *
 * Docs: https://app.gumroad.com/api
 */

const API_BASE = "https://api.gumroad.com/v2";

export interface GumroadProduct {
  id: string;
  name: string;
  price: number; // cents
  short_url: string;
  preview_url?: string;
  sales_count: number;
  sales_usd_cents: number;
  published: boolean;
  custom_permalink?: string;
}

export interface GumroadSale {
  id: string;
  product_id: string;
  product_name: string;
  email: string;
  price: number; // cents
  created_at: string;
  referrer?: string;
  url_params?: Record<string, string>;
  variants?: string;
}

const FETCH_TIMEOUT_MS = 8000;

async function gumroadFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) throw new Error("GUMROAD_ACCESS_TOKEN not set on server");

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url.toString(), { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`Gumroad ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const data = await r.json();
    if (!data.success) throw new Error(`Gumroad rejected: ${JSON.stringify(data).slice(0, 200)}`);
    return data as T;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

export async function listProducts(): Promise<GumroadProduct[]> {
  type Resp = { success: boolean; products: GumroadProduct[] };
  const data = await gumroadFetch<Resp>("/products");
  return data.products || [];
}

export async function listRecentSales(afterISODate?: string): Promise<GumroadSale[]> {
  type Resp = { success: boolean; sales: GumroadSale[]; next_page_url?: string };
  const params: Record<string, string> = {};
  if (afterISODate) params.after = afterISODate.slice(0, 10); // YYYY-MM-DD
  const data = await gumroadFetch<Resp>("/sales", params);
  return data.sales || [];
}

export interface SalesSnapshot {
  products: GumroadProduct[];
  totalSales: number;
  totalRevenueCents: number;
  recentSales: GumroadSale[];
  last24h: { count: number; revenueCents: number };
  last7d: { count: number; revenueCents: number };
  byProduct: Array<{ id: string; name: string; sales: number; revenueCents: number }>;
  byReferrer: Array<{ source: string; count: number }>;
  errors: string[];
}

export async function getSalesSnapshot(): Promise<SalesSnapshot> {
  const errors: string[] = [];
  let products: GumroadProduct[] = [];
  let recentSales: GumroadSale[] = [];

  try {
    products = await listProducts();
  } catch (e) {
    errors.push(`products: ${(e as Error).message}`);
  }

  // Pull last ~30 days of sales
  const thirtyAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  try {
    recentSales = await listRecentSales(thirtyAgo);
  } catch (e) {
    errors.push(`sales: ${(e as Error).message}`);
  }

  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const last24h = recentSales
    .filter((s) => new Date(s.created_at).getTime() >= dayAgo)
    .reduce(
      (acc, s) => ({ count: acc.count + 1, revenueCents: acc.revenueCents + (s.price || 0) }),
      { count: 0, revenueCents: 0 }
    );

  const last7d = recentSales
    .filter((s) => new Date(s.created_at).getTime() >= weekAgo)
    .reduce(
      (acc, s) => ({ count: acc.count + 1, revenueCents: acc.revenueCents + (s.price || 0) }),
      { count: 0, revenueCents: 0 }
    );

  const totalSales = products.reduce((s, p) => s + (p.sales_count || 0), 0);
  const totalRevenueCents = products.reduce((s, p) => s + (p.sales_usd_cents || 0), 0);

  const byProduct = products
    .map((p) => ({
      id: p.id,
      name: p.name,
      sales: p.sales_count || 0,
      revenueCents: p.sales_usd_cents || 0,
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents);

  // Referrer breakdown from recent sales
  const refCounts = new Map<string, number>();
  for (const s of recentSales) {
    const ref = (s.referrer || "direct").replace(/^https?:\/\//, "").split("/")[0] || "direct";
    refCounts.set(ref, (refCounts.get(ref) || 0) + 1);
  }
  const byReferrer = Array.from(refCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    products,
    totalSales,
    totalRevenueCents,
    recentSales: recentSales.slice(0, 25),
    last24h,
    last7d,
    byProduct,
    byReferrer,
    errors,
  };
}

export function fmtUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
