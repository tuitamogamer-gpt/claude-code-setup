# blog-factcheck

Verify statistics and claims in blog posts by fetching cited source URLs and checking if the claimed data actually appears on the page. Extracts all statistical claims (numbers, percentages, named sources), fetches each cited URL via WebFetch, and scores match confidence (exact match 1.0, paraphrase 0.7-0.9, not found 0.0). Flags uncited claims as UNVERIFIED. Use when user says "fact check", "verify statistics", "check sources", "validate claims", "factcheck", "source verification".

## Install

Copy this folder to `~/.claude/skills/blog-factcheck/` on the target machine (or run `install.sh` from the repo root).
