# x-docs (MCP server)

X (Twitter) developer-docs search MCP (hosted HTTP server).

No credentials needed.

## Install

No files to copy — just register the server:

```bash
claude mcp add-json x-docs '{"type": "http", "url": "https://docs.x.com/mcp"}' --scope user
```

Or paste `config.json` contents into `~/.claude.json` under `mcpServers`.
