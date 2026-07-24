# openart (MCP server)

OpenArt image/video generation MCP (hosted HTTP server).

OAuth login on first use — no local install needed.

## Install

No files to copy — just register the server:

```bash
claude mcp add-json openart '{"type": "http", "url": "https://mcp.openart.ai/mcp"}' --scope user
```

Or paste `config.json` contents into `~/.claude.json` under `mcpServers`.
