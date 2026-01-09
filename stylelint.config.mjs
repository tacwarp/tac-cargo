const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    // Prevent duplicate properties
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: ["consecutive-duplicates-with-different-values"],
      },
    ],

    // Prevent duplicate custom properties
    "declaration-block-no-duplicate-custom-properties": true,

    // Enforce custom property naming convention (kebab-case)
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected custom property name to be kebab-case",
      },
    ],

    // Disallow unknown at-rules (but allow Tailwind v4 directives)
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "config",
          "theme",
          "custom-variant",
          "plugin",
        ],
      },
    ],

    // Enforce consistent units
    "unit-allowed-list": [
      "%",
      "deg",
      "px",
      "rem",
      "em",
      "s",
      "ms",
      "vh",
      "vw",
      "fr",
    ],

    // Enforce oklch color notation consistency
    "function-disallowed-list": ["rgb", "rgba", "hsl", "hsla"],

    // Allow both number and percentage notation for lightness (project uses both)
    "lightness-notation": null,

    // Allow both number and percentage notation for alpha values
    "alpha-value-notation": null,

    // Allow both number and angle notation for hue
    "hue-degree-notation": null,

    // Prevent empty blocks
    "block-no-empty": true,

    // Prevent invalid hex colors
    "color-no-invalid-hex": true,

    // Enforce lowercase for consistency
    "value-keyword-case": [
      "lower",
      {
        ignoreProperties: ["font-family"],
      },
    ],

    // Limit nesting depth
    "max-nesting-depth": [
      4,
      {
        ignore: ["blockless-at-rules", "pseudo-classes"],
      },
    ],

    // Allow vendor prefixes for properties that require them (e.g., -webkit-background-clip, -webkit-mask)
    "property-no-vendor-prefix": [
      true,
      {
        ignoreProperties: [
          "background-clip",
          "text-fill-color",
          "mask",
          "mask-composite",
        ],
      },
    ],
    "value-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "at-rule-no-vendor-prefix": true,
  },
  ignoreFiles: ["node_modules/**", ".next/**", "dist/**", "build/**"],
};

export default config;
