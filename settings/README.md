# Claude Code — Podešavanja

| Fajl | Original | Šta sadrži |
|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | Globalne instrukcije za sve projekte (graphify trigger) |
| `settings.template.json` | `~/.claude/settings.json` | Uključeni plugini + marketplace putanje (`$HOME` umesto apsolutne putanje) |

## Instalacija

```bash
cp CLAUDE.md ~/.claude/CLAUDE.md
```

`settings.template.json` **ne kopiraj direktno** — `claude plugin marketplace add` i
`claude plugin install` (vidi `../plugins/README.md` ili `../install.sh`) sami upisuju
ispravne vrednosti u `~/.claude/settings.json`. Template služi kao referenca šta treba
da bude uključeno na kraju:

- `enabledPlugins`: `understand-anything@understand-anything`, `taste-skill@taste-skill`, `last30days@last30days-skill`
- `theme`: dark

## Šta se NE prenosi fajlovima (vezano za claude.ai nalog)

- **Claude.ai konektori**: Gmail, Google Calendar, Google Drive, Canva, Gamma, Higgsfield,
  Fireflies, OpenArt → claude.ai → Settings → Connectors
- **Cowork plugini** (Desktop app) → povlače se automatski s nalogom; backup u `../cowork-plugins/`
- **Account skillovi** → claude.ai → Settings → Capabilities; backup u `../claude-ai-skills/`
- **API ključevi** (`SUPADATA_API_KEY`, `ELEVENLABS_API_KEY`, last30days provajderi) →
  namerno nisu u repou, drži ih u password manageru; `../install.sh` ih traži pri instalaciji
