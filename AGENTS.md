Use the shared Button component and global button-surface tokens for app actions, so shape and background-aware shading stay consistent across screens.

Typography is controlled by the font pair system: src/lib/typography.ts (FONT_PAIRS, DEFAULT_FONT_PAIR_ID) + FontPairProvider sets --font-display/--font-sans/--font-weight-display, so font changes go through those tokens — never hardcode font-family in components.

Breathing theme definitions live in the theme registry; watercolor images are full-screen sheets revealed by clipping instead of resizing, so the inhale/exhale fill retains its paper grain and distinct pigment washes.