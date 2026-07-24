# blog-cannibalization

Detect keyword cannibalization across blog posts by extracting primary keywords from titles and headings, clustering semantically similar targets, and flagging posts competing for the same search intent. Supports local-only mode (grep-based) and DataForSEO API mode (Page Intersection endpoint at ~$0.01/call). Outputs severity-scored report with merge or differentiate recommendations. Use when user says "cannibalization", "keyword overlap", "competing pages", "duplicate keywords", "cannibalize".

## Install

Copy this folder to `~/.claude/skills/blog-cannibalization/` on the target machine (or run `install.sh` from the repo root).
