"""Create the 3 Gumroad products for the bundle PDFs.

Gumroad's modern API doesn't accept file upload on product create. Flow:
  1. POST /v2/products  -> creates draft product (with name/price/desc)
  2. Try POST /v2/products/:id/files for file attachment
  3. If that fails, return draft URL; user uploads the file manually

Usage:
  python scripts/upload_bundles_to_gumroad.py --dry-run    # show what would happen
  python scripts/upload_bundles_to_gumroad.py              # actually create
  python scripts/upload_bundles_to_gumroad.py <bundle-id>  # one bundle only

Token comes from FlowiLeads/.env (GUMROAD_ACCESS_TOKEN).
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import requests
from loguru import logger

ROOT = Path(__file__).resolve().parent.parent
BUNDLE_DIR = ROOT / "public" / "bundles"
GUMROAD_API = "https://api.gumroad.com/v2"


def _load_token() -> str:
    """Pull GUMROAD_ACCESS_TOKEN from FlowiLeads/.env (the canonical home)."""
    if os.environ.get("GUMROAD_ACCESS_TOKEN"):
        return os.environ["GUMROAD_ACCESS_TOKEN"]
    env_path = Path("C:/Users/User/FlowiLeads/.env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.strip().startswith("GUMROAD_ACCESS_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("GUMROAD_ACCESS_TOKEN not found in env or FlowiLeads/.env")


BUNDLES: dict[str, dict] = {
    "algo-traders-playbook": {
        "file": "algo-traders-playbook.pdf",
        "name": "The Algo Trader's Playbook — 4 essays on why retail algo trading fails",
        "price_cents": 900,
        "description": """**Four essays on why most retail algorithmic trading systems blow up at month four — and the architecture that survives.**

Inside:
- **Why most retail algo trading systems fail at month four** — the regime-shift problem and the infrastructure most retail builds skip
- **AI trading bots beat backtests, then break in live** — the six lies backtests can't simulate
- **How institutional desks use ICT** — multi-timeframe confluence, session-aware filtering, why retail tools miss the point
- **Best institutional-grade trading platforms for independent traders** — honest comparison of TradeStation, NinjaTrader, MultiCharts, QuantConnect, TradingView, FlowiAI Trader

~5,500 words. Hand-set editorial typography. One weekend to read.

Compiled from the trading vertical of Flowi's daily AI brief at useflowi.app/blog.""",
        "tags": ["algorithmic trading", "retail trading", "ICT", "smart money concepts", "trading bot", "forex"],
    },
    "behavior-change-playbook": {
        "file": "behavior-change-playbook.pdf",
        "name": "The Behavior Change Playbook — 4 essays on why most recovery apps fail",
        "price_cents": 900,
        "description": """**Four essays on why streak-based recovery apps fail at month three — and the relapse-aware architecture that actually works.**

Inside:
- **Why habit tracker apps don't survive the third month** — the 70% drop-off and the broken feedback loop
- **The discipline app paradox** — why downloading more apps makes outcomes worse (the moral-licensing effect)
- **What every recovery app gets wrong about relapse** — Marlatt's relapse-prevention model and the Abstinence Violation Effect
- **Best behavior-change apps for breaking compulsive habits** — honest comparison of Habitica, Streaks, Brick, Fortify, Woyuduin

~5,500 words. Compiled from the behavior vertical of Flowi's daily brief.""",
        "tags": ["behavior change", "habit tracker", "addiction recovery", "porn recovery", "behavioral psychology", "relapse prevention"],
    },
    "ai-builders-field-guide": {
        "file": "ai-builders-field-guide.pdf",
        "name": "The AI Builder's Field Guide — 4 essays on what shipped in AI this month",
        "price_cents": 900,
        "description": """**Four essays on what shipped in AI this month — and what the production patterns mean if you're building agents.**

Inside:
- **Claude Mythos found hundreds of Firefox bugs** — the real story is the triage shift in security teams
- **OpenAI gates Spud to cyber defenders** — the gating IS the new product surface
- **Code w/ Claude 2026: what actually shipped, what was theater** — background sub-agents, durable plans, the skill system
- **Best books for building AI agents in 2026** — honest review of Huyen, Pai, Alammar, and the gap none of them fills

~5,500 words. Compiled from the AI builder vertical of Flowi's daily brief.""",
        "tags": ["AI engineering", "claude code", "AI agents", "LLM", "production AI", "AI security"],
    },
}


def create_product(token: str, bundle_id: str, b: dict, dry_run: bool = False) -> dict:
    file_path = BUNDLE_DIR / b["file"]
    if not file_path.exists():
        raise SystemExit(f"PDF not found: {file_path}")

    logger.info(f"[{bundle_id}]")
    logger.info(f"  name:  {b['name']}")
    logger.info(f"  price: ${b['price_cents'] / 100:.2f}")
    logger.info(f"  pdf:   {file_path.name} ({file_path.stat().st_size // 1024} KB)")

    if dry_run:
        logger.info("  -> dry-run: not calling API")
        return {"id": "(dry-run)", "url": "(dry-run)"}

    data = {
        "access_token": token,
        "name": b["name"],
        "description": b["description"],
        "price": str(b["price_cents"]),
    }
    r = requests.post(f"{GUMROAD_API}/products", data=data, timeout=60)
    if r.status_code >= 400:
        logger.error(f"  POST /products failed: {r.status_code} {r.text[:300]}")
        return {"error": r.text[:200]}

    body = r.json()
    if not body.get("success"):
        logger.error(f"  Gumroad rejected: {body}")
        return {"error": str(body)[:200]}

    product = body.get("product", {})
    product_id = product.get("id")
    short_url = product.get("short_url") or product.get("custom_permalink") or ""
    logger.info(f"  ✓ product created: id={product_id}")
    logger.info(f"  ✓ url: {short_url}")

    # Try to attach the PDF via the modern files endpoint
    with file_path.open("rb") as f:
        files = {"file": (file_path.name, f, "application/pdf")}
        file_data = {"access_token": token}
        # The endpoint that may work:
        fr = requests.post(
            f"{GUMROAD_API}/products/{product_id}/files",
            data=file_data,
            files=files,
            timeout=300,
        )

    if fr.status_code < 400:
        logger.info(f"  ✓ PDF attached via /files endpoint")
    else:
        logger.warning(f"  ⚠ /files endpoint returned {fr.status_code}: {fr.text[:200]}")
        logger.warning(f"  → upload PDF manually at: https://gumroad.com/products/{product_id}/edit")

    # Try to add tags
    if b.get("tags"):
        tr = requests.put(
            f"{GUMROAD_API}/products/{product_id}",
            data={"access_token": token, "tags[]": b["tags"]},
            timeout=30,
        )
        if tr.status_code < 400:
            logger.info(f"  ✓ tags added: {', '.join(b['tags'])}")
        else:
            logger.warning(f"  ⚠ tag PUT failed: {tr.status_code}")

    return {
        "id": product_id,
        "url": short_url,
        "edit_url": f"https://gumroad.com/products/{product_id}/edit",
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Create Gumroad products from bundle PDFs")
    ap.add_argument("bundle_id", nargs="?", help="single bundle id (omit for all)")
    ap.add_argument("--dry-run", action="store_true", help="don't actually call Gumroad")
    args = ap.parse_args()

    token = _load_token()
    ids = [args.bundle_id] if args.bundle_id else list(BUNDLES)

    results: list[tuple[str, dict]] = []
    for bid in ids:
        if bid not in BUNDLES:
            logger.error(f"unknown: {bid}")
            continue
        result = create_product(token, bid, BUNDLES[bid], dry_run=args.dry_run)
        results.append((bid, result))
        logger.info("")

    print()
    print("=" * 72)
    print("  GUMROAD CREATE - SUMMARY")
    print("=" * 72)
    for bid, r in results:
        if r.get("error"):
            print(f"  [FAIL] {bid}: {r['error']}")
        elif args.dry_run:
            print(f"  [dry]  {bid}: (dry-run)")
        else:
            print(f"  [OK]   {bid}")
            print(f"         product:  {r.get('url')}")
            print(f"         edit:     {r.get('edit_url')}")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
