# Catan Strategy Reference

Deep strategy guide for making strong decisions in Catan Universe.

## Table of Contents
1. [Number Probability](#number-probability)
2. [Setup Placement Strategy](#setup-placement-strategy)
3. [Resource Valuation](#resource-valuation)
4. [Mid-Game Strategy Paths](#mid-game-strategy-paths)
5. [Trading Strategy](#trading-strategy)
6. [Robber Strategy](#robber-strategy)
7. [Endgame & Closing Out](#endgame--closing-out)
8. [Reading Opponents](#reading-opponents)

---

## Number Probability

The dice roll distribution is the foundation of all strategy. Two six-sided dice produce these probabilities:

| Number | Combinations | Probability | Dots on Token |
|--------|-------------|-------------|---------------|
| 2      | 1           | 2.78%       | 1 dot         |
| 3      | 2           | 5.56%       | 2 dots        |
| 4      | 3           | 8.33%       | 3 dots        |
| 5      | 4           | 11.11%      | 4 dots        |
| 6      | 5           | 13.89%      | 5 dots        |
| 7      | 6           | 16.67%      | — (robber)    |
| 8      | 5           | 13.89%      | 5 dots        |
| 9      | 4           | 11.11%      | 4 dots        |
| 10     | 3           | 8.33%       | 3 dots        |
| 11     | 2           | 5.56%       | 2 dots        |
| 12     | 1           | 2.78%       | 1 dot         |

**Key insight**: 6 and 8 are the best numbers (tied). A settlement on a 6-8-5 intersection is excellent. Avoid 2 and 12 unless the resource is critical and unavailable elsewhere.

**"Pip count"** — a quick way to evaluate a settlement spot. Count the dots under each number token touching the intersection. Higher total = more expected resources per turn.

---

## Setup Placement Strategy

### First Settlement
- Maximize pip count (sum of dots on adjacent number tokens)
- Prioritize Brick + Lumber access — early expansion is king
- Aim for 3 different resources if possible
- Don't over-index on a single high number — diversification reduces variance

### Second Settlement
- Fill resource gaps from your first settlement (ideally cover all 5 types between both)
- If you went early in round 1, you place last in round 2 (and vice versa) — assess what's left
- Consider port access if you'll have heavy production of one resource
- Ore + Grain become important — second settlement is often the time to secure them

### Settlement Placement Heuristics (Priority Order)
1. **Pip count ≥ 12** with 3 different resources → excellent, always take
2. **Pip count ≥ 10** with resource diversity → strong
3. **Any spot with a 6 or 8** on a needed resource → good
4. **Port + adjacent production** combo → situationally great
5. **Blocking a strong opponent spot** → defensive value even if your pip count is lower

### Road Direction
- Point your initial road toward your planned expansion territory
- If possible, point toward the best unclaimed intersection for your 3rd settlement
- Don't point roads into dead ends with no expansion potential

---

## Resource Valuation

Resources have different value at different game stages:

### Early Game (Turns 1–8)
| Resource | Value | Why |
|----------|-------|-----|
| Brick    | ★★★★★ | Roads + settlements |
| Lumber   | ★★★★★ | Roads + settlements |
| Grain    | ★★★☆☆ | Settlements |
| Wool     | ★★★☆☆ | Settlements |
| Ore      | ★★☆☆☆ | Only for dev cards early |

### Mid Game (Turns 9–20)
| Resource | Value | Why |
|----------|-------|-----|
| Ore      | ★★★★★ | Cities + dev cards |
| Grain    | ★★★★★ | Cities + settlements + dev cards |
| Lumber   | ★★★☆☆ | Roads for expansion |
| Brick    | ★★★☆☆ | Roads for expansion |
| Wool     | ★★☆☆☆ | Only settlements + dev cards |

### Late Game (Turns 20+)
| Resource | Value | Why |
|----------|-------|-----|
| Ore      | ★★★★★ | Cities are the fastest VP path |
| Grain    | ★★★★★ | Cities + dev cards for Largest Army |
| Wool     | ★★★☆☆ | Dev cards for hidden VP or Army |
| Brick    | ★★☆☆☆ | Only if racing for Longest Road |
| Lumber   | ★★☆☆☆ | Only if racing for Longest Road |

---

## Mid-Game Strategy Paths

There are 3 main archetypes to aim for. You don't have to commit rigidly, but lean into one:

### 1. "Ore-Grain Engine" (City Rush)
- Build cities ASAP on your highest-production hexes
- 3 cities + 2 settlements = 8 VP, then get 2 more from road/army/dev cards
- Best when you have strong Ore + Grain production (5s, 6s, 8s, 9s)
- Risk: slow start, vulnerable to robber on ore/grain hexes

### 2. "Brick-Lumber Sprawl" (Road + Settlement Rush)
- Expand fast: build roads and settlements aggressively
- Contest Longest Road early (2 VP)
- Build 4-5 settlements on diverse hexes
- Best when you have strong Brick + Lumber and the board has open space
- Risk: settlements produce less than cities; you may stall at 8-9 VP

### 3. "Development Card Engine" (Army + Hidden VP)
- Buy dev cards aggressively (Ore + Wool + Grain)
- Aim for Largest Army (2 VP) + hidden VP cards
- Knights give you robber control (huge strategic advantage)
- Best when the board is crowded and building is limited
- Risk: RNG on card draws; you may get Road Building cards you don't need

### Hybrid
Most winning games combine elements. A common winning formula:
- 2 cities (4 VP) + 2 settlements (2 VP) + Longest Road or Largest Army (2 VP) + 2 hidden VP cards = 10 VP

---

## Trading Strategy

### Rules of Thumb
1. **Never trade away the resource an opponent needs to win.** If they're at 8 VP and need Ore for a city, don't give them Ore at any price.
2. **Trade surplus for scarcity.** If you have 4 Lumber and no Ore, a 1:1 trade is fine — even slightly unfavorable trades are better than holding dead cards (robber risk).
3. **Prefer bank trades over bad player trades.** A 4:1 bank trade is guaranteed and doesn't help opponents. A 2:1 port trade is excellent.
4. **Trade early in your turn.** This maximizes your building options.
5. **Keep your hand below 8 cards.** Every resource above 7 is at risk when a 7 is rolled. Build or trade to stay lean.
6. **Watch what opponents trade for.** If someone keeps buying Grain, they're probably building cities or dev cards.

### When to Accept Trades
- Accept if the trade improves your immediate build plan
- Accept if it diversifies your hand (reducing robber pain)
- Decline if it gives the leader what they need
- Decline if you're about to roll and might get what you need for free

### Port Strategy
- 2:1 ports are game-changing if you produce that resource heavily
- A settlement on a 2:1 Ore port with cities on Ore hexes = near-unlimited buying power
- 3:1 ports are solid utility — they let you convert any surplus
- Port settlements still need decent production numbers on adjacent hexes

---

## Robber Strategy

### Where to Place the Robber
Priority order:
1. **On the leading player's most productive hex** (highest pip count touching their settlements/cities)
2. **On a hex with a 6 or 8** that benefits opponents but not you
3. **On a hex touching an opponent's city** (blocks 2 resources per roll instead of 1)
4. **NOT on a hex touching your own settlements** — obvious but easy to miss under time pressure

### Who to Steal From
- Steal from the player with the most cards (highest chance of getting something useful)
- If tied, steal from the leader
- If you need a specific resource, steal from the player most likely to have it (based on recent production)

### Defending Against the Robber
- Keep your hand at 7 or fewer cards
- If you're getting robbed repeatedly, consider trading away the resource on the blocked hex
- Play Knight cards to move the robber off your hexes
- Diversify settlement placement so one robber can't cripple your entire income

---

## Endgame & Closing Out

### Signs You're in the Endgame
- Any player is at 7+ VP
- The board is mostly full (few expansion spots left)
- Longest Road and Largest Army are established or contested

### Closing Moves
- **Count to 10**: always know your exact VP total and what gets you there
- **Hidden VP cards**: if you're at 8 visible VP and have 2 hidden VP cards → you've already won, just end your turn after revealing
- **Steal Longest Road**: if you can break an opponent's road with a settlement and your road is now longest, that's a 4 VP swing
- **Steal Largest Army**: one more Knight can flip 4 VP (they lose 2, you gain 2)
- **Don't telegraph**: avoid making it obvious you're about to win. Buy dev cards and hold them rather than building conspicuously

### Desperation Plays (When Behind)
- Monopoly card on a resource you know opponents are hoarding
- Year of Plenty to complete an unexpected build
- Knight spam for Largest Army
- Road Building to steal Longest Road

---

## Reading Opponents

### What Their Trades Reveal
- Buying lots of Ore + Grain → city strategy
- Buying Brick + Lumber → expansion / road strategy
- Buying Ore + Wool + Grain → development card strategy
- Refusing all trades → they probably have what they need already (dangerous!)

### What Their Board Reveals
- Count their visible VP (settlements × 1 + cities × 2 + special cards × 2)
- Count their Knights played (shown near their avatar) — watch for Largest Army threats
- Count their road length — watch for Longest Road threats
- If their visible VP + potential hidden VP ≥ 10, they might win next turn

### Threat Assessment
Every turn, do a quick threat scan:
1. Who has the most VP?
2. Who is closest to Longest Road?
3. Who is closest to Largest Army?
4. Who has the most cards in hand? (potential hidden VP or resources to build)
5. Where should the robber go to slow the leader?
