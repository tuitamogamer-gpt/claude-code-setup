# firecrawl-build-onboarding

Get Firecrawl credentials and SDK setup into a project. Use when an application needs `FIRECRAWL_API_KEY`, when an agent should add Firecrawl to `.env`, when the user wants to authenticate Firecrawl for app code, or when choosing the first SDK and docs for a new Firecrawl integration. This skill includes its own browser auth flow, so it does not depend on the website onboarding skill.

## Install

Copy this folder to `~/.claude/skills/firecrawl-build-onboarding/` (or run `install.sh`). Requires the Firecrawl MCP server + `FIRECRAWL_API_KEY` (see `../../mcp-servers/firecrawl/`).
