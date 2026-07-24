#!/usr/bin/env bash
# Instalacija kompletnog Claude Code setupa (skills + plugins + MCP serveri + settings)
# na novom racunaru. Pokreni:  bash install.sh
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

ok()   { printf '\033[32m✔ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m⚠ %s\033[0m\n' "$*"; }
info() { printf '\033[36m→ %s\033[0m\n' "$*"; }

HAS_CLAUDE=1; command -v claude >/dev/null 2>&1 || HAS_CLAUDE=0
HAS_NPM=1;    command -v npm    >/dev/null 2>&1 || HAS_NPM=0
[ "$HAS_CLAUDE" = 1 ] || warn "claude CLI nije nadjen — preskacem registracije (instaliraj: npm i -g @anthropic-ai/claude-code), pa pokreni skriptu ponovo"
[ "$HAS_NPM" = 1 ]    || warn "npm nije nadjen — lokalni MCP serveri nece raditi bez node/npm"

# ---------- 1) SKILLS ----------
info "1/5 Skills → ~/.claude/skills/"
mkdir -p "$CLAUDE_DIR/skills"
for d in "$REPO_DIR/skills"/*/; do
  name="$(basename "$d")"
  cp -R "$d" "$CLAUDE_DIR/skills/"
done
ok "$(ls -d "$REPO_DIR/skills"/*/ | wc -l | tr -d ' ') skillova iskopirano"

# ---------- 2) PLUGIN MARKETPLACES ----------
info "2/5 Plugin marketplaces → ~/.claude/plugin-sources/"
mkdir -p "$CLAUDE_DIR/plugin-sources"
cp -R "$REPO_DIR/plugins/Understand-Anything" "$REPO_DIR/plugins/taste-skill" "$REPO_DIR/plugins/last30days-skill" "$CLAUDE_DIR/plugin-sources/"
ok "izvori iskopirani"

if [ "$HAS_CLAUDE" = 1 ]; then
  for mp in Understand-Anything taste-skill last30days-skill; do
    claude plugin marketplace add "$CLAUDE_DIR/plugin-sources/$mp" >/dev/null 2>&1 \
      && ok "marketplace dodat: $mp" || warn "marketplace $mp — vec postoji ili greska (ok ako je vec dodat)"
  done
  for spec in "understand-anything@understand-anything" "taste-skill@taste-skill" "last30days@last30days-skill"; do
    claude plugin install "$spec" >/dev/null 2>&1 \
      && ok "plugin instaliran: $spec" || warn "plugin $spec — vec instaliran ili greska"
  done
else
  warn "rucno kasnije: claude plugin marketplace add ~/.claude/plugin-sources/<ime> ; claude plugin install <plugin>@<marketplace>"
fi

# ---------- 3) LOKALNI MCP SERVERI ----------
info "3/5 Lokalni MCP serveri → ~/.claude/mcp-servers/"
mkdir -p "$CLAUDE_DIR/mcp-servers"
for srv in project-handoffs elevenlabs-scribe; do
  cp -R "$REPO_DIR/mcp-servers/$srv" "$CLAUDE_DIR/mcp-servers/"
  if [ "$HAS_NPM" = 1 ]; then
    (cd "$CLAUDE_DIR/mcp-servers/$srv" && npm install --omit=dev --silent >/dev/null 2>&1) \
      && ok "$srv: zavisnosti instalirane" || warn "$srv: npm install nije prosao — pokreni rucno"
  fi
done

# ---------- 4) REGISTRACIJA MCP SERVERA ----------
info "4/5 Registracija MCP servera (user scope)"
if [ "$HAS_CLAUDE" = 1 ]; then
  add_mcp() { # $1=ime $2=json
    claude mcp add-json "$1" "$2" --scope user >/dev/null 2>&1 \
      && ok "MCP registrovan: $1" || warn "MCP $1 — vec registrovan ili greska"
  }

  add_mcp project-handoffs "{\"type\":\"stdio\",\"command\":\"node\",\"args\":[\"$HOME/.claude/mcp-servers/project-handoffs/build/index.js\"]}"
  add_mcp openart '{"type":"http","url":"https://mcp.openart.ai/mcp"}'
  add_mcp higgsfield '{"type":"http","url":"https://mcp.higgsfield.ai/mcp"}'
  add_mcp paper '{"type":"http","url":"http://127.0.0.1:29979/mcp"}'  # radi samo uz lokalnu Paper app
  add_mcp google-sheets "{\"type\":\"stdio\",\"command\":\"uvx\",\"args\":[\"mcp-google-sheets@latest\"],\"env\":{\"SERVICE_ACCOUNT_PATH\":\"$HOME/.config/mcp-google-sheets/service-account.json\"}}"
  warn "google-sheets: stavi service-account.json u ~/.config/mcp-google-sheets/ (vidi mcp-servers/google-sheets/README.md); zahteva i uv (brew install uv)"
  add_mcp x-docs '{"type":"http","url":"https://docs.x.com/mcp"}'

  printf 'ELEVENLABS_API_KEY (enter = preskoci): '; read -r ELKEY
  if [ -n "${ELKEY:-}" ]; then
    add_mcp elevenlabs-scribe "{\"type\":\"stdio\",\"command\":\"node\",\"args\":[\"$HOME/.claude/mcp-servers/elevenlabs-scribe/dist/index.js\"],\"env\":{\"ELEVENLABS_API_KEY\":\"$ELKEY\"}}"
  else
    warn "preskoceno — kasnije: claude mcp add-json elevenlabs-scribe '...' (vidi mcp-servers/mcp-config.template.json)"
  fi

  printf 'SUPADATA_API_KEY (enter = preskoci): '; read -r SUKEY
  if [ -n "${SUKEY:-}" ]; then
    add_mcp supadata "{\"type\":\"stdio\",\"command\":\"npx\",\"args\":[\"-y\",\"@supadata/mcp\"],\"env\":{\"SUPADATA_API_KEY\":\"$SUKEY\"}}"
  else
    warn "preskoceno — kasnije: claude mcp add-json supadata '...' (vidi mcp-servers/mcp-config.template.json)"
  fi

  printf 'FIRECRAWL_API_KEY (enter = preskoci): '; read -r FCKEY
  if [ -n "${FCKEY:-}" ]; then
    add_mcp firecrawl "{\"type\":\"stdio\",\"command\":\"npx\",\"args\":[\"-y\",\"firecrawl-mcp\"],\"env\":{\"FIRECRAWL_API_KEY\":\"$FCKEY\"}}"
  else
    warn "preskoceno — kasnije: claude mcp add-json firecrawl '...' (vidi mcp-servers/mcp-config.template.json)"
  fi
else
  warn "claude CLI nedostupan — registruj servere kasnije po mcp-servers/mcp-config.template.json"
fi

# ---------- 5) GLOBALNI CLAUDE.md ----------
info "5/5 Globalni CLAUDE.md"
if [ ! -f "$CLAUDE_DIR/CLAUDE.md" ]; then
  cp "$REPO_DIR/settings/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
  ok "CLAUDE.md iskopiran"
elif cmp -s "$REPO_DIR/settings/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"; then
  ok "CLAUDE.md vec identican"
else
  cp "$REPO_DIR/settings/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md.from-export"
  warn "~/.claude/CLAUDE.md vec postoji i razlikuje se — nova verzija sacuvana kao CLAUDE.md.from-export, spoji rucno"
fi

echo
ok "Gotovo. Jos rucno (vezano za claude.ai nalog, ne za racunar):"
echo "   • Uloguj se u Claude Code / Desktop istim nalogom"
echo "   • claude.ai → Settings → Connectors: Gmail, Calendar, Drive, Canva, Gamma, Higgsfield, Fireflies, OpenArt"
echo "   • Cowork plugini i account skillovi stizu automatski s nalogom (backup: cowork-plugins/, claude-ai-skills/)"
echo "   • notebooklm skill: prvi put trazi Google login (vidi skills/notebooklm/AUTHENTICATION.md)"
echo "   • last30days: API kljuceve provajdera unosis pri prvom pokretanju"
