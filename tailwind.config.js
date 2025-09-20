const { tokens } = require('./lib/design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Wedding Color Palette (mapped from design tokens)
      colors: {
        // Primary colors
        ink: tokens.colors.neutral.ink,
        autumnGreen: tokens.colors.primary.autumnGreen,
        burntOrange: tokens.colors.primary.burntOrange,
        warmSand: tokens.colors.neutral.warmSand,
        cream: tokens.colors.neutral.cream,
        slate: tokens.colors.neutral.slate,
        goldAccent: tokens.colors.primary.goldAccent,

        // Semantic colors
        success: tokens.colors.semantic.success,
        warning: tokens.colors.semantic.warning,
        error: tokens.colors.semantic.error,
        info: tokens.colors.semantic.info,

        // Interactive states
        hover: tokens.colors.interactive.hover,
        focus: tokens.colors.interactive.focus,
        active: tokens.colors.interactive.active,
        disabled: tokens.colors.interactive.disabled,
      },

      // Typography (mapped from design tokens)
      fontFamily: {
        display: tokens.typography.fontFamily.display,
        body: tokens.typography.fontFamily.body,
      },
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,

      // Spacing (mapped from design tokens)
      spacing: tokens.spacing.scale,

      // Border radius (mapped from design tokens)
      borderRadius: {
        sm: tokens.borders.radius.sm,
        DEFAULT: tokens.borders.radius.base,
        lg: tokens.borders.radius.lg,
        xl: tokens.borders.radius.xl,
        full: tokens.borders.radius.full,
      },

      // Container sizes (including custom wedding wrap)
      maxWidth: {
        ...tokens.spacing.container,
        wrap: tokens.spacing.container.wrap, // Custom wedding site container
      },

      // Shadows (mapped from design tokens)
      boxShadow: tokens.shadows,

      // Touch targets for accessibility
      minHeight: {
        'touch-sm': tokens.interactive.touchTarget.minimum,
        'touch-md': tokens.interactive.touchTarget.comfortable,
        'touch-lg': tokens.interactive.touchTarget.large,
      },
      minWidth: {
        'touch-sm': tokens.interactive.touchTarget.minimum,
        'touch-md': tokens.interactive.touchTarget.comfortable,
        'touch-lg': tokens.interactive.touchTarget.large,
      },

      // Animation and transitions
      transitionDuration: {
        fast: tokens.interactive.transition.duration.fast,
        normal: tokens.interactive.transition.duration.normal,
        slow: tokens.interactive.transition.duration.slow,
      },

      // Transform scales for interactions
      scale: {
        press: tokens.interactive.scale.press,
        'button-press': tokens.interactive.scale.buttonPress,
        subtle: tokens.interactive.scale.subtle,
      },

      // Breakpoints (explicitly defined for consistency)
      screens: tokens.breakpoints,
    },
  },
  corePlugins: { preflight: true },
  plugins: [],
};
