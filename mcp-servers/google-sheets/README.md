# google-sheets (MCP server)

Google Sheets MCP (`mcp-google-sheets` preko uvx/Python). Čitanje i pisanje Google tabela.

Zahteva **Google service-account JSON** fajl (privatni ključ!) na putanji
`~/.config/mcp-google-sheets/service-account.json` — napravi ga u Google Cloud konzoli
(IAM → Service Accounts → Keys) i podeli tabele sa email-om service naloga.

> ⚠️ Service-account JSON je kredencijal — drži ga van repoa (ovde je i .gitignore-ovan),
> prenosi se ručno ili kroz password manager.

## Install

Zahteva [uv](https://docs.astral.sh/uv/) (`brew install uv`). Zatim:

```bash
mkdir -p ~/.config/mcp-google-sheets   # ovde stavi service-account.json
claude mcp add-json google-sheets '{"type":"stdio","command":"uvx","args":["mcp-google-sheets@latest"],"env":{"SERVICE_ACCOUNT_PATH":"'$HOME'/.config/mcp-google-sheets/service-account.json"}}' --scope user
```
