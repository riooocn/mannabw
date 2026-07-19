---
name: Manna Blessingwear
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Anton
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 32px
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0rem
  DEFAULT: 0rem
  md: 0rem
  lg: 0rem
  xl: 0.125rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

This design system embodies a high-contrast, editorial approach for **Manna Blessingwear (mannabw)**. It is built on a foundation of **Bold Minimalism** and **High-Contrast** aesthetics, drawing inspiration from high-fashion lookbooks and brutalist architecture. The visual language is intentional, raw, and authoritative, aligning perfectly with the sharp, dynamic cuts of the mannabw logo.

The target audience consists of urban trendsetters who value clarity, exclusivity, and a "less is more" philosophy. By stripping away color, the UI relies on heavy typography, structural grid lines, and absolute black-and-white values to evoke a sense of permanence and prestige.

## Colors

The palette is strictly monochromatic to maintain a premium, editorial feel. 

- **Primary:** Pure Black (#000000) is used for all primary actions, typography, and structural borders.
- **Surface:** Clean White (#FFFFFF) serves as the primary canvas, ensuring maximum contrast and legibility.
- **Accents:** Mid-tone grays are reserved for secondary information, disabled states, and subtle depth indicators.
- **Functional:** Success, error, and warning states should avoid traditional colors where possible, utilizing iconography and bold black fills or patterns to indicate status.

## Typography

The typography system relies on the tension between the aggressive, condensed nature of **Anton** and the neutral, systematic clarity of **Inter**.

- **Headlines:** Always use Anton in uppercase. Tight tracking and leading are encouraged to create a "wall of text" effect for hero sections.
- **Body:** Inter provides a functional counterpoint. Use Medium (500) weight for primary body copy to maintain visual weight against the heavy headlines.
- **Utility:** Use uppercase labels with generous letter-spacing for navigation and metadata to create a structured, architectural feel.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy that mimics printed magazine layouts. 

- **Grid:** A 12-column grid on desktop with 1px black dividers instead of standard gutters to emphasize the "Streetwear" structural vibe.
- **Rhythm:** Spacing follows a strict 8px baseline power-of-two scale.
- **Negative Space:** Use aggressive margins (64px+) on desktop to isolate products and text, creating an aura of luxury and exclusivity.
- **Mobile:** Transition to a 4-column grid with reduced margins, but maintain the use of horizontal and vertical 1px lines to separate sections.

## Elevation & Depth

This system rejects shadows in favor of **Structural Layering** and **Bold Outlines**.

- **Planes:** Depth is communicated by stacking pure white surfaces on top of light gray backgrounds, or vice versa, using 1px or 2px solid black borders.
- **Interactivity:** Elements do not "lift" off the page; instead, they "invert." On hover, a white button with a black border should flip to a solid black fill with white text.
- **Hard Edges:** Avoid blurs and soft transitions. Every element should have a clearly defined boundary.

## Shapes

The shape language is strictly **Rectilinear** to perfectly align with the sharp, dynamic diagonal cuts of the Mannabw 'M' logo.

- **Corner Radius:** Elements like buttons, cards, and input fields use **0px (zero corner radius)**. This maintains a sharp, authoritative, and sophisticated architectural silhouette, rejecting any "soft" or friendly aesthetics.
- **Imagery:** Product photography must remain sharp-edged (0px radius) to contrast with the minimal UI elements, framing the fashion items as pieces of art.

## Components

- **Buttons:** Primary buttons are solid black with white uppercase Anton text. They use a **0px (rectilinear)** corner radius. Secondary buttons are white with a 2px black stroke.
- **Inputs:** Text fields use a 1px black bottom-border only (minimalist style) or a full 1px border. Focus states result in a weight increase to 2px. All inputs have sharp corners (0px).
- **Cards:** Product cards use a thin 1px #000000 border. Information is tucked inside the border with minimal padding to maximize image size.
- **Chips/Tags:** Small tags for "New Arrival" or "Sold Out" status use a minimal 2px corner radius or sharp corners, moving away from large pill shapes to keep with the sharp visual language.
- **Navigation:** Top-tier navigation uses high-contrast labels. Active links are indicated by a thick 4px black underline.
- **Lists:** Separated by 1px solid black lines extending to the edges of the container, mimicking a ledger or technical spec sheet.
