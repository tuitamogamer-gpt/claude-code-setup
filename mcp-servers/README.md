# MCP Serveri (9)

Svi MCP serveri registrovani u Claude Code CLI-ju (`~/.claude.json` → `mcpServers`, user scope).

| Server | Tip | Šta radi | Kredencijali |
|---|---|---|---|
| [`project-handoffs`](project-handoffs/) | lokalni (node) | Predaja konteksta između radnih sesija na projektima | — |
| [`elevenlabs-scribe`](elevenlabs-scribe/) | lokalni (node) | Transkripcija audio fajlova (ElevenLabs Scribe API) | `ELEVENLABS_API_KEY` |
| [`supadata`](supadata/) | npx paket | Web scraping, crawl, YouTube transkripti | `SUPADATA_API_KEY` |
| [`firecrawl`](firecrawl/) | npx paket | Web search / scrape / crawl / extract (napaja firecrawl-* skillove) | `FIRECRAWL_API_KEY` |
| [`openart`](openart/) | hosted HTTP | OpenArt generisanje slika/videa | OAuth pri prvom korišćenju |
| [`higgsfield`](higgsfield/) | hosted HTTP | Higgsfield generisanje slika/videa (Soul, Kling, Veo, 30+ modela) | OAuth pri prvom korišćenju |
| [`x-docs`](x-docs/) | hosted HTTP | Pretraga X (Twitter) developer dokumentacije | — |
| [`google-sheets`](google-sheets/) | uvx paket (Python) | Čitanje/pisanje Google tabela | service-account JSON fajl (⚠️ nikad u repo) |
| [`paper`](paper/) | lokalni HTTP | Paper desktop app (localhost:29979) — ⚠️ nije prenosiv bez te aplikacije | — |

## Instalacija na novom računaru

Najlakše: pokreni `../install.sh` iz korena repoa — kopira lokalne servere, instalira
zavisnosti i registruje sve servere (pitaće te za API ključeve).

Ručno:

```bash
# 1) lokalni serveri
mkdir -p ~/.claude/mcp-servers
cp -R project-handoffs elevenlabs-scribe ~/.claude/mcp-servers/
(cd ~/.claude/mcp-servers/project-handoffs && npm install --omit=dev)
(cd ~/.claude/mcp-servers/elevenlabs-scribe && npm install --omit=dev)

# 2) registracija — vidi mcp-config.template.json
#    zameni YOUR_*_API_KEY pravim ključevima i $HOME pravom putanjom, npr:
claude mcp add-json project-handoffs '{"type":"stdio","command":"node","args":["'$HOME'/.claude/mcp-servers/project-handoffs/build/index.js"]}' --scope user
```

`mcp-config.template.json` sadrži kompletnu konfiguraciju svih 9 servera, sa placeholder-ima
umesto ključeva (**pravi ključevi namerno nisu u repou** — drži ih u password manageru).

## Napomena o buildovima

`build/` (project-handoffs) i `dist/` (elevenlabs-scribe) su **namerno komitovani** da server
radi odmah posle `npm install`. Ako menjaš izvorni kod, rebuild sa `npm run build`.

## Claude.ai konektori (nisu ovde)

Gmail, Google Calendar, Google Drive, Canva, Gamma, Higgsfield, Fireflies, OpenArt kao
konektori — to su claude.ai konektori vezani za nalog, ne za računar. Na novom računaru se
samo uloguješ istim nalogom; podešavaju se na claude.ai → Settings → Connectors.
