/**
 * Design Tokens for Caroline & Zach's Wedding Website
 *
 * Centralized design system defining colors, typography, spacing, and interactive states.
 * These tokens ensure visual consistency and maintainability across all components.
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Primary Wedding Palette
  primary: {
    autumnGreen: '#2e4b3f',
    burntOrange: '#b5562b',
    goldAccent: '#c8a36a',
  },

  // Watercolor Blue Palette
  blue: {
    watercolor: '#52647e', // Main watercolor blue
    watercolorLight: '#6b7a8a', // Lighter watercolor blue
    watercolorDark: '#3d4a5c', // Darker watercolor blue
    watercolorWash: '#7a8a9a', // Washed out watercolor effect
  },

  // Neutral Palette
  neutral: {
    ink: '#1e1d1a', // Primary text
    slate: '#5c6a66', // Secondary text
    cream: '#f6f6ee', // Background
    warmSand: '#e9dfd3', // Borders, dividers
  },

  // Semantic Colors
  semantic: {
    success: '#16a34a', // Success states
    warning: '#d97706', // Warning states
    error: '#dc2626', // Error states, validation
    info: '#0284c7', // Info states
  },

  // Interactive States
  interactive: {
    hover: 'rgba(46, 75, 63, 0.1)', // autumnGreen/10
    focus: 'rgba(46, 75, 63, 0.2)', // autumnGreen/20
    active: 'rgba(46, 75, 63, 0.3)', // autumnGreen/30
    disabled: 'rgba(92, 106, 102, 0.5)', // slate/50
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    display: ['Radley', 'serif'],
    body: ['Radley', 'serif'],
    radley: ['Radley', 'serif'],
    sans: ['Radley', 'serif'],
  },

  // Font Sizes (rem values)
  fontSize: {
    xs: '0.875rem', // 14px (was 12px)
    sm: '1rem', // 16px (was 14px)
    base: '1.125rem', // 18px (was 16px)
    lg: '1.25rem', // 20px (was 18px)
    xl: '1.375rem', // 22px (was 20px)
    '2xl': '1.625rem', // 26px (was 24px)
    '3xl': '2rem', // 32px (was 30px)
    '4xl': '2.5rem', // 40px (was 36px)
    '5xl': '3.25rem', // 52px (was 48px)
    '6xl': '4rem', // 64px (was 60px)
    '7xl': '4.75rem', // 76px (was 72px)
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  // Base spacing scale (rem values)
  scale: {
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
    40: '10rem', // 160px
    48: '12rem', // 192px
    64: '16rem', // 256px
  },

  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    wrap: '1200px', // Custom wedding site container
  },
} as const;

// =============================================================================
// BORDER & RADIUS TOKENS
// =============================================================================

export const borders = {
  // Border Radius
  radius: {
    none: '0',
    sm: '8px',
    base: '12px',
    lg: '18px',
    xl: '24px',
    full: '9999px',
  },

  // Border Widths
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
} as const;

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  soft: '0 8px 30px rgba(0,0,0,.08)', // Custom wedding site shadow
  watercolor: '0 4px 20px rgba(82, 100, 126, 0.15)', // Watercolor blue shadow
} as const;

// =============================================================================
// INTERACTIVE TOKENS
// =============================================================================

export const interactive = {
  // Touch Targets (minimum sizes for accessibility)
  touchTarget: {
    minimum: '44px', // WCAG minimum
    comfortable: '48px',
    large: '56px',
  },

  // Focus States
  focus: {
    ring: {
      width: '2px',
      offset: '2px',
      color: colors.primary.autumnGreen,
    },
  },

  // Transitions
  transition: {
    duration: {
      fast: '75ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Transform scales for button presses
  scale: {
    press: '0.95',
    buttonPress: '0.98',
    subtle: '0.99',
  },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// =============================================================================
// COMBINED DESIGN TOKENS EXPORT
// =============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  interactive,
  breakpoints,
} as const;

// Type exports for TypeScript autocomplete
export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type BorderTokens = typeof borders;
export type ShadowTokens = typeof shadows;
export type InteractiveTokens = typeof interactive;
export type BreakpointTokens = typeof breakpoints;
export type DesignTokens = typeof tokens;
