# Design System Inspired by PrimeReact Ultima

> Auto-extracted from `https://ultima.primereact.org/` on 2026-09-10

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

**Key Characteristics:**
- Inter as the heading font
- Roboto as the body font for all running text
- Light/white background (#fafafa) as the primary canvas
- Primary accent `#00bcd4` used for CTAs and brand highlights
- 8 shadow level(s) detected — tinted shadows
- Rounded corners (100px+) creating a friendly, approachable feel
- Tags: light, rounded, colorful, compact, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#00bcd4`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#e91e63`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#fafafa`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#eeeeee`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#000000`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#657380`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#eeeeee`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | block | large | text-dark |
| 2 | `#eeeeee` | `--palette-2` | button | large | text-dark |
| 3 | `#3f51b5` | `--palette-3` | block | medium | text-light |
| 4 | `#00bcd4` | `--palette-4` | button | medium | text-dark |
| 5 | `#e91e63` | `--palette-5` | button | medium | text-light |
| 6 | `#009688` | `--palette-6` | button | medium | text-light |
| 7 | `#283593` | `--palette-7` | button | small | text-light |
| 8 | `#00a0b4` | `--palette-8` | badge | small | text-light |
| 9 | `#f57c00` | `--palette-9` | badge | small | text-dark |
| 10 | `#657380` | `--palette-10` | text-accent | small | text-light |
| 11 | `#0000ee` | `--palette-11` | text-accent | small | text-light |
| 12 | `#fbc02d` | `--palette-12` | badge | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Inter`, sans-serif
- **Body Font:** `Roboto` (web font)

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Body | Roboto | 14px | 400 | 21px | normal |
| Small | Roboto | 11.6667px | 400 | normal | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `28px` | headings |
| H1 | `21px` | headings |
| H2 | `17.5px` | headings |
| H3 | `14px` | headings |
| H4 | `12.25px` | headings |
| Body L | `11.998px` | body / supporting text |
| Body | `11.6667px` | body / supporting text |
| Small | `10.5px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #000000;
  border-radius: 4px;
  padding: 10.5px 10.5px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #515c66;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button 2

```css
.btn-ghost-2 {
  background: transparent;
  color: #000000;
  border-radius: 50px;
  padding: 7.994px 7.994px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Ghost Button 3

```css
.btn-ghost-3 {
  background: transparent;
  color: #3f51b5;
  border-radius: 50px;
  padding: 7.994px 7.994px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #3f51b5;
  color: #ffffff;
  border-radius: 4px;
  padding: 7.994px 7.994px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #3f51b5;
  color: #000000;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #ffffff;
  border-radius: 4px;
  padding: 14px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `10.5px` — use multiples (21px, 31.5px, 42px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `10.5px` | element |
| spacing-2 | `14px` | element |
| spacing-3 | `7px` | element |
| spacing-4 | `7.994px` | element |
| spacing-5 | `3.5px` | element |
| spacing-6 | `1px` | element |
| spacing-7 | `21px` | element |
| spacing-8 | `28px` | card |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-pill | `100px` | pill |
| radius-subtle | `4px` | subtle |
| radius-card | `50px` | card |
| radius-subtle | `1.75px` | subtle |
| radius-card | `21px` | card |
| radius-subtle | `3.5px` | subtle |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0...` | Cards, subtle elevation |
| Mid | `rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(...` | Dropdowns, popovers |
| Mid | `rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(...` | Dropdowns, popovers |
| Mid | `rgba(0, 0, 0, 0.03) 0px 4px 10px 0px, rgba(0, 0, 0, 0.06) 0px 0px 2px 0px, rgba(...` | Dropdowns, popovers |
| Low | `rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0...` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#fafafa` as the primary background color
- Use `Inter` for all headings and `Roboto` for body text
- Use `#00bcd4` as the single dominant accent/CTA color
- Maintain `10.5px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`100px`+) consistently for all interactive elements
- Embrace bold color combinations — playful energy is the point
- Apply the shadow system for elevation — use the extracted shadow values

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Inter/Roboto with generic alternatives
- Don't use irregular spacing — stick to 10.5px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use oversized hero text — this brand uses restrained type
- Don't use pure black (#000000) for text — use `#000000` instead
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
- Maintain 10.5px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #fafafa
Text:        #000000
Accent:      #00bcd4
Secondary:   #e91e63
Border:      #eeeeee
```

### Example Prompts

1. "Build a hero section with a `#fafafa` background, `Inter` heading in `#000000`, and a `#00bcd4` CTA button with 4px radius."
2. "Create a pricing card using background `#eeeeee`, border `#eeeeee`, `Roboto` for text, and 31.5px padding."
3. "Design a navigation bar — `#fafafa` background, `#000000` links, `#00bcd4` for active state."
4. "Build a feature grid with 3 columns, 31.5px gap, each card using the card component style."
5. "Create a footer with `#000000` background, `#fafafa` text, and 21px padding."

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

> 158 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--text-color` | `rgba(0, 0, 0, 0.87)` |
| `--text-color-secondary` | `rgba(0, 0, 0, 0.6)` |
| `--primary-color` | `#3f51b5` |
| `--primary-color-text` | `#ffffff` |
| `--surface-0` | `#ffffff` |
| `--surface-50` | `#fafafa` |
| `--surface-100` | `#f5f5f5` |
| `--surface-200` | `#eeeeee` |
| `--surface-300` | `#e0e0e0` |
| `--surface-400` | `#bdbdbd` |
| `--surface-500` | `#9e9e9e` |
| `--surface-600` | `#757575` |
| `--surface-700` | `#616161` |
| `--surface-800` | `#424242` |
| `--surface-900` | `#212121` |
| `--gray-50` | `#fafafa` |
| `--gray-100` | `#f5f5f5` |
| `--gray-200` | `#eeeeee` |
| `--gray-300` | `#e0e0e0` |
| `--gray-400` | `#bdbdbd` |
| `--gray-500` | `#9e9e9e` |
| `--gray-600` | `#757575` |
| `--gray-700` | `#616161` |
| `--gray-800` | `#424242` |
| `--gray-900` | `#212121` |
| `--surface-ground` | `#fafafa` |
| `--surface-section` | `#ffffff` |
| `--surface-card` | `#ffffff` |
| `--surface-overlay` | `#ffffff` |
| `--surface-border` | `rgba(0, 0, 0, 0.12)` |
| ... | *(122 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--content-padding` | `1rem` |
| `--inline-spacing` | `0.5rem` |
| `--border-radius` | `4px` |

### Typography Variables

| Variable | Value |
|---|---|
| `--font-family` | `Roboto, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif` |

### Other Variables

| Variable | Value |
|---|---|
| `--focus-ring` | `none` |
| `--transition-duration` | `0.2s` |
