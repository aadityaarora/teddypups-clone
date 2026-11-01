---
version: alpha
name: TeddyPups U.A.E.
description: "Light interface measured from puppy.instabizweb.com: Fraunces type with Figtree, light orange accents, tonal surfaces and pill-shaped controls."
colors:
  background: "#FFFDF8"
  surface: "#FFFDF8"
  on-surface: "#2A170E"
  on-background: "#2A170E"
  on-surface-variant: "#5A3A28"
  surface-container-low: "#FFFDF8EB"
  outline: "#FFFDF847"
  primary: "#FBE3B4"
  on-primary: "#000000"
  secondary: "#A24A1A"
  tertiary: "#1F7A4D"
  warning: "#F2BE6B"
typography:
  headline-display:
    fontFamily: Fraunces
    fontSize: 99px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 92px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Fraunces
    fontSize: 60.5px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.025em
  headline-sm:
    fontFamily: Fraunces
    fontSize: 34.5px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.025em
  title-lg:
    fontFamily: Fraunces
    fontSize: 33px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.025em
  body-md:
    fontFamily: Figtree
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.38
  body-lg:
    fontFamily: Figtree
    fontSize: 17px
    fontWeight: 650
    lineHeight: 1.1
  label-lg:
    fontFamily: Figtree
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: Figtree
    fontSize: 16px
    fontWeight: 620
    lineHeight: 1.6
  label-sm:
    fontFamily: Figtree
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.43
  headline-display-mobile:
    fontFamily: Fraunces
    fontSize: 41.5px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Fraunces
    fontSize: 41.5px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.025em
  title-lg-mobile:
    fontFamily: Fraunces
    fontSize: 25.5px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.025em
rounded:
  md: 16px
  full: 9999px
spacing:
  xs: 2.4px
  sm: 5.6px
  md: 9.6px
  lg: 25.6px
  xl: 56px
  gutter: 9.6px
  section: 81px
  margin: 56px
  container: 1760px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.background}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    padding: 13.6px 25.6px
    height: 52px
  button-secondary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: 9.6px 21.6px
    height: 44px
  button-tertiary:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.background}"
    typography: "{typography.body-lg}"
    padding: 12px 20px
    height: 24px
  button-ghost:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    padding: 13.6px 25.6px
  link:
    textColor: "{colors.on-surface}"
---

# TeddyPups U.A.E. Design System

## Overview

TeddyPups U.A.E. describes itself as: “Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.” The interface is light, built on **Warm Snow (#FFFDF8)** with **Deep Orange (#2A170E)** text, and **Light Orange (#FBE3B4)** as the main accent.

Type is set in **Fraunces** and **Figtree**. Headlines run large with tight negative tracking; body text is 14px. Depth comes from soft drop shadows. Controls are pill-shaped.

Measured from [puppy.instabizweb.com](https://puppy.instabizweb.com/) on November 1, 2026 at 1440×900 and 390×844 from 371 rendered elements. Values are computed styles from the live page, not the original source files.

## Colors

The palette has 10 roles, plus gradient stops #E4A85B, #D38F45, #FFF1D8, #FBE3B4.

- **Warm Snow (#FFFDF8):** Page background, seen 10 times. Token `background`, CSS `--color-milk`.
- **Deep Orange (#2A170E):** Primary text and headings, seen 41 times. Token `on-surface`.
- **Dark Orange (#5A3A28):** Secondary text, seen 10 times. Token `on-surface-variant`, CSS `--color-cocoa-soft`.
- **Warm Snow 92% (#FFFDF8EB):** Raised areas one step from the page, seen 1 time. Token `surface-container-low`.
- **Warm Snow 28% (#FFFDF847):** Borders and dividers, seen 8 times. Token `outline`.
- **Light Orange (#FBE3B4):** Brand color on large areas, seen 15 times. Token `primary`, CSS `--color-honey-soft`.
- **Near Black (#000000):** Text and icons on primary. Token `on-primary`.
- **Dark Orange (#A24A1A):** Secondary buttons, seen 15 times. Token `secondary`, CSS `--color-toffee-deep`.
- **Dark Teal (#1F7A4D):** Secondary buttons, seen 3 times. Token `tertiary`.
- **Orange (#F2BE6B):** Warnings and highlights, seen 10 times. Token `warning`.

## Typography

**Fraunces** and **Figtree** share the interface. Fallback stack: `Fraunces, Fraunces Fallback, ui-serif, Georgia`. Other loaded fonts: Shantell Sans.

- **headline-display:** Fraunces 99px at weight 800, line height 0.92, tracking -0.025em (41.5px on mobile). Page title (h1).
- **headline-lg:** Fraunces 92px at weight 800, line height 0.92, tracking -0.025em (41.5px on mobile). Section headings (h2).
- **headline-md:** Fraunces 60.5px at weight 800, line height 0.92, tracking -0.025em. Sub-section headings.
- **headline-sm:** Fraunces 34.5px at weight 800, line height 1, tracking -0.025em. Card and feature titles.
- **title-lg:** Fraunces 33px at weight 800, line height 1.05, tracking -0.025em (25.5px on mobile). Small titles.
- **body-md:** Figtree 14px at weight 400, line height 1.38. Body text.
- **body-lg:** Figtree 17px at weight 650, line height 1.1. Lead paragraphs.
- **label-lg:** Figtree 17px at weight 400, line height 1.6. Large buttons and tabs.
- **label-md:** Figtree 16px at weight 620, line height 1.6. Buttons, navigation and labels.
- **label-sm:** Figtree 14px at weight 600, line height 1.43. Small labels and badges.

## Layout

Spacing does not follow a strict grid: 16% of measured values are multiples of 4px, so match the measured steps rather than rounding to a grid.

- **Scale:** xs 2.4px, sm 5.6px, md 9.6px, lg 25.6px, xl 56px.
- **Sections:** 81px vertical padding between major sections.
- **Gaps:** 9.6px is the most common gap in flex and grid layouts.
- **Container:** content is capped at 1760px.
- **Page margin:** 56px on each side of full-width sections.
- **Breakpoints:** 639px, 640px, 767px, 768px, 900px, 1023px, 1024px, 1280px.

## Elevation & Depth

Raised elements use soft drop shadows. The most used recipes:

- `rgba(42, 23, 14, 0.2) 2px 3px 0px 0px`
- `rgb(42, 23, 14) 0px 8px 0px -2.4px`
- `rgba(42, 23, 14, 0.25) 0px 7px 0px -3px`

Hairline rings and inset highlights also appear: `rgb(255, 253, 248) 0px 0px 0px 4px inset`.

## Shapes

Interactive controls are pill-shaped. Measured radii, most used first:

- **full (9999px):** 232 elements.
- **md (16px):** 64 elements.

## Components

Measured from the rendered page. Token values reference the tokens above.

- **button-primary (“View available puppies”):** #A24A1A fill, #FFFDF8 text, 17px/650, 999px radius, padding 13.6px 25.6px, shadow `rgb(42, 23, 14) 0px 8px 0px -2.4px`.
- **button-secondary (“WhatsApp us”):** #1F7A4D fill, #FFFFFF text, 15.2px/650, 999px radius, padding 9.6px 21.6px, shadow `rgb(42, 23, 14) 0px 8px 0px -2.4px`.
- **button-tertiary (“Skip to content”):** #2A170E fill, #FFFDF8 text, 17px/600, 3.35544e+07px radius, padding 12px 20px.
- **button-ghost (“Enquire on WhatsApp”):** transparent fill, #2A170E text, 17px/650, 999px radius, padding 13.6px 25.6px, border 2px solid #2A170E.
- **link:** transparent fill, #2A170E text, padding 0px.

## Do's and Don'ts

- Do use #FFFDF8 for the page and lift surfaces in small steps: #FFFDF8EB.
- Do keep text in 2 levels: #2A170E, #5A3A28.
- Do use #FBE3B4 as the brand accent: header, logo and key highlights.
- Do set headlines in Fraunces with tight tracking (-0.025em).
- Do reuse the measured spacing steps (5.6px, 9.6px, 25.6px).
- Do make buttons and chips fully rounded (9999px); most other elements use 16px corners.
- Don't introduce new font families beyond Fraunces and Figtree.
- Don't use #FBE3B4 for large backgrounds or body text.
- Don't make interface transitions slower than 0.6s.

## Motion

Interface transitions are quick: 0.35s, 0.25s, 0.6s, 0.45s. Longer ambient animations run 3.2s, 1.05s, 0.75s.

- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)`, `ease`, `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Reduced motion:** the page responds to `prefers-reduced-motion`.

Generated by [Sitepeel](https://sitepeel.dev/design-md/puppy.instabizweb.com/), the free DESIGN.md generator (engine 2026.10.29+bf9d681d83cf).
