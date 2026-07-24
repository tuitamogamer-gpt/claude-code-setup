# Claude Code — Plugin Marketplace Izvori (3)

Lokalni plugin marketplace-ovi instalirani u Claude Code CLI (`claude plugin`). Svaki folder
je kompletan izvor marketplace-a (bez `.git`), spreman za ponovnu instalaciju.

| Folder | Plugin | Verzija | Upstream |
|---|---|---|---|
| [`Understand-Anything`](Understand-Anything/) | `understand-anything` — knowledge graph analiza koda (`/understand`, `/graphify` backend) | 2.8.1 | [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) |
| [`taste-skill`](taste-skill/) | `taste-skill` — kolekcija design/frontend skillova | 1.0.0 | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) |
| [`last30days-skill`](last30days-skill/) | `last30days` — social/web research zadnjih 30 dana | 3.8.3 | (lokalni izvor, nema remote) |

## Instalacija na novom računaru

Najlakše: `../install.sh` iz korena repoa. Ručno:

```bash
mkdir -p ~/.claude/plugin-sources
cp -R Understand-Anything taste-skill last30days-skill ~/.claude/plugin-sources/

claude plugin marketplace add ~/.claude/plugin-sources/Understand-Anything
claude plugin marketplace add ~/.claude/plugin-sources/taste-skill
claude plugin marketplace add ~/.claude/plugin-sources/last30days-skill

claude plugin install understand-anything@understand-anything
claude plugin install taste-skill@taste-skill
claude plugin install last30days@last30days-skill
```

> Imena marketplace-a (`understand-anything`, `taste-skill`, `last30days-skill`) čita iz
> `.claude-plugin/marketplace.json` u svakom folderu — `claude plugin marketplace add` ih
> registruje automatski pod tim imenima.

Za `understand-anything` i `taste-skill` alternativno možeš instalirati direktno sa GitHub-a
(upstream linkovi gore) — lokalne kopije ovde garantuju istu verziju koja je bila u upotrebi.
