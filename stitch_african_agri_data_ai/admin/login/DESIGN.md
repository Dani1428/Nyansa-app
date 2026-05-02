---
colors:
  surface: '#f7faf7'
  surface-dim: '#d7dbd7'
  surface-bright: '#f7faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f1'
  surface-container: '#ebefeb'
  surface-container-high: '#e5e9e5'
  surface-container-highest: '#e0e3e0'
  on-surface: '#181d1b'
  on-surface-variant: '#3e4945'
  inverse-surface: '#2d312f'
  inverse-on-surface: '#eef2ee'
  outline: '#6e7a74'
  outline-variant: '#bec9c3'
  surface-tint: '#016b55'
  primary: '#00604c'
  on-primary: '#ffffff'
  primary-container: '#1f7a63'
  on-primary-container: '#b1ffe4'
  inverse-primary: '#82d6bb'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#854036'
  on-tertiary: '#ffffff'
  tertiary-container: '#a3574c'
  on-tertiary-container: '#ffebe8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef3d7'
  primary-fixed-dim: '#82d6bb'
  on-primary-fixed: '#002018'
  on-primary-fixed-variant: '#005140'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#3c0804'
  on-tertiary-fixed-variant: '#74332a'
  background: '#f7faf7'
  on-background: '#181d1b'
  surface-variant: '#e0e3e0'
typography:
  h1:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Poppins
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

## Brand & Style
The design system bridges the gap between raw agricultural vitality and the precision of linguistic data science. The aesthetic is rooted in **Corporate Modernism**, prioritizing clarity and trust to serve a target audience of agronomists, data scientists, and global policymakers. 

The brand personality is authoritative yet growth-oriented. Visuals should leverage high-quality imagery of crops and soil, contrasted with sharp, mathematical data visualizations (heatmaps, nodes, and linguistic trees). The interface uses generous whitespace and a restricted color palette to ensure that complex data remains the primary focus.

## Colors
The palette is anchored by **Primary Green (#1F7A63)**, providing a sense of stability and environmental expertise. **Light Green (#2ECC71)** is used for success states and growth indicators, while **Accent Orange (#F39C12)** provides a high-contrast functional color for call-to-actions and critical data alerts.

The interface utilizes **Light Gray (#F5F5F5)** for expansive backgrounds to reduce eye strain, while **Deep Black (#0F172A)** ensures high-contrast legibility for all typography and iconography. This "Nature-Tech" spectrum creates a professional atmosphere that feels both grounded and innovative.

## Typography
This design system employs a dual-font strategy. **Poppins** is utilized for headlines to provide a clean, geometric, and modern tech feel. **Inter** is the workhorse for all body text, data tables, and interface labels, chosen for its exceptional legibility in data-heavy environments.

Scale is used to establish clear hierarchy. Use H1 and H2 for page titles and section headers. Body text should default to 16px (body-md) for optimal readability. Labels should be used for metadata and small UI elements, often paired with the uppercase transformation to differentiate from narrative text.

## Layout & Spacing
The layout follows a strict **12-column fixed grid** with a maximum width of 1200px to ensure data density remains manageable on wide-screen monitors. 

A vertical rhythm is maintained using an 8px base unit. Component internal padding should default to 16px (md) or 24px (lg). Section-level vertical spacing should use 80px (xxl) to create distinct visual separation between different data modules or content blocks.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layering**. Surfaces do not use heavy gradients; instead, hierarchy is established by placing white cards against the Light Gray background.

Cards utilize a very soft, diffused shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a "lifted" effect without cluttering the UI with heavy lines. For interactive states like hovering over a data card, the shadow should slightly deepen to `0px 8px 30px rgba(15, 23, 42, 0.08)` to provide tactile feedback.

## Shapes
The shape language is defined by a consistent **12px border radius** for all primary containers, including buttons and cards. This radius is soft enough to feel modern and accessible, but sharp enough to maintain a professional, tech-oriented character.

Nested elements, such as input fields inside a card or small tags, should use a slightly smaller 8px radius to maintain visual harmony (inner radius = outer radius - padding).

## Components

### Buttons
Primary buttons feature a solid **Primary Green (#1F7A63)** background with white text and a 12px radius. Secondary buttons should use a 1px border of Primary Green with a transparent background. All buttons have a height of 48px for standard actions.

### Cards
Cards are the primary container for data. They must have a white background, a 12px border radius, and the standard ambient shadow. A subtle 1px border in a slightly darker gray (`#E5E5E5`) can be used to define boundaries in high-density views.

### Input Fields
Inputs use the Light Gray (#F5F5F5) background with a 12px radius and no shadow. On focus, the border transitions to Primary Green to signal active engagement.

### Chips & Tags
Used for linguistic categories or crop types. These should be pill-shaped with a light tint of the Primary Green or Accent Orange at 10% opacity, with the text in the full-saturation version of the color.

### Data Visualizations
Charts should utilize the Primary Green, Light Green, and Accent Orange for data series. Use Deep Black for axes and grid lines at 10% opacity to ensure the data remains the focal point.