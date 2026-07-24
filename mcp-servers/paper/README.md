# paper (MCP server)

Lokalni MCP server na `http://127.0.0.1:29979/mcp` — pruža ga **Paper** desktop aplikacija koja radi na tvojoj mašini.

> ⚠️ **Mašinski specifičan / nije prenosiv sam po sebi.** Ovo je samo referenca konfiguracije. Na drugom računaru radi tek kad tamo instaliraš i pokreneš istu Paper aplikaciju koja otvara taj lokalni port. Bez nje, registrovan server će stajati kao nepovezan.

## Install

```bash
claude mcp add-json paper '{"type":"http","url":"http://127.0.0.1:29979/mcp"}' --scope user
```
