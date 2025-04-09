# Echo.ai UI Design System

This document outlines the premium UI design system implemented for Echo.ai.

## Design Principles

- **Premium Feel**: Clean, sophisticated design with subtle gradients, soft shadows, and glass morphism
- **Accessibility**: High contrast ratios, clear typography, and intuitive interactions
- **Responsiveness**: Fluid layouts that work across all device sizes
- **Consistency**: Unified visual language throughout the application

## Color System

### Primary Brand Colors
- Primary: Brand blue (`brand-500`: `#0ea5e9`)
- Primary gradient: Brand blue to indigo (`from-brand-600 to-blue-600`)

### Neutral Colors
- Dark text: `gray-900` (light mode), `white` (dark mode)
- Light backgrounds: `white` (light mode), `gray-900` (dark mode)
- Muted text: `gray-600` (light mode), `gray-300` (dark mode)

## Typography

- **Display**: Playfair Display (headings, large text)
- **Body**: Inter (UI text, paragraphs)
- **Monospace**: System monospace fonts (code snippets)

### Type Scale
- Display (h1): 4xl/5xl/6xl/7xl with tracking-tight
- h2: 3xl/4xl/5xl with tracking-tight
- h3: 2xl/3xl
- Body: text-base/lg/xl

## Components

### Glass Elements
Use the `glass-panel` and `glass-card` utility classes for glass morphism effects:
```html
<div class="glass-panel">...</div>
<div class="glass-card">...</div>
```

### Text Gradients
Use the `text-gradient` utility for animated gradient text:
```html
<span class="text-gradient">Premium Text</span>
```

### Buttons
Multiple premium variants available:
- `brand` - Primary brand-colored button
- `brand-outline` - Outlined version
- `brand-ghost` - Ghost version
- `glass` - Glass morphism button

### Cards
Enhanced card variants:
- `default` - Standard card
- `glass` - Glass morphism card
- `outline` - Outlined card
- `ghost` - No background card

## Effects & Animations

### Shadows
- `shadow-soft` - Soft, premium shadow
- `shadow-glow` - Glowing effect
- `shadow-inner-glow` - Inner glowing effect

### Animations
- `animate-pulse-soft` - Gentle pulsing
- `animate-float` - Floating motion
- `animate-gradient-shift` - Gradient movement

### Backgrounds
- `bg-grid` - Grid pattern with mask
- `bg-gradient-radial` - Radial gradient
- `bg-gradient-noise` - Texture overlay

## Usage Tips

1. Use glass morphism for floating elements and cards
2. Apply gradient text for section headings
3. Combine soft shadows with rounded corners
4. Utilize animated elements sparingly for emphasis
5. Maintain ample white space between elements

## Implementation

The design system is implemented using:
- Tailwind CSS for styling
- Framer Motion for animations
- Radix UI for accessible components
- Lucide icons for consistent iconography 