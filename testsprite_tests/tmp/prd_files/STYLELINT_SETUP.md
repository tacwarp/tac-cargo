# Stylelint Setup for TAC Cargo

## Overview

Stylelint has been configured to maintain CSS quality and consistency across the project, particularly for the custom design system in `app/globals.css`.

## Why Stylelint?

After the CodeRabbit review, we identified several CSS issues:

- Duplicate custom properties (`--elevation-*`)
- Self-referential CSS variables (`--tracking-normal`)
- Potential for inconsistent naming conventions

Stylelint prevents these issues from recurring and enforces design system consistency.

## Installation

```bash
npm install
```

Dependencies added:

- `stylelint@^16.12.0`
- `stylelint-config-standard@^36.0.1`

## Usage

### Lint CSS files

```bash
npm run lint:css
```

### Auto-fix CSS issues

```bash
npm run lint:css:fix
```

### Run all linters

```bash
npm run lint        # JavaScript/TypeScript
npm run lint:css    # CSS
```

## Configuration

### `stylelint.config.mjs`

Key rules configured:

- **Duplicate prevention**: No duplicate properties or custom properties
- **Naming convention**: Kebab-case for custom properties (e.g., `--primary-color`)
- **Tailwind v4 support**: Allows `@layer`, `@theme`, `@custom-variant` directives
- **Unit restrictions**: Only allows specific units (`px`, `rem`, `em`, `%`, `deg`, `s`, `ms`, `vh`, `vw`, `fr`)
- **Color notation**: Enforces `oklch()` notation (disallows `rgb`, `rgba`, `hsl`, `hsla`)
- **Vendor prefixes**: Disallowed (autoprefixer handles this)
- **Max nesting depth**: Limited to 4 levels

### `.stylelintignore`

Ignored directories:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `coverage/`
- `public/remixIcon_fonts/`

## Design System Enforcement

The configuration enforces consistency across 100+ CSS custom properties:

### Color System

- All colors use `oklch()` notation
- Custom properties follow kebab-case: `--primary`, `--primary-hover`, `--primary-foreground`

### Typography

- Font sizes: `--font-size-hero`, `--font-size-kpi`, `--font-size-body`
- Tracking: `--tracking-normal`, `--tracking-wide`, `--tracking-tight`

### Shadows & Elevation

- Shadow system: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`
- Elevation tokens: `--elevation-1`, `--elevation-2`, `--elevation-3`

### Spacing

- Bento grid: `--bento-gap`, `--bento-radius`
- Border radius: `--radius`

## Integration with CI/CD

Add to your CI pipeline:

```yaml
- name: Lint CSS
  run: npm run lint:css
```

## VS Code Integration

Install the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) for real-time linting in the editor.

Add to `.vscode/settings.json`:

```json
{
  "stylelint.validate": ["css"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
}
```

## Common Issues

### Issue: "Unknown at-rule @layer"

**Solution**: Already configured to ignore Tailwind v4 directives.

### Issue: "Expected custom property to be kebab-case"

**Solution**: Rename custom properties to use kebab-case:

```css
/* ❌ Bad */
--primaryColor: red;
--Primary_Color: red;

/* ✅ Good */
--primary-color: red;
```

### Issue: "Unexpected function rgb"

**Solution**: Use `oklch()` notation instead:

```css
/* ❌ Bad */
color: rgb(255, 0, 0);

/* ✅ Good */
color: oklch(0.63 0.22 25);
```

## Benefits

1. **Prevents regressions**: Catches duplicate properties and invalid values
2. **Enforces consistency**: Maintains design system naming conventions
3. **Autofix capability**: Automatically fixes many issues with `--fix` flag
4. **Performance**: Uses `--cache` flag for faster subsequent runs
5. **CI/CD ready**: Easy integration into build pipelines

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run lint:css` to check current CSS
3. Run `npm run lint:css:fix` to auto-fix issues
4. Install VS Code extension for real-time feedback
5. Add to pre-commit hooks (optional)
