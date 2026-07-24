# higgsfield (MCP server)

Higgsfield AI generisanje slika i videa (Soul, Cinema Studio, Flux, Seedream, Kling,
Minimax Hailuo, Veo — 30+ modela) kao hosted HTTP MCP server.

OAuth login Higgsfield nalogom pri prvom korišćenju — bez API ključeva, nema lokalne instalacije.

## Install

No files to copy — just register the server:

```bash
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp
```

Zatim u interaktivnoj Claude Code sesiji pokreni `/mcp` i završi OAuth za `higgsfield`.

Or paste `config.json` contents into `~/.claude.json` under `mcpServers`.

Docs: https://higgsfield.ai/mcp
