---
name: csv-data-summarizer
description: >-
  Analyzes CSV files end-to-end — summary statistics, data quality checks, and
  automatic visualizations using Python and pandas. Use this skill whenever the
  user uploads or references a CSV/TSV file and wants to understand it —
  "summarize this data", "analyze this CSV", "what's in this file", "show me
  trends", "any insights here" — or even just uploads a CSV with a vague ask.
  Runs the full analysis immediately without asking what the user wants first.
metadata:
  version: 2.2.0
  dependencies: python>=3.8, pandas>=2.0.0, matplotlib>=3.7.0, seaborn>=0.12.0
---

# CSV Data Summarizer

Analyzes CSV files and delivers a complete summary with statistics and
visualizations in a single pass.

## Core behavior: analyze first, don't interview

When a user shares a CSV, they want to see what's in it. Asking "what would you
like me to do with this data?" wastes their turn — the answer is almost always
"show me everything relevant." So run the full analysis immediately and present
complete results. If the user then wants something specific (a particular
segment, a custom chart), they'll ask — and you'll already share context about
the data with them.

The one exception: if the user's message already contains a *specific* question
("what's the average order value in Q3?"), answer that question directly using
the data; the full auto-summary is optional garnish.

## How it works

Run the bundled script — it handles loading, profiling, and chart generation:

```bash
# $SKILL = this skill's folder
python "$SKILL/analyze.py" INPUT.csv OUTPUT_DIR
```

Or from Python:

```python
from analyze import summarize_csv
report = summarize_csv("input.csv", output_dir="/mnt/user-data/outputs")
```

`OUTPUT_DIR` is where the PNG charts land — point it at the outputs folder for
your environment (on Claude.ai: `/mnt/user-data/outputs`) so the user can see
them, and present the charts alongside the text summary.

The script adapts to what's actually in the data:

1. **Load and inspect** — column types, date columns, numeric columns, categories
2. **Data quality** — missing values overall and per column
3. **Numeric analysis** — describe() stats + correlation matrix and heatmap
   (heatmap only when 2+ numeric columns exist)
4. **Categorical analysis** — value counts for up to 5 categorical columns
   (ID-like columns skipped) + bar charts
5. **Time series** — if a date/time column exists: date range, span, and trend
   plots of numeric columns over time
6. **Distributions** — histograms for up to 4 numeric columns

## Interpreting for the user

The script gives raw statistics; your job is the insight layer on top:

- Name the dataset type you've inferred (sales, survey, operational logs...)
  and tailor commentary to it — revenue trends for sales data, response
  distributions for surveys, traffic patterns for analytics.
- Call out what's actually notable: outliers, strong correlations, data-quality
  problems, seasonality. Skip generic observations.
- Close with 2–3 concrete takeaways or suggested next analyses.

## Example prompts this handles

> "Here's `sales_data.csv`. Can you summarize this file?"
> "Analyze this customer data CSV and show me trends."
> "What insights can you find in `orders.csv`?"

## Files

- `analyze.py` — core analysis logic (also runnable as CLI: `python analyze.py FILE.csv [OUTPUT_DIR]`)
- `requirements.txt` — Python dependencies
- `resources/sample.csv` — example dataset for testing
- `resources/README.md` — additional documentation

## Notes

- Date columns are detected by name (contains "date" or "time"); if detection
  misses an oddly named date column, parse it manually and mention that.
- Charts are only generated where they make sense (see the adaptive list above),
  so a file with no numeric columns simply produces fewer charts — that's
  expected, not an error.
- Very wide files: the script caps at 4–5 columns per chart type to stay
  readable; mention the cap if the dataset exceeds it.
