# Claude Code — Skills (199)

Svi standalone skillovi iz `~/.claude/skills/` i `~/.agents/skills/` (symlinkovi razrešeni —
ovde su pravi fajlovi). Svaki skill je poseban folder sa svojim `SKILL.md`, `README.md` i `.gitignore`.

Veće grupe: **blog paket** (blog + 29 blog-* pod-skillova), **marketing paket** (ads, cro, emails,
copywriting, seo-audit, pricing…), **firecrawl** (32), **hyperframes video paket** (hyperframes ×7,
media-use, figma), **understand-*** (8), **obsidian-*** (4), engineering (tdd, qa, code-review…),
design/taste skillovi, higgsfield-*, gstack, graphify, notebooklm, last30days.

## Instalacija

Na novom računaru iskopiraj foldere u `~/.claude/skills/`:

```bash
mkdir -p ~/.claude/skills
cp -R skills/* ~/.claude/skills/
```

ili pokreni `../install.sh` iz korena repoa, koji radi ovo automatski.

## Napomene

- **hyperframes*** / **media-use** / **figma** — HyperFrames video framework (HeyGen); CLI alat
  (`hyperframes`) se instalira posebno pri prvom korišćenju, skillovi ga vode kroz to.
- **firecrawl*** — zahteva `FIRECRAWL_API_KEY` (Firecrawl MCP); ključ se ne čuva u repou.
- **blog-google / blog-image / blog-audio** — Google/Gemini ključevi u `~/.config/claude-seo/` (van repoa).
- **notebooklm** — `data/` (browser profil + Google auth) izbačen; pravi se pri prvom pokretanju.
- **last30days** — API ključevi provajdera van skila.
- **gstack** — prazni `gstack-*` wrapperi sa pokvarenim symlinkovima su preskočeni.

## Lista skillova

| Skill | Opis |
|---|---|
| [`_gstack-command`](_gstack-command/) | Router for the gstack skill suite. |
| [`ab-testing`](ab-testing/) | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. |
| [`ad-creative`](ad-creative/) | "When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any paid advertising… |
| [`ads`](ads/) | "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. |
| [`ai-seo`](ai-seo/) | "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. |
| [`analytics`](analytics/) | When the user wants to set up, improve, or audit analytics tracking and measurement. |
| [`ask-matt`](ask-matt/) | Ask which skill or flow fits your situation. |
| [`aso`](aso/) | "When the user wants to audit or optimize an App Store or Google Play listing. |
| [`blog`](blog/) | Full-lifecycle blog engine with 30 sub-skills, 12 content templates, 5-category 100-point scoring, and 5 specialized agents. |
| [`blog-analyze`](blog-analyze/) | Audit and score blog posts on a 5-category 100-point scoring system covering content quality, SEO optimization, E-E-A-T signals, technical elements, and AI… |
| [`blog-audio`](blog-audio/) | Generate audio narration of blog posts using Google Gemini TTS. |
| [`blog-audit`](blog-audit/) | Full-site blog health assessment scanning all blog files for quality scores, orphan pages, topic cannibalization, stale content, and AI citation readiness. |
| [`blog-brand`](blog-brand/) | Establish durable brand and voice context for cross-skill consumption. |
| [`blog-brief`](blog-brief/) | Generate detailed content briefs for blog posts with target keywords, content outlines, competitive analysis, recommended statistics, image and chart… |
| [`blog-calendar`](blog-calendar/) | Generate editorial calendars for blogs with topic clusters, publishing schedules, content decay detection, freshness update plans, seasonal opportunities,… |
| [`blog-cannibalization`](blog-cannibalization/) | Detect keyword cannibalization across blog posts by extracting primary keywords from titles and headings, clustering semantically similar targets, and flagging… |
| [`blog-chart`](blog-chart/) | Generate dark-mode-compatible inline SVG data visualization charts for blog posts. |
| [`blog-cluster`](blog-cluster/) | Semantic topic cluster planning and automated execution engine for claude-blog. |
| [`blog-discourse`](blog-discourse/) | Research what people are actually saying about a topic in the last 30 days across Reddit, X / Twitter, YouTube, Hacker News, dev.to, Medium, and other public… |
| [`blog-factcheck`](blog-factcheck/) | Verify statistics and claims in blog posts by fetching cited source URLs and checking if the claimed data actually appears on the page. |
| [`blog-flow`](blog-flow/) | FLOW framework integration for bloggers. |
| [`blog-geo`](blog-geo/) | AI citation readiness audit ONLY (does not touch Google rankings, use blog-rewrite for combined Google+AI work). |
| [`blog-google`](blog-google/) | Google API integration for blog performance: PageSpeed Insights, CrUX Core Web Vitals with 25-week history, Search Console performance, URL Inspection,… |
| [`blog-image`](blog-image/) | AI image generation and editing for blog content powered by Gemini via MCP. |
| [`blog-locale-audit`](blog-locale-audit/) | Audit a directory of multilingual blog content for completeness, consistency, hreflang correctness, meta-tag parity, and freshness. |
| [`blog-localize`](blog-localize/) | Cultural adaptation for translated content. |
| [`blog-multilingual`](blog-multilingual/) | One-command multilingual blog creation. |
| [`blog-notebooklm`](blog-notebooklm/) | Query Google NotebookLM notebooks for source-grounded, citation-backed answers from user-uploaded documents. |
| [`blog-outline`](blog-outline/) | SERP-informed outline generation with H2/H3 heading hierarchy, competitive content gap analysis, section-by-section word count targets, chart and image… |
| [`blog-persona`](blog-persona/) | Create and manage writing personas with NNGroup 4-dimension tone framework (Funny-Serious, Formal-Casual, Respectful-Irreverent, Enthusiastic-Matter-of-fact). |
| [`blog-repurpose`](blog-repurpose/) | Repurpose blog posts for social media, email, YouTube, Reddit, and LinkedIn. |
| [`blog-rewrite`](blog-rewrite/) | Rewrite and optimize existing blog posts for Google rankings (December 2025 Core Update, E-E-A-T) and AI citations (GEO/AEO). |
| [`blog-schema`](blog-schema/) | Generate complete JSON-LD schema markup for blog posts including BlogPosting, Person, Organization, BreadcrumbList, FAQPage, and ImageObject. |
| [`blog-seo-check`](blog-seo-check/) | Post-writing SEO validation with pass/fail checklist covering title tag length and keyword placement, meta description quality, heading hierarchy and keyword… |
| [`blog-strategy`](blog-strategy/) | Blog strategy development including topic cluster architecture with hub-and-spoke design, audience mapping, competitive landscape analysis, AI citation surface… |
| [`blog-taxonomy`](blog-taxonomy/) | Extract, suggest, and sync tags and categories for blog posts across all major CMS platforms. |
| [`blog-translate`](blog-translate/) | Translate existing blog posts into one or more target languages with SEO-optimized localization. |
| [`blog-write`](blog-write/) | Write new blog articles from scratch optimized for Google rankings and AI citations. |
| [`brandkit`](brandkit/) | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. |
| [`churn-prevention`](churn-prevention/) | "When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implement retention strategies. |
| [`claude-handoff`](claude-handoff/) | Hand the current conversation off to a fresh background agent that picks up the work immediately. |
| [`co-marketing`](co-marketing/) | "When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. |
| [`code-review`](code-review/) | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code follow this repo's documented coding… |
| [`codebase-design`](codebase-design/) | Shared vocabulary for designing deep modules. |
| [`cold-email`](cold-email/) | Write B2B cold emails and follow-up sequences that get replies. |
| [`community-marketing`](community-marketing/) | "Build and leverage online communities to drive product growth and brand loyalty. |
| [`competitor-profiling`](competitor-profiling/) | "When the user wants to research, profile, or analyze competitors from their URLs. |
| [`competitors`](competitors/) | "When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. |
| [`content-strategy`](content-strategy/) | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. |
| [`copy-editing`](copy-editing/) | "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. |
| [`copywriting`](copywriting/) | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages,… |
| [`cro`](cro/) | "When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature… |
| [`customer-research`](customer-research/) | When the user wants to conduct, analyze, or synthesize customer research. |
| [`defuddle`](defuddle/) | Extract clean markdown content from web pages using Defuddle CLI, removing clutter and navigation to save tokens. |
| [`design-an-interface`](design-an-interface/) | Generate multiple radically different interface designs for a module using parallel sub-agents. |
| [`design-taste-frontend`](design-taste-frontend/) | Anti-slop frontend skill for landing pages, portfolios, and redesigns. |
| [`design-taste-frontend-v1`](design-taste-frontend-v1/) | The original v1 taste-skill, preserved for projects depending on its exact behavior. |
| [`diagnosing-bugs`](diagnosing-bugs/) | Diagnosis loop for hard bugs and performance regressions. |
| [`directory-submissions`](directory-submissions/) | When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. |
| [`domain-modeling`](domain-modeling/) | Build and sharpen a project's domain model. |
| [`edit-article`](edit-article/) | Edit and improve articles by restructuring sections, improving clarity, and tightening prose. |
| [`emails`](emails/) | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. |
| [`figma`](figma/) | Import Figma content into a HyperFrames composition — rendered assets, brand tokens, components, storyboard sections → reconstructed motion (frames read as… |
| [`find-skills`](find-skills/) | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express… |
| [`firecrawl`](firecrawl/) | Search, scrape, and interact with the web via the Firecrawl CLI. |
| [`firecrawl-agent`](firecrawl-agent/) | AI-powered autonomous data extraction that navigates complex sites and returns structured JSON. |
| [`firecrawl-build`](firecrawl-build/) | Integrate Firecrawl into application code whenever a product, agent, or workflow needs web data inside the app: web search, live search results, page scraping,… |
| [`firecrawl-build-interact`](firecrawl-build-interact/) | Integrate Firecrawl `/interact` into product code for dynamic pages and browser actions after scraping. |
| [`firecrawl-build-onboarding`](firecrawl-build-onboarding/) | Get Firecrawl credentials and SDK setup into a project. |
| [`firecrawl-build-scrape`](firecrawl-build-scrape/) | Integrate Firecrawl `/scrape` into product code for single-page extraction. |
| [`firecrawl-build-search`](firecrawl-build-search/) | Integrate Firecrawl `/search` into product code and agent workflows. |
| [`firecrawl-company-directories`](firecrawl-company-directories/) | Extract structured company lists from directories with Firecrawl. |
| [`firecrawl-competitive-intel`](firecrawl-competitive-intel/) | Monitor competitor pricing, features, changelogs, dashboards, and product changes with Firecrawl. |
| [`firecrawl-crawl`](firecrawl-crawl/) | Bulk extract content from an entire website or site section. |
| [`firecrawl-dashboard-reporting`](firecrawl-dashboard-reporting/) | Pull metrics from analytics dashboards and internal web tools with Firecrawl browser. |
| [`firecrawl-deep-research`](firecrawl-deep-research/) | Produce an intensive, cited analytical report: executive summary, multi-angle findings, contrarian views, open questions, and full sources. |
| [`firecrawl-demo-walkthrough`](firecrawl-demo-walkthrough/) | Walk through a product's key flows with Firecrawl browser and produce a structured UX/product walkthrough. |
| [`firecrawl-download`](firecrawl-download/) | Download an entire website as local files — markdown, screenshots, or multiple formats per page. |
| [`firecrawl-interact`](firecrawl-interact/) | Control and interact with a live browser session on any scraped page — click buttons, fill forms, navigate flows, and extract data using natural language… |
| [`firecrawl-knowledge-base`](firecrawl-knowledge-base/) | Build a knowledge base from web content with Firecrawl. |
| [`firecrawl-knowledge-ingest`](firecrawl-knowledge-ingest/) | Ingest public or authenticated knowledge bases and docs portals with Firecrawl browser. |
| [`firecrawl-lead-gen`](firecrawl-lead-gen/) | Generate structured lead lists from prospect databases and web directories with Firecrawl browser. |
| [`firecrawl-lead-research`](firecrawl-lead-research/) | Produce pre-meeting lead intelligence briefs with Firecrawl. |
| [`firecrawl-map`](firecrawl-map/) | Discover and list all URLs on a website, with optional search filtering. |
| [`firecrawl-market-research`](firecrawl-market-research/) | Extract market, financial, earnings, industry, and company metrics with Firecrawl. |
| [`firecrawl-monitor`](firecrawl-monitor/) | Detect when content on a website changes and get notified by webhook or email — no cron jobs, scrapers, or diff scripts required. |
| [`firecrawl-parse`](firecrawl-parse/) | Efficiently extract and convert the contents of any local file—such as PDF, DOCX, DOC, ODT, RTF, XLSX, XLS, or HTML—into clean, well-formatted markdown saved… |
| [`firecrawl-qa`](firecrawl-qa/) | QA test a live website with Firecrawl browser and scrape evidence. |
| [`firecrawl-research-index`](firecrawl-research-index/) | Find the papers that answer a research query with Firecrawl Research, using semantic search, semantic and structural expansion, and in-body verification. |
| [`firecrawl-research-papers`](firecrawl-research-papers/) | Find and synthesize research papers, whitepapers, PDFs, technical reports, and academic sources with Firecrawl Research, using semantic paper search,… |
| [`firecrawl-scrape`](firecrawl-scrape/) | Extract clean markdown from any URL, including JavaScript-rendered SPAs. |
| [`firecrawl-search`](firecrawl-search/) | Web search with full page content extraction. |
| [`firecrawl-seo-audit`](firecrawl-seo-audit/) | Audit a website's SEO with Firecrawl. |
| [`firecrawl-shop`](firecrawl-shop/) | Research products across the web with Firecrawl and produce a shopping recommendation or cart-ready summary. |
| [`firecrawl-website-design-clone`](firecrawl-website-design-clone/) | Extract any website's design system into an agent-ready DESIGN.md using Firecrawl scrape evidence. |
| [`firecrawl-workflows`](firecrawl-workflows/) | Run outcome-focused Firecrawl workflows that produce deliverables such as research reports, SEO audits, QA reports, lead lists, knowledge bases, website design… |
| [`free-tools`](free-tools/) | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. |
| [`frontend-design`](frontend-design/) | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. |
| [`full-output-enforcement`](full-output-enforcement/) | Overrides default LLM truncation behavior. |
| [`git-guardrails-claude-code`](git-guardrails-claude-code/) | Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. |
| [`gpt-taste`](gpt-taste/) | Elite UX/UI & Advanced GSAP Motion Engineer. |
| [`graphify`](graphify/) | "Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ exists, where the question… |
| [`grill-me`](grill-me/) | A relentless interview to sharpen a plan or design. |
| [`grill-with-docs`](grill-with-docs/) | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. |
| [`grilling`](grilling/) | Grill the user relentlessly about a plan or design. |
| [`gstack`](gstack/) | Router for the gstack skill suite. |
| [`handoff`](handoff/) | Compact the current conversation into a handoff document for another agent to pick up. |
| [`higgsfield-generate`](higgsfield-generate/) | Generate images/videos via Higgsfield AI. |
| [`higgsfield-marketplace-cards`](higgsfield-marketplace-cards/) | Generate marketplace product image cards through Higgsfield: compliant main image, secondary product images, and A+ style content modules. |
| [`higgsfield-product-photoshoot`](higgsfield-product-photoshoot/) | Generate brand-quality product images through Higgsfield product-photoshoot prompt enhancement on GPT Image 2 / gpt_image_2. |
| [`higgsfield-soul-id`](higgsfield-soul-id/) | Train a Soul Character — a personalized model on a person's face that Higgsfield uses for identity-faithful image and video generation. |
| [`high-end-visual-design`](high-end-visual-design/) | Teaches the AI to design like a high-end agency. |
| [`humanizer`](humanizer/) | Remove signs of AI-generated writing from text. |
| [`hyperframes`](hyperframes/) | Mandatory entry point: read this first for any request to make, create, edit, animate, or render a video, animation, or motion graphic, including a promo,… |
| [`hyperframes-animation`](hyperframes-animation/) | "All animation knowledge for HyperFrames — atomic motion rules, multi-phase scene blueprints, scene transitions, broader motion-design techniques, AND the… |
| [`hyperframes-cli`](hyperframes-cli/) | Use the HyperFrames CLI development loop: init, add, catalog, capture, lint, check, snapshot, compare, grade-compare, preview, play, present, beats, keyframes,… |
| [`hyperframes-core`](hyperframes-core/) | The HyperFrames composition contract — build one renderable project. |
| [`hyperframes-creative`](hyperframes-creative/) | Non-animation creative direction for HyperFrames videos. |
| [`hyperframes-keyframes`](hyperframes-keyframes/) | Use when a HyperFrames composition needs seek-safe 2D/3D keyframes, GSAP timelines, CSS keyframes, Anime.js, WAAPI, FLIP, paths, masks, SVG morph/draw, text… |
| [`hyperframes-registry`](hyperframes-registry/) | Install, discover, and wire registry blocks and components into HyperFrames compositions. |
| [`image`](image/) | "When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing… |
| [`image-to-code`](image-to-code/) | Elite website image-to-code skill for Codex. |
| [`imagegen-frontend-mobile`](imagegen-frontend-mobile/) | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. |
| [`imagegen-frontend-web`](imagegen-frontend-web/) | Elite frontend image-direction skill for generating premium, conversion-aware website design references. |
| [`implement`](implement/) | "Implement a piece of work based on a spec or set of tickets." |
| [`improve-codebase-architecture`](improve-codebase-architecture/) | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick. |
| [`industrial-brutalist-ui`](industrial-brutalist-ui/) | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. |
| [`json-canvas`](json-canvas/) | Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. |
| [`last30days`](last30days/) | "Research what people actually say about any topic in the last 30 days. |
| [`launch`](launch/) | "When the user wants to plan a product launch, feature announcement, or release strategy. |
| [`lead-magnets`](lead-magnets/) | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. |
| [`loop-me`](loop-me/) | Grill me about specs for the workflows I want to build, within this workspace. |
| [`marketing-council`](marketing-council/) | "When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staffed by legendary marketers (Seth Godin, David… |
| [`marketing-ideas`](marketing-ideas/) | "When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. |
| [`marketing-loops`](marketing-loops/) | "When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent runs on a cadence (weekly, daily, on a trigger)… |
| [`marketing-plan`](marketing-plan/) | When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product. |
| [`marketing-psychology`](marketing-psychology/) | "When the user wants to apply psychological principles, mental models, or behavioral science to marketing. |
| [`media-use`](media-use/) | Agent Media OS, the single skill for every media need in a HyperFrames project. |
| [`migrate-to-shoehorn`](migrate-to-shoehorn/) | Migrate test files from `as` type assertions to @total-typescript/shoehorn. |
| [`minimalist-ui`](minimalist-ui/) | Clean editorial-style interfaces. |
| [`no-ai-slop`](no-ai-slop/) | Edit drafts into sharper, more human writing while preserving the writer's personal voice, or detect AI-slop patterns without rewriting. |
| [`notebooklm`](notebooklm/) | Use this skill to query your Google NotebookLM notebooks directly from Claude Code for source-grounded, citation-backed answers from Gemini. |
| [`obsidian-bases`](obsidian-bases/) | Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. |
| [`obsidian-cli`](obsidian-cli/) | Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. |
| [`obsidian-markdown`](obsidian-markdown/) | Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. |
| [`obsidian-vault`](obsidian-vault/) | Search, create, and manage notes in the Obsidian vault with wikilinks and index notes. |
| [`offers`](offers/) | "When the user wants to design, construct, or improve an offer — the thing they actually sell — including value framing, bonus stacking, guarantee design,… |
| [`onboarding`](onboarding/) | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. |
| [`paywalls`](paywalls/) | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. |
| [`planning-with-files`](planning-with-files/) | "Manus-style persistent file-based planning for AI coding agents: keeps task_plan.md, findings.md, and progress.md on disk so work survives context loss and… |
| [`popups`](popups/) | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. |
| [`pricing`](pricing/) | "When the user wants help with pricing decisions, packaging, or monetization strategy. |
| [`product-marketing`](product-marketing/) | "When the user wants to create or update their product marketing context document. |
| [`programmatic-seo`](programmatic-seo/) | When the user wants to create SEO-driven pages at scale using templates and data. |
| [`prospecting`](prospecting/) | When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general B2B, or local small businesses. |
| [`prototype`](prototype/) | Build a throwaway prototype to answer a design question. |
| [`public-relations`](public-relations/) | "When the user wants help with public relations, earned media, press coverage, journalist outreach, or media strategy (not pull requests). |
| [`qa`](qa/) | Interactive QA session where user reports bugs or issues conversationally, and the agent files GitHub issues. |
| [`redesign-existing-projects`](redesign-existing-projects/) | Upgrades existing websites and apps to premium quality. |
| [`referrals`](referrals/) | "When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. |
| [`remotion-best-practices`](remotion-best-practices/) | Best practices and domain knowledge for building videos programmatically with Remotion (videos in React/TypeScript, rendered to MP4). |
| [`request-refactor-plan`](request-refactor-plan/) | Create a detailed refactor plan with tiny commits via user interview, then file it as a GitHub issue. |
| [`research`](research/) | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. |
| [`resolving-merge-conflicts`](resolving-merge-conflicts/) | "Use when you need to resolve an in-progress git merge/rebase conflict." |
| [`revops`](revops/) | "When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. |
| [`sales-enablement`](sales-enablement/) | "When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. |
| [`scaffold-exercises`](scaffold-exercises/) | Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. |
| [`schema`](schema/) | When the user wants to add, fix, or optimize schema markup and structured data on their site. |
| [`seo-audit`](seo-audit/) | When the user wants to audit, review, or diagnose SEO issues on their site. |
| [`setup-matt-pocock-skills`](setup-matt-pocock-skills/) | Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layout. |
| [`setup-pre-commit`](setup-pre-commit/) | Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. |
| [`signup`](signup/) | When the user wants to optimize signup, registration, account creation, or trial activation flows. |
| [`site-architecture`](site-architecture/) | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. |
| [`sms`](sms/) | When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart texts, post-purchase, win-back, promotional… |
| [`social`](social/) | "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms, or… |
| [`stitch-design-taste`](stitch-design-taste/) | Semantic Design System Skill for Google Stitch. |
| [`stop-slop`](stop-slop/) | Remove AI writing patterns from prose. |
| [`tdd`](tdd/) | Test-driven development. |
| [`teach`](teach/) | Teach the user a new skill or concept, within this workspace. |
| [`to-spec`](to-spec/) | Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed. |
| [`to-tickets`](to-tickets/) | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker —… |
| [`triage`](triage/) | Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write agent-ready briefs. |
| [`ubiquitous-language`](ubiquitous-language/) | Extract a DDD-style ubiquitous language glossary from the current conversation, flagging ambiguities and proposing canonical terms. |
| [`understand`](understand/) | Analyze a codebase to produce an interactive knowledge graph for understanding architecture, components, and relationships |
| [`understand-chat`](understand-chat/) | Use when you need to ask questions about a codebase or understand code using a knowledge graph |
| [`understand-dashboard`](understand-dashboard/) | Launch the interactive web dashboard to visualize a codebase's knowledge graph |
| [`understand-diff`](understand-diff/) | Use when you need to analyze git diffs or pull requests to understand what changed, affected components, and risks |
| [`understand-domain`](understand-domain/) | Extract business domain knowledge from a codebase and generate an interactive domain flow graph. |
| [`understand-explain`](understand-explain/) | Use when you need a deep-dive explanation of a specific file, function, or module in the codebase |
| [`understand-knowledge`](understand-knowledge/) | Analyze a Karpathy-pattern LLM wiki knowledge base and generate an interactive knowledge graph with entity extraction, implicit relationships, and topic… |
| [`understand-onboard`](understand-onboard/) | Use when you need to generate an onboarding guide for new team members joining a project |
| [`video`](video/) | "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. |
| [`wayfinder`](wayfinder/) | Plan a huge chunk of work — more than one agent session can hold — as a shared map of investigation tickets on your issue tracker, and resolve them one at a… |
| [`wizard`](wizard/) | Generate an interactive bash wizard that walks a human through a manual procedure — third-party setup, a one-off migration, an A→B state transition — opening… |
| [`writing-beats`](writing-beats/) | Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it. |
| [`writing-fragments`](writing-fragments/) | Writing, explore — mine raw fragments, no structure yet. |
| [`writing-great-skills`](writing-great-skills/) | Reference for writing and editing skills well — the vocabulary and principles that make a skill predictable. |
| [`writing-shape`](writing-shape/) | Writing, exploit — shape raw material into an article, paragraph by paragraph. |
| [`youtube-downloader`](youtube-downloader/) | Download YouTube videos with customizable quality and format options. |
