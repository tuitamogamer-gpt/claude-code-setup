# supadata (MCP server)

Web scraping / crawling / YouTube-transcript MCP (`@supadata/mcp` via npx).

Needs `SUPADATA_API_KEY` — get it at https://supadata.ai

## Install

No files to copy — just register the server:

```bash
claude mcp add-json supadata '{"type": "stdio", "command": "npx", "args": ["-y", "@supadata/mcp"], "env": {"SUPADATA_API_KEY": "YOUR_SUPADATA_API_KEY"}}' --scope user
```

Or paste `config.json` contents into `~/.claude.json` under `mcpServers`.
