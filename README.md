# Custom Panel

The plugin adds a `cpanel` code block to Obsidian for creating custom panels with a header. A panel can have its own border and background colors, an icon, and can be collapsible.

## Installation
1. Run `npm run build`.
2. Copy the contents of `dist/custom-panel` into `.obsidian/plugins/custom-panel` inside your vault.
3. Enable the plugin in Obsidian settings.

## Usage
Create a `cpanel` code block in your note. First list options in `key: value` form, then add a line with `---` followed by the panel content.

````markdown
```cpanel
title: Example Panel
icon: check-circle
borderColor: #0d6efd
borderWidth: 2px
background: #e9f7fe
collapsible: true
collapsed: false
---
Panel **markdown** content.
```
````

All options are optional and fall back to the plugin defaults.

### Minimal example

````markdown
```cpanel
title: Minimum
---
Panel content.
```
````

The settings tab lets you configure default values for border color and width, border radius, background colors, header height and collapsible behavior.

