import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        /* === Raw palette (CSS vars) === */
        seashell: { value: "var(--palette-seashell)" },
        woodsmoke: { value: "var(--palette-woodsmoke)" },
        orchid: { value: "var(--palette-neon-orchid)" },
        mauve: { value: "var(--palette-opera-mauve)" },
        lavender: { value: "var(--palette-lavender-pulse)" },
        twilight: { value: "var(--palette-twilight-indigo)" },
        lapis: { value: "var(--palette-lapis-night)" },

        /* === Brand scale mapped onto your palette === */
        brand: {
          50: { value: "var(--palette-seashell)" },
          100: { value: "var(--palette-seashell)" },
          200: { value: "var(--palette-neon-orchid)" },
          300: { value: "var(--palette-opera-mauve)" },
          400: { value: "var(--palette-lavender-pulse)" },
          500: { value: "var(--palette-twilight-indigo)" },
          600: { value: "var(--palette-lapis-night)" },
          700: { value: "var(--palette-lapis-night)" },
          800: { value: "var(--palette-woodsmoke)" },
          900: { value: "var(--palette-woodsmoke)" },
          950: { value: "var(--palette-woodsmoke)" },
        },

        /* === Status === */
        success: { value: "#22c55e" },
        warning: { value: "#f59e0b" },
        error: { value: "#ef4444" },
      },

      fonts: {
        body: { value: "var(--font-sans)" },
        heading: { value: "var(--font-sans)" },
      },
    },

    /* === Semantic, app-facing roles === */
    semanticTokens: {
      colors: {
        /* Core surfaces & text */
        bg: { value: "var(--color-bg)" }, // page background
        surface: { value: "{colors.orchid}" }, // cards/surfaces
        text: { value: "var(--color-text)" }, // long-form text
        fg: { value: "var(--color-fg)" }, // UI foreground

        "bg.muted": { value: "var(--color-bg-muted)" },
        "fg.muted": { value: "var(--color-fg-muted)" },
        border: { value: "var(--color-border)" },

        /* Brand roles (complete set) */
        brand: {
          solid: { value: "var(--color-accent)" }, //
          contrast: { value: "var(--color-accent-contrast)" }, //
          fg: { value: "" }, //
          muted: { value: "" }, //
          subtle: { value: "" }, //
          emphasized: { value: "var(--color-accent-alt)" }, //
          focusRing: { value: "var(--color-accent)" }, //
        },

        /* Lock generic recipe aliases to your brand */
        "colorPalette.fg": { value: "{colors.brand.700}" },
        "colorPalette.solid": { value: "{colors.brand.500}" },
        "colorPalette.contrast": { value: "{colors.seashell}" },
        "colorPalette.subtle": { value: "{colors.brand.200}" },

        /* Status roles */
        success: {
          solid: { value: "{colors.success}" },
          contrast: { value: "white" },
        },
        warning: {
          solid: { value: "{colors.warning}" },
          contrast: { value: "black" },
        },
        error: {
          solid: { value: "{colors.error}" },
          contrast: { value: "white" },
        },
      },
    },
  },

  components: {
    Button: {
      defaultProps: {
        colorPalette: "brand",
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
