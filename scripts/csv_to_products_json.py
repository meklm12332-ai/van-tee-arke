#!/usr/bin/env python3
"""
Turn a filled-in products spreadsheet (CSV) into assets/data/products.json,
which the shop page (shop.html) reads to build the product grid and the
collection filter tabs automatically.

Usage:
    python3 scripts/csv_to_products_json.py assets/data/products.csv

CSV columns (see assets/data/products-template.csv for an example):
    name        product name, e.g. "Solitaire Halo Ring"
    collection  group name, e.g. "Éternel" — any text; new names just work,
                a matching filter tab appears on the shop page automatically
    material    one-line description, e.g. "18K white gold, diamond pavé"
    price       leave blank to show "Price on request", or type any price text
    image       filename only — the file must already exist in assets/images/
                (e.g. "coll-eternel.jpg")
    link        optional — where "Enquire" points to; leave blank for the
                default (index.html#visit)

Re-run this any time the spreadsheet changes; it fully replaces products.json.
"""
import csv
import json
import sys
import os

REQUIRED = ["name", "collection", "material", "price", "image", "link"]
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "products.json")


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/csv_to_products_json.py <path-to-csv>")
        sys.exit(1)

    src = sys.argv[1]
    rows = []
    missing_images = []

    with open(src, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        header = [h.strip() for h in (reader.fieldnames or [])]
        missing_cols = [c for c in REQUIRED if c not in header]
        if missing_cols:
            print(f"CSV is missing column(s): {', '.join(missing_cols)}")
            print(f"Expected columns: {', '.join(REQUIRED)}")
            sys.exit(1)

        for i, row in enumerate(reader, start=2):  # row 1 is the header
            name = (row.get("name") or "").strip()
            if not name:
                continue  # skip blank rows
            image = (row.get("image") or "").strip()
            if image and not os.path.isfile(os.path.join(IMAGES_DIR, image)):
                missing_images.append((i, image))
            rows.append({
                "name": name,
                "collection": (row.get("collection") or "").strip(),
                "material": (row.get("material") or "").strip(),
                "price": (row.get("price") or "").strip(),
                "image": image,
                "link": (row.get("link") or "").strip() or "index.html#visit",
            })

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(rows)} product(s) to {os.path.relpath(OUT_PATH)}")
    if missing_images:
        print("\nHeads up — these rows point at images not yet in assets/images/:")
        for line_no, image in missing_images:
            print(f"  row {line_no}: {image}")
        print("The product will still show (as a gold placeholder) until you add the file.")


if __name__ == "__main__":
    main()
