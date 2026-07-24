#!/usr/bin/env python3
"""Render a workbook HTML file to a PDF using the workbook design system.

Usage:
    python render.py input.html output.pdf [--css path/to/workbook.css]

The script auto-attaches workbook.css (found next to this file unless --css is
given), so the HTML you write only needs the documented classes — no <link> and
no inline styling required.
"""
import argparse
import os
import sys
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


def main():
    ap = argparse.ArgumentParser(description="Render workbook HTML to styled PDF.")
    ap.add_argument("input", help="Path to the source HTML file.")
    ap.add_argument("output", help="Path for the generated PDF.")
    ap.add_argument("--css", default=None,
                    help="Override path to workbook.css (default: next to this script).")
    args = ap.parse_args()

    here = os.path.dirname(os.path.abspath(__file__))
    css_path = args.css or os.path.join(here, "workbook.css")
    if not os.path.exists(css_path):
        sys.exit(f"Stylesheet not found: {css_path}")
    if not os.path.exists(args.input):
        sys.exit(f"Input HTML not found: {args.input}")

    font_config = FontConfiguration()
    # CSS base_url = stylesheet location, so url('fonts/...') resolves to assets/fonts.
    stylesheet = CSS(filename=css_path, font_config=font_config)
    # HTML base_url = its own folder, so any local images the author references resolve.
    document = HTML(filename=args.input,
                    base_url=os.path.dirname(os.path.abspath(args.input)) or ".")
    document.write_pdf(args.output, stylesheets=[stylesheet], font_config=font_config)
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
