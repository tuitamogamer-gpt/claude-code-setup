# firecrawl-scrape

Extract clean markdown from any URL, including JavaScript-rendered SPAs. Use this skill whenever the user provides a URL and wants its content, says "scrape", "grab", "fetch", "pull", "get the page", "extract from this URL", or "read this webpage". Handles JS-rendered pages, multiple concurrent URLs, and returns LLM-optimized markdown. Use this instead of WebFetch for any webpage content extraction.

## Install

Copy this folder to `~/.claude/skills/firecrawl-scrape/` (or run `install.sh`). Requires the Firecrawl MCP server + `FIRECRAWL_API_KEY` (see `../../mcp-servers/firecrawl/`).
