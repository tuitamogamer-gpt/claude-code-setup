# Catan Universe UI Interaction Patterns

Detailed reference for interacting with the Catan Universe interface via computer-use tools.

## Table of Contents
1. [Screenshot Analysis Checklist](#screenshot-analysis-checklist)
2. [Common UI States & What To Do](#common-ui-states--what-to-do)
3. [Click Targets by Phase](#click-targets-by-phase)
4. [Handling Modals & Popups](#handling-modals--popups)
5. [Error Recovery](#error-recovery)
6. [Camera Management](#camera-management)

---

## Screenshot Analysis Checklist

After every screenshot, extract this information before deciding on an action:

### Quick Read (5 items, every screenshot)
1. **Whose turn?** — Check turn timer position and active button state
2. **What phase?** — Roll / Build & Trade / Robber / Discard / Setup
3. **My resources?** — Read the bottom HUD icon counts
4. **Any popup/modal?** — If yes, deal with it before anything else
5. **Score check** — My VP and leading opponent's VP

### Deep Read (before strategic decisions)
6. **Board positions** — Where are my settlements, cities, roads? Where are opponents'?
7. **Available build spots** — Any valid settlement locations I can reach?
8. **Port access** — Which ports do I control?
9. **Robber location** — Which hex is blocked?
10. **Opponent hand sizes** — Large hands = robber vulnerability
11. **Development cards played** — Knight count per player (Largest Army race)
12. **Road lengths** — Who has Longest Road or is close?

---

## Common UI States & What To Do

### "Waiting for your dice roll"
- **Indicator**: Dice icon or "Roll" button is highlighted/active
- **Action**: Press **N** key
- **Verify**: Screenshot shows a number result and resource distribution

### "Your turn — Build & Trade"
- **Indicator**: Build icons (road, settlement, city, dev card) are active; End Turn button visible
- **Action**: Evaluate builds, trades, or dev card plays (see SKILL.md decision framework)
- **End**: Press **N** to end turn when done

### "Move the Robber"
- **Indicator**: Board has highlighted hexes waiting for robber placement; prompt text visible
- **Action**: Click a hex to place the robber
- **Then**: If prompted, click an opponent's avatar to steal from

### "Discard Cards"
- **Indicator**: A dialog showing your hand with selection interface
- **Action**: Select cards to discard (half your hand, rounded down)
- **Then**: Click confirm (checkmark)
- **Pitfall**: Clicking the wrong part of a card may toggle the wrong direction. Click TOP to deselect.

### "Trade Offer Received"
- **Indicator**: A popup showing what another player offers
- **Action**: Click checkmark to accept, X to decline, or bag+arrow icon to counteroffer
- **Pitfall**: Read carefully — accepting bad trades helps opponents

### "Choose a Resource" (Year of Plenty / Monopoly)
- **Indicator**: A resource selection dialog
- **Action**: Click the resource(s) you want
- **Then**: Click confirm

### "Place Settlement / Road" (Setup or Build Phase)
- **Indicator**: Highlighted circles on intersections (settlements) or edges (roads)
- **Action**: Click the desired highlighted location
- **Verify**: The piece appears in your color

---

## Click Targets by Phase

### Setup Phase
```
Settlement placement:
  → Click highlighted intersection circle (glowing dot on hex vertex)

Road placement:
  → Click highlighted edge circle (glowing dot on hex edge, adjacent to just-placed settlement)
```

### Roll Phase
```
Roll dice:
  → Press N key (preferred)
  → Or click the dice/roll button (usually center-bottom area)
```

### Build Phase
```
Open build menu:
  → Click specific structure icon in HUD, or look for build panel

Build Road:
  → Click road icon → click highlighted edge on board → verify

Build Settlement:
  → Click settlement icon → click highlighted intersection → verify

Build City:
  → Click city icon → click your existing settlement to upgrade → verify

Buy Dev Card:
  → Click dev card icon (card deck icon) → confirm purchase
```

### Trade Phase
```
Domestic trade:
  → Press Y key (or click trade button)
  → Set "give" resources (upper half of card icons to increase)
  → Set "want" resources
  → Click confirm (checkmark, lower right)
  → Wait for responses

Bank/port trade:
  → Access through trade interface
  → Select resource to give (4:1, 3:1, or 2:1 depending on ports)
  → Select resource to receive
  → Confirm
```

### Development Card
```
Play dev card:
  → Click your dev card area
  → Select the card to play (it enlarges when selected)
  → Click confirm
  → Handle card effect (Knight → move robber, etc.)
```

### End Turn
```
End turn:
  → Press N key (preferred — avoids misclick with nearby Trade button)
  → Or click End Turn button
```

---

## Handling Modals & Popups

### Priority: Always handle modals first
Modals block all other interaction. If you see one after a screenshot, you MUST interact with it before trying to click the board or HUD.

### Common modals and their close/action buttons:

| Modal | Action Button | Location |
|-------|--------------|----------|
| Trade offer from player | Accept (✓) / Decline (✗) / Counter (bag icon) | Center of dialog |
| Discard cards (robber) | Confirm (✓) after selecting cards | Bottom right of dialog |
| Resource choice | Click resource → Confirm | Center of dialog |
| Longest Road notification | Wait for auto-dismiss or click dismiss | Center |
| DLC / promotion popup | Close (✗) button | Top right corner |
| Game over screen | Shows winner and stats | Click to dismiss |

### If a modal seems stuck:
1. Wait 2-3 seconds (animation may still be playing)
2. Take another screenshot
3. Look for any clickable button (✗, ✓, "OK", "Close")
4. If truly stuck, try pressing Escape key

---

## Error Recovery

### Accidentally clicked wrong build location
- The game may have a cancel/undo for the current action (look for ✗ button)
- If the build is already confirmed, you cannot undo — adapt your strategy

### Accidentally ended turn too early
- Turns cannot be undone. Make sure to complete all builds and trades before pressing N.
- Prevention: always do a "final check" screenshot before ending turn

### Camera got stuck in weird angle
- Right-click and drag to rotate
- Drag downward for top-down 2D view (easiest to read)
- Scroll wheel to zoom (carefully — it's sensitive)
- W/A/S/D to pan

### Game seems unresponsive
1. Take a screenshot — is there a hidden modal?
2. Try clicking on an empty area of the board
3. Try pressing Escape
4. Wait 3-5 seconds for animations to complete
5. If truly frozen, the game may need to be restarted (tell the user)

### Turn timer running out
- If the timer is low, prioritize the single most impactful action
- Better to make one good trade/build than to panic-click multiple things
- If you can't decide in time, just end turn — losing a turn is better than misclicking

---

## Camera Management

### Recommended View
The best camera angle for screen reading is **top-down 2D view**:
1. Right-click and drag downward until the board is flat
2. Zoom out enough to see the entire board
3. This gives the clearest view of all hexes, numbers, and pieces

### When to Adjust Camera
- If you can't read resource counts → zoom in on bottom HUD
- If you can't see a specific board area → pan with W/A/S/D
- If 3D perspective is obscuring pieces → switch to 2D top-down
- After opponent turns (camera may have auto-panned) → reset to your preferred view

### Camera Settings (if accessible)
- Disable "auto-zoom during opponent moves" in Settings if available
- This prevents the camera from jumping around between turns
