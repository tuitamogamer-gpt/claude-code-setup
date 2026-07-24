# Claude Code Setup — Skills, Plugins & MCP Serveri

Kompletan export mog Claude Code okruženja (macOS), spreman za prenos na druge računare.
Izvezeno 2026-07-02. **API ključevi su sanitizovani** — u repou su samo placeholder-i.

## Brza instalacija na novom računaru

```bash
git clone <ovaj-repo>
cd <repo>
bash install.sh
```

Skripta kopira skillove, registruje plugin marketplace-ove, instalira i registruje MCP
servere (pitaće za API ključeve) i postavlja globalni `CLAUDE.md`. Sve što ne uradi sama,
ispiše na kraju.

## Šta je unutra

| Folder | Sadržaj | Instalacija |
|---|---|---|
| [`skills/`](skills/) | 199 CLI skillova (blog paket ×30, marketing paket ×~60, firecrawl ×32, hyperframes video paket ×9, understand-*, obsidian-*, design/taste, higgsfield-*, no-ai-slop, graphify, gstack, notebooklm…) | `install.sh` ili kopiranje u `~/.claude/skills/` |
| [`plugins/`](plugins/) | 3 plugin marketplace izvora (Understand-Anything 2.8.1, taste-skill 1.0.0, last30days 3.8.3) | `install.sh` ili `claude plugin` komande |
| [`mcp-servers/`](mcp-servers/) | 9 MCP servera — 2 lokalna sa izvornim kodom (project-handoffs, elevenlabs-scribe) + 7 config-only (supadata, firecrawl, openart, higgsfield, x-docs, google-sheets, paper) | `install.sh` ili `mcp-config.template.json` |
| [`cowork-plugins/`](cowork-plugins/) | 21 Claude Desktop (Cowork) plugin — uključujući custom `youtube-skola` | prate claude.ai nalog; ovo je backup |
| [`claude-ai-skills/`](claude-ai-skills/) | 25 account skillova (mcp-builder, docx/pptx/xlsx…) | prate claude.ai nalog; ovo je backup |
| [`settings/`](settings/) | Globalni `CLAUDE.md` + template `settings.json` | `install.sh` |

Svaki podfolder ima svoj `README.md` (šta je i kako se instalira) i `.gitignore`.

## Šta se NE prenosi fajlovima

Ove stvari su vezane za **claude.ai nalog** — na novom računaru
se samo uloguješ i one stižu same:

- **Konektori**: Gmail, Google Calendar, Google Drive, Canva, Gamma, Higgsfield, Fireflies,
  OpenArt → claude.ai → Settings → Connectors
- **Cowork plugini** i **account skillovi** (backup kopije su u repou za svaki slučaj)

## Tajne (namerno izostavljene)

U password manageru drži i unesi kad `install.sh` pita:

- `SUPADATA_API_KEY` — https://supadata.ai
- `ELEVENLABS_API_KEY` — https://elevenlabs.io
- `FIRECRAWL_API_KEY` — https://firecrawl.dev (za firecrawl MCP + svih 31 firecrawl-* skillova)
- **google-sheets** — service-account JSON u `~/.config/mcp-google-sheets/service-account.json` (Google Cloud → IAM → Service Accounts; nikad u repo)
- blog paket (blog-google/image/audio) — Google/Gemini ključevi u `~/.config/claude-seo/`, podešavaju se pri prvom pokretanju
- last30days provajderi (OpenAI/xAI/ScrapeCreators) — skill ih traži pri prvom pokretanju
- notebooklm — Google login pri prvom pokretanju (lokalni `data/` folder je izbačen iz exporta)
- **paper** MCP radi samo ako na mašini imaš pokrenutu Paper desktop aplikaciju (localhost:29979)

## Preduslovi na novom računaru

- Claude Code CLI (`npm i -g @anthropic-ai/claude-code`) + login
- Node.js ≥ 18 (za lokalne MCP servere)
- Python 3 + `pip install -r skills/notebooklm/requirements.txt` (samo za notebooklm)
