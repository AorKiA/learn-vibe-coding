---
name: design-genesis-primeng-org
description: Design system extracted from Genesis (https://genesis.primeng.org/). Use when building UI that should match this brand's visual identity.
triggers:
  - "Genesis"
  - "genesis-primeng-org"
  - "design like Genesis"
  - "Genesis風"
source: https://genesis.primeng.org/
extractedAt: 2026-09-10T14:22:26.802Z
tags: ["light", "rounded", "monochrome", "sans-serif"]
---
# Design System Inspired by Genesis

> Auto-extracted from `https://genesis.primeng.org/` on 2026-09-10

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "Escape to Top Vacation Destinations" followed by "Discover the world’s most popular vacation spots, from tropical beaches to vibrant cityscapes, perfe".

**Key Characteristics:**
- InterDisplay as the heading font
- InterDisplay as the body font for all running text
- Heading weight 600
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#64748b` used for CTAs and brand highlights
- 8 shadow level(s) detected — tinted shadows
- Rounded corners (7px+) creating a friendly, approachable feel
- Tags: light, rounded, monochrome, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#64748b`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#64748b`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#020617`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#94a3b8`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#e5e5e5`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | badge | large | text-dark |
| 2 | `#64748b` | `--palette-2` | text-accent | small | text-light |
| 3 | `#0f172a` | `--palette-3` | text-accent | small | text-light |
| 4 | `#94a3b8` | `--palette-4` | text-accent | small | text-dark |
| 5 | `#1e293b` | `--palette-5` | text-accent | small | text-light |

## 3. Typography Rules

- **Heading Font:** `InterDisplay`, sans-serif
- **Body Font:** `InterDisplay`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | InterDisplay | 52.5px | 600 | 65.625px | normal |
| H2 | InterDisplay | 42px | 600 | 52.5px | normal |
| Body | InterDisplay | 15.75px | 400 | 24.5px | normal |
| Small | primeicons | 14px | 400 | 14px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `252px` | headings |
| H1 | `238px` | headings |
| H2 | `140px` | headings |
| H3 | `78.75px` | headings |
| H4 | `52.5px` | headings |
| Body L | `42px` | body / supporting text |
| Body | `26.25px` | body / supporting text |
| Small | `21px` | body / supporting text |
| XS | `17.5px` | body / supporting text |
| Caption | `15.75px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #020617;
  border-radius: 7px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Pill Button

```css
.btn-pill {
  background: #ffffff;
  color: #020617;
  border-radius: 26843500px;
  padding: 7px 17.5px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Pill Button 2

```css
.btn-pill-2 {
  background: transparent;
  color: #020617;
  border-radius: 26843500px;
  padding: 10.5px 14px;
  font-size: 14px;
  font-weight: 400;
  border: 0.8px solid oklab(0.999994 0.0000455678 0.0000200868 / 0.12);
  cursor: pointer;
}
```

### Pill Button 3

```css
.btn-pill-3 {
  background: transparent;
  color: #ffffff;
  border-radius: 26843500px;
  padding: 7px 17.5px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Pill Button 4

```css
.btn-pill-4 {
  background: transparent;
  color: #020617;
  border-radius: 26843500px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: 0.8px solid oklab(0.999994 0.0000455678 0.0000200868 / 0.12);
  cursor: pointer;
}
```

### Pill Button 5

```css
.btn-pill-5 {
  background: transparent;
  color: #ffffff;
  border-radius: 26843500px;
  padding: 7px 10.5px;
  font-size: 14px;
  font-weight: 400;
  border: 0.8px solid oklab(0.999994 0.0000455678 0.0000200868 / 0.4);
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 7px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(120, 149, 206, 0) 0px 59px 16px -8px, rgba(120, 149, 206, 0.01) 0px 38px 15px -8px, rgba(120, 149, 206, 0.04) 0px 21px 13px -8px, rgba(120, 149, 206, 0.07) 0px 9px 9px -4px, rgba(120, 149, 206, 0.08) 0px 2px 5px 0px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `7px` — use multiples (14px, 21px, 28px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `7px` | element |
| spacing-2 | `3.5px` | element |
| spacing-3 | `10.5px` | element |
| spacing-4 | `14px` | element |
| spacing-5 | `35px` | card |
| spacing-6 | `21px` | element |
| spacing-7 | `28px` | card |
| spacing-8 | `77px` | section |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `7px` | button |
| radius-subtle | `5.25px` | subtle |
| radius-card | `28px` | card |
| radius-card | `21px` | card |
| radius-button | `6px` | button |
| radius-button | `14px` | button |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0.02) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `InterDisplay` for all headings and `InterDisplay` for body text
- Use `#64748b` as the single dominant accent/CTA color
- Maintain `7px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`7px`+) consistently for all interactive elements
- Stick to grayscale + `#64748b` accent — avoid color overload
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 600 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute InterDisplay/InterDisplay with generic alternatives
- Don't use irregular spacing — stick to 7px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't add additional saturated colors beyond the primary accent
- Don't use pure black (#000000) for text — use `#020617` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 7px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #020617
Accent:      #64748b
Border:      #e5e5e5
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `InterDisplay` heading in `#020617`, and a `#64748b` CTA button with 26843500px radius."
2. "Create a pricing card using background `#64748b`, border `#e5e5e5`, `InterDisplay` for text, and 21px padding."
3. "Design a navigation bar — `#ffffff` background, `#020617` links, `#64748b` for active state."
4. "Build a feature grid with 3 columns, 21px gap, each card using the card component style."
5. "Create a footer with `#020617` background, `#ffffff` text, and 14px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 11 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--card-shadow` | `0px 1px 1px 0px rgba(0, 0, 0, .06), 0px -1px 1px 0px rgba(0, 0, 0, .06) inset, 0px 12px 3px 0px rgba(0, 0, 0, 0), 0px 8px 3px 0px rgba(0, 0, 0, .01), 0px 4px 3px 0px rgba(0, 0, 0, .03), 0px 2px 2px 0px rgba(0, 0, 0, .05), 0px 0px 1px 0px rgba(0, 0, 0, .06)` |
| `--black-card-shadow` | `0px 1px 1px 0px rgba(0, 0, 0, .06), 0px -1px 1px 0px rgba(0, 0, 0, .06) inset, 0px 12px 3px 0px rgba(0, 0, 0, 0), 0px 8px 3px 0px rgba(0, 0, 0, .01), 0px 4px 3px 0px rgba(0, 0, 0, .03), 0px 2px 2px 0px rgba(0, 0, 0, .05), 0px 0px 1px 0px rgba(0, 0, 0, .06)` |
| `--blue-card-shadow` | `0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, .01), 0px 21px 13px -8px rgba(120, 149, 206, .04), 0px 9px 9px -4px rgba(120, 149, 206, .07), 0px 2px 5px 0px rgba(120, 149, 206, .08)` |
| `--stroke-shadow` | `0px 1px 2px 0px rgba(164, 172, 185, .24), 0px 0px 0px 1px rgba(18, 55, 105, .08)` |

### Other Variables

| Variable | Value |
|---|---|
| `--background` | `var(--p-surface-0)` |
| `--foreground` | `var(--p-surface-950)` |
| `--bg-gradient-from` | `var(--p-primary-800)` |
| `--bg-gradient-to` | `var(--p-primary-500)` |
| `--gradient-background` | `linear-gradient( 180deg, var(--bg-gradient-from) 0%, var(--bg-gradient-to) 100% )` |
| `--gradient-background-to-top` | `linear-gradient( 0deg, var(--bg-gradient-from) 0%, var(--bg-gradient-to) 100% )` |
| `--gradient-background-to-left` | `linear-gradient( 90deg, var(--bg-gradient-from) 0%, var(--bg-gradient-to) 100% )` |
