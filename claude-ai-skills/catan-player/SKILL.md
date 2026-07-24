---
name: catan-player
description: Play Catan Universe (Steam) via computer-use — screen reading, mouse clicks, and keyboard shortcuts. Use this skill whenever the user asks you to play Catan, make moves in Catan Universe, help with a Catan game in progress, or automate Catan gameplay. Triggers on "play Catan", "Catan Universe", "my turn in Catan", "Catan move", "settle in Catan", or any request involving the Catan Universe digital board game.
---

# Catan Universe Player

Play the digital board game Catan Universe (on Steam) via computer-use tools — screenshot reading, mouse clicks, and keyboard input.

## Prerequisites

- Computer-use access granted for Catan Universe (Steam app)
- The game must already be launched and in a match (lobby navigation is not covered here)
- Take a screenshot BEFORE every decision to read the current board state

## Core Loop — How to Play a Turn

Every action follows the same rhythm: **screenshot → read → decide → act → verify**.

```
1. Take screenshot
2. Identify: whose turn? what phase? what resources do I have?
3. Decide best action (see Strategy section + references/strategy.md)
4. Execute via click or keyboard shortcut
5. Take another screenshot to confirm the action landed
```

Never chain multiple actions without verifying each one. The UI is modal-heavy and animations can block input.

---

## Reading the Screen

### Resource Bar (Bottom of Screen)
Your resources are displayed as small icons at the bottom HUD. After each screenshot, identify counts for all five resources:
- 🪵 **Lumber** (wood/forest)
- 🧱 **Brick** (clay/hills)
- 🐑 **Wool** (sheep/pasture)
- 🌾 **Grain** (wheat/fields)
- 🪨 **Ore** (mountain)

The icons are small — zoom in mentally on the bottom bar. If counts are hard to read, try zooming the camera in-game (scroll wheel), though be careful as zooming is sensitive.

### Player Info (Top / Sides)
- Player avatars with colored borders (red, blue, white, yellow, green, brown)
- Small symbols below avatars indicate pending actions
- Victory point count shown next to each player's avatar
- **Turn timer** visible — the active player has a countdown

### Board State
- Hex tiles with number tokens (2–12, no 7)
- Red/white dots under numbers indicate probability (more dots = more likely)
- Settlements (small houses), cities (larger structures), roads (colored paths)
- Robber: a dark figure sitting on one hex, blocking its production
- Ports: located on coastal hexes, showing trade ratios (3:1 or 2:1 with a resource icon)

### Identifying Whose Turn It Is
- The roll dice / end turn button is only active during YOUR turn
- The turn timer counts down for the active player
- If you see a "Roll Dice" button or the N key prompt is active → it's your turn

---

## Keyboard Shortcuts

These are faster and more reliable than finding small buttons:

| Key | Action |
|-----|--------|
| **N** | Roll dice / End turn (context-sensitive) |
| **Y** | Open domestic trade dialog |
| **Spacebar** | Confirm current selection |
| **W/A/S/D** or Arrow keys | Pan the board view |

Prefer keyboard shortcuts over clicking buttons — they avoid misclick risks (especially the Trade/End Turn buttons which are close together).

---

## Game Phases & Actions

### Phase 1: Setup (Initial Placement)

You place 2 settlements and 2 roads for free, in two rounds:
- **Round 1**: Place 1 settlement → 1 road (in player order)
- **Round 2**: Place 1 settlement → 1 road (reverse order)

**How to place:**
1. Screenshot → identify valid settlement locations (highlighted circles on intersections)
2. Click the desired intersection
3. Screenshot → confirm settlement placed
4. Click a valid adjacent edge for road placement
5. Screenshot → confirm road placed

**Setup strategy** (critical — these choices shape the entire game):
- Prioritize intersections touching high-probability numbers (6, 8, 5, 9)
- Diversify resources — aim for access to all 5 resource types across both settlements
- Brick + Lumber access is essential early (you need roads and settlements)
- Ore + Grain access wins the late game (cities and development cards)
- Consider port access for your second settlement if you'll have surplus of one resource
- Block opponents from strong spots when possible
- See `references/strategy.md` for detailed placement heuristics

### Phase 2: Roll Dice

When it's your turn and you see the roll prompt:
1. Press **N** to roll (or click the dice button)
2. Screenshot → read the result
3. If **7 is rolled** → Robber phase activates (see below)
4. Otherwise → resources are distributed automatically based on the number

### Phase 3: Robber (When 7 is Rolled)

**Discard phase** (if anyone holds 8+ cards):
1. Screenshot → check if a discard dialog appeared
2. If you must discard: select cards to drop (half your hand, rounded down)
3. Click confirm
4. Strategy: discard resources you have the most of, or ones least useful to your current plan

**Move the robber:**
1. Screenshot → the game asks you to place the robber on a hex
2. Click the hex you want to block (ideally one producing for your strongest opponent, not yourself)
3. Screenshot → if multiple opponents touch that hex, choose which one to steal from
4. Click the opponent to steal 1 random card from them

### Phase 4: Trade

**Domestic trade (with other players):**
1. Press **Y** to open trade dialog
2. Set resources you want to give (click upper half of resource icons to increase)
3. Set resources you want to receive
4. Click confirm (checkmark, lower right) to send offer
5. Screenshot → wait for responses (accept / counteroffer / decline)
6. If counteroffers arrive, evaluate them

**Maritime / Bank trade:**
- 4:1 — trade 4 of any same resource for 1 of any other (always available)
- 3:1 — if you have a settlement/city on a generic harbor
- 2:1 — if you have a settlement/city on a specific resource harbor
- These are accessed through the trade interface, not domestic trade

**Trade strategy:**
- Don't give opponents what they need to win
- Trade away surplus resources, especially if you're about to hit 8+ cards (robber risk)
- 2:1 ports are extremely valuable — if you produce a lot of one resource, settle a matching port

### Phase 5: Build

Check what you can afford, then build in priority order:

| Structure | Cost | When to Build |
|-----------|------|---------------|
| **Road** | 1 Lumber + 1 Brick | To expand toward good spots or contest Longest Road |
| **Settlement** | 1 Lumber + 1 Brick + 1 Wool + 1 Grain | When you have a valid spot at distance ≥ 2 from all settlements |
| **City** | 3 Ore + 2 Grain | Upgrade settlement on high-production hexes first |
| **Dev Card** | 1 Ore + 1 Wool + 1 Grain | When you can't build anything else useful, or pushing for Largest Army |

**How to build:**
1. Click the Build menu (or the specific structure icon in the HUD)
2. Screenshot → valid placement locations appear as highlighted circles/edges
3. Click the desired location
4. Screenshot → verify placement succeeded

### Phase 6: Play Development Card (Optional, Max 1 Per Turn)

Cards bought on previous turns can be played. Cannot play a card bought this turn.

| Card | Effect | When to Play |
|------|--------|-------------|
| **Knight** | Move robber + steal (like rolling 7) | When robber is hurting you, or to push toward Largest Army (3+ Knights) |
| **Road Building** | Place 2 free roads | When expanding aggressively or racing for Longest Road |
| **Year of Plenty** | Take any 2 resources from bank | When you're 1-2 resources short of a key build |
| **Monopoly** | Steal ALL of one resource type from ALL players | When you know opponents are hoarding a resource (watch their trades!) |
| **Victory Point** | Hidden — auto-counts toward your total | Never "played" — they just count. Use to surprise-win |

### Phase 7: End Turn

When done with all actions:
1. Press **N** to end your turn
2. Screenshot → confirm turn passed to next player

---

## Handling UI Quirks

### Modal Dialogs
The game frequently shows modal popups that block all other interaction. Always screenshot after any action — if a popup appeared, you must close or interact with it before doing anything else.

### Animation Delays
Placement animations (dust effects), resource distribution animations, and trade offer popups can obscure the board. Wait ~1-2 seconds after actions before taking the next screenshot.

### Misclick Prevention
- Trade and End Turn buttons are very close together — use keyboard shortcuts instead
- Resource selection in trade dialogs: click carefully. Upper half of card = increase, lower half = decrease. Clicking the wrong zone cycles the wrong direction.
- When discarding for the robber: clicking a selected card to deselect requires clicking the TOP of the card

### Camera Management
- If the board is hard to read, reset camera: try dragging right-mouse-button downward for a top-down 2D view
- Avoid accidental zoom with scroll wheel
- Camera may auto-pan during opponent turns — wait for it to settle

---

## Victory Conditions

First to **10 victory points** wins:
- Settlement = 1 VP
- City = 2 VP
- Longest Road (5+ connected roads, more than anyone else) = 2 VP
- Largest Army (3+ Knights played, more than anyone else) = 2 VP
- Victory Point development cards = 1 VP each (hidden)

Always track your VP count and opponents' visible VPs. If an opponent is at 8-9 visible VP, they may have hidden VP cards — play aggressively.

---

## Decision Framework (Quick Reference)

On each turn, ask these questions in order:

1. **Do I need to respond to something?** (Robber, discard, trade offer)
2. **Can I build a city?** (Highest priority build — doubles production)
3. **Can I build a settlement?** (Expands resource income and VP)
4. **Should I buy a dev card?** (If pushing Largest Army or can't build)
5. **Should I build roads?** (Only if needed to reach a settlement spot or contest Longest Road)
6. **Should I trade?** (To enable one of the above builds)
7. **End turn** if nothing productive to do (don't over-trade and help opponents)

For deeper strategic analysis, read `references/strategy.md`.

---

## Screenshot Cadence

Take screenshots at these moments (minimum):
1. Start of your turn (before rolling)
2. After rolling dice (read the number and resource distribution)
3. Before any build/trade action (confirm current state)
4. After any build/trade action (verify it succeeded)
5. After any popup/dialog appears (read what it wants)
6. Before ending turn (final check — did I miss anything?)

When in doubt, take an extra screenshot. It's cheap and prevents blind mistakes.
