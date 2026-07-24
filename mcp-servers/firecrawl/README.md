# firecrawl (MCP server)

Firecrawl web search / scrape / crawl / extract MCP (`firecrawl-mcp` preko npx). Napaja `firecrawl` i `firecrawl-*` skillove (search, scrape, crawl, deep-research, monitor, itd.).

Zahteva `FIRECRAWL_API_KEY` — uzmi ga na https://firecrawl.dev

## Install

No files to copy — just register the server:

```bash
claude mcp add-json firecrawl '{"type":"stdio","command":"npx","args":["-y","firecrawl-mcp"],"env":{"FIRECRAWL_API_KEY":"YOUR_FIRECRAWL_API_KEY"}}' --scope user
```

Or paste `config.json` into `~/.claude.json` under `mcpServers` (zameni placeholder pravim ključem).
