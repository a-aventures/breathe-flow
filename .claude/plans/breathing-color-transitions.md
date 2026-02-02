# Feature Implementation Plan: Dynamic Color Transitions

**Overall Progress:** `100%`

## TLDR
Implemented dynamic color transitions for breathing visualization where foreground and background colors change independently at optimal moments (when hidden from view) to create smooth, complementary color pairs throughout the breathing cycle.

## Critical Decisions
- **Separate color indices**: Use `foregroundColorIndex` and `backgroundColorIndex` instead of single `colorIndex` to allow independent color changes
- **Change timing**: Foreground changes when transitioning to inhale (at 0% fill, hidden), background changes when transitioning to exhale (at 100% fill, hidden)
- **Complementary pairs**: Colors cycle through gradient array maintaining visual harmony

## Tasks:

- [x] 🟩 **Step 1: Refactor color state management**
  - [x] 🟩 Replace single `colorIndex` with `foregroundColorIndex` and `backgroundColorIndex`
  - [x] 🟩 Update gradient references from `currentGradient`/`nextGradient` to `foregroundGradient`/`backgroundGradient`

- [x] 🟩 **Step 2: Implement foreground color change on inhale transition**
  - [x] 🟩 Add logic to change `foregroundColorIndex` when transitioning from exhale/holdOut → inhale
  - [x] 🟩 Color changes when foreground is at 0% (hidden from view)

- [x] 🟩 **Step 3: Implement background color change on exhale transition**
  - [x] 🟩 Add logic to change `backgroundColorIndex` when transitioning from inhale/holdIn → exhale
  - [x] 🟩 Color changes when background is hidden (foreground at 100% fill)

- [x] 🟩 **Step 4: Update JSX to use new gradient variables**
  - [x] 🟩 Replace `nextGradient` with `backgroundGradient` in background div
  - [x] 🟩 Replace `currentGradient` with `foregroundGradient` in foreground fill div

## Implementation Notes
- Colors cycle independently through `BREATH_GRADIENTS` array
- Initial state: foreground = index 0, background = index 1 (complementary pair)
- Transitions happen seamlessly when layers are hidden from user view
- No visual glitches or color flashes during transitions
