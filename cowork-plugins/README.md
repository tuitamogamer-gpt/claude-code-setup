# Claude Desktop (Cowork) — Plugini (21)

Plugini koje Claude Desktop aplikacija (Cowork) učitava u sesije. Izvučeni su iz lokalnog
mirror-a aplikacije (`~/Library/Application Support/Claude/local-agent-mode-sessions/.../rpm/`)
i preimenovani iz `plugin_XXX` u prava imena.

## Kako se prenose na drugi računar

Većina ovih plugina (legal, marketing, engineering, sales, data...) je **vezana za claude.ai
nalog** — kada se na novom računaru uloguješ istim nalogom, aplikacija
ih sama povuče. **Ovaj folder je backup**, i služi za:

1. **Custom plugine** (napravljene ručno, npr. `youtube-skola`) — ako ikad nestanu sa naloga,
   ovde je kopija koja se može ponovo uvesti kroz Cowork plugin manager
   (skill `cowork-plugin-management:create-cowork-plugin`).
2. **Korišćenje u CLI-ju** — `skills/` i `commands/` podfolderi svakog plugina mogu da se
   iskopiraju u `~/.claude/skills/` i rade kao obični skillovi.

## Lista plugina

| Skill | Opis |
|---|---|
| [`pdf-viewer`](pdf-viewer/) | View, annotate, and sign PDFs in a live interactive viewer. |
| [`legal`](legal/) | Speed up contract review, NDA triage, and compliance workflows for in-house legal teams. |
| [`productivity`](productivity/) | Manage tasks, plan your day, and build up memory of important context about your work. |
| [`cowork-plugin-management`](cowork-plugin-management/) | Create, customize, and manage plugins tailored to your organization's tools and workflows. |
| [`customer-support`](customer-support/) | Triage tickets, draft responses, escalate issues, and build your knowledge base. |
| [`youtube-skola`](youtube-skola/) | Sveobuhvatan YouTube plugin baziran na metodologiji YouTube Škole - od strategije kanala, thumbnailova i naslova (TNT), preko skriptanja i storytellinga, do… |
| [`operations`](operations/) | Optimize business operations — vendor management, process documentation, change management, capacity planning, and compliance tracking. |
| [`brand-voice`](brand-voice/) | Brand Voice transforms scattered brand materials into enforceable AI guardrails — automatically. |
| [`product-management`](product-management/) | Write feature specs, plan roadmaps, and synthesize user research faster. |
| [`human-resources`](human-resources/) | Streamline people operations — recruiting, onboarding, performance reviews, compensation analysis, and policy guidance. |
| [`marketing`](marketing/) | Create content, plan campaigns, and analyze performance across marketing channels. |
| [`engineering`](engineering/) | Streamline engineering workflows — standups, code review, architecture decisions, incident response, and technical documentation. |
| [`finance`](finance/) | Streamline finance and accounting workflows, from journal entries and reconciliation to financial statements and variance analysis. |
| [`video-editor`](video-editor/) | Professional video editing with FFmpeg. |
| [`zoom-plugin`](zoom-plugin/) | Claude plugin for planning, building, and debugging Zoom integrations across REST APIs, SDKs, webhooks, bots, and MCP workflows |
| [`suno-music-creator`](suno-music-creator/) | Create AI-generated music albums and playlists on Suno.com using browser automation. |
| [`desktop-commander`](desktop-commander/) | MCP server for terminal commands, process management, and file operations across text files, code, PDF, DOCX, Excel, images, and structured data |
| [`sales`](sales/) | Prospect, craft outreach, and build deal strategy faster. |
| [`data`](data/) | Write SQL, explore datasets, and generate insights faster. |
| [`enterprise-search`](enterprise-search/) | Search across all of your company's tools in one place. |
| [`design`](design/) | Accelerate design workflows — critique, design system management, UX writing, accessibility audits, research synthesis, and dev handoff. |
