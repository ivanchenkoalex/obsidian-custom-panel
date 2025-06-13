# Custom Panel Plugin for Obsidian

A powerful Obsidian plugin that allows you to create beautiful, customizable collapsible panels with configurable borders, colors, backgrounds, and icons. Perfect for organizing information, creating callouts, and enhancing your note-taking experience.

## Features

- 🎨 **Fully Customizable**: Configure colors, borders, backgrounds, and more
- 🔄 **Collapsible Panels**: Show/hide content with smooth animations
- 🎯 **Icon Support**: Add emojis or custom icons to your panels
- 📝 **Markdown Support**: Full markdown rendering inside panels
- ⚙️ **Global Settings**: Set default values for all panels
- 🎭 **Multiple Syntax Support**: Works with standard code blocks and custom syntax

## Installation

### Manual Installation

1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder named `custom-panel` in your `.obsidian/plugins/` directory
3. Place the downloaded files in the `custom-panel` folder
4. Reload Obsidian and enable the plugin in Settings > Community Plugins

## Usage

### Basic Syntax

Create a panel using a code block with the `cpanel` language:

````markdown
```cpanel
title: My Panel Title
icon: 📚
---
Your content goes here. You can use **markdown** formatting!

- Lists work too
- Another item

> Blockquotes are supported as well
```
````

### Configuration Options

All configuration options are optional and will fall back to your global settings:

| Option | Description | Example |
|--------|-------------|---------|
| `title` | Panel title | `title: Important Notes` |
| `icon` | Icon (emoji or symbol) | `icon: 🔥` or `icon: ⚠️` |
| `bordercolor` | Border color | `bordercolor: #ff6b6b` |
| `borderwidth` | Border thickness | `borderwidth: 2px` |
| `borderradius` | Corner rounding | `borderradius: 12px` |
| `background` | Panel background | `background: #f8f9fa` |
| `headerbackground` | Header background | `headerbackground: linear-gradient(45deg, #ff6b6b, #ffa500)` |
| `headertextcolor` | Header text color | `headertextcolor: #ffffff` |
| `headerheight` | Header height | `headerheight: 60px` |
| `collapsible` | Enable collapse | `collapsible: true` |
| `collapsed` | Start collapsed | `collapsed: false` |

### Examples

#### Simple Info Panel

````markdown
```cpanel
title: Quick Tip
icon: 💡
---
This is a simple information panel with an icon and custom styling.
```
````

#### Warning Panel

````markdown
```cpanel
title: Important Warning
icon: ⚠️
bordercolor: #ff6b6b
borderwidth: 2px
headerbackground: #ff6b6b
headertextcolor: white
---
**Attention!** This is a warning panel with custom colors.

Make sure to read this carefully before proceeding.
```
````

#### Code Example Panel

````markdown
```cpanel
title: JavaScript Example
icon: 🔧
background: #f8f9fa
bordercolor: #007acc
collapsed: true
---
Here's a code example:

```javascript
function greetUser(name) {
    console.log(`Hello, ${name}!`);
}
```

This function will greet the user by name.
```
````

#### Study Notes Panel

````markdown
```cpanel
title: Chapter 5: Data Structures
icon: 📖
headerbackground: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
headertextcolor: white
borderradius: 15px
---
## Key Concepts

- **Arrays**: Ordered collections of elements
- **Objects**: Key-value pairs for structured data
- **Sets**: Collections of unique values

### Important Notes
Remember that arrays are zero-indexed in most programming languages.
```
````

#### Collapsible Task List

````markdown
```cpanel
title: Today's Tasks
icon: ✅
collapsible: true
collapsed: false
bordercolor: #28a745
---
- [x] Complete project documentation
- [ ] Review pull requests
- [ ] Attend team meeting at 3 PM
- [ ] Update task board

**Priority:** High
**Due:** End of day
```
````

#### Image Gallery Panel

````markdown
```cpanel
title: Project Screenshots
icon: 🖼️
background: #000
headerbackground: #333
headertextcolor: #fff
---
![Screenshot 1](screenshot1.png)

*Dashboard overview showing the main interface*

![Screenshot 2](screenshot2.png)

*Settings panel with configuration options*
```
````

## Global Settings

Access plugin settings through Settings > Community Plugins > Custom Panel to configure:

- **Default Border Color**: Set the default border color for all panels
- **Default Border Width**: Configure default border thickness
- **Default Border Radius**: Set default corner rounding
- **Default Panel Background**: Choose default panel background
- **Default Header Background**: Set default header background
- **Default Header Text Color**: Configure default header text color
- **Default Header Height**: Set default header height
- **Default Collapsible**: Make panels collapsible by default
- **Default Collapsed State**: Start panels collapsed by default

## Advanced Customization

### Custom CSS

You can create a `styles.css` file in your plugin folder to override default styles:

```css
.cpanel-container {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cpanel-header {
    font-family: 'Your Custom Font';
}

.cpanel-content {
    line-height: 1.6;
}
```

### Gradient Backgrounds

Use CSS gradients for beautiful header backgrounds:

```markdown
headerbackground: linear-gradient(45deg, #ff6b6b, #ffa500)
headerbackground: radial-gradient(circle, #667eea, #764ba2)
```

### Background Images

You can also use background images:

```markdown
background: url('path/to/image.jpg') center/cover
headerbackground: url('path/to/header-bg.png') repeat-x
```

## Tips and Best Practices

1. **Use Icons Wisely**: Icons help categorize and quickly identify panel types
2. **Consistent Color Scheme**: Use your vault's color theme for better integration
3. **Meaningful Titles**: Clear, descriptive titles improve readability
4. **Collapsible for Long Content**: Use collapsible panels for lengthy information
5. **Test Mobile**: Ensure your panels work well on mobile devices

## Troubleshooting

### Panel Not Rendering
- Check that the code block language is exactly `cpanel`
- Ensure the `---` separator is on its own line
- Verify that configuration syntax is correct (`key: value`)

### Styling Issues
- Check CSS syntax in configuration options
- Use browser developer tools to inspect styles
- Verify color values are valid CSS colors

### Content Not Showing
- Ensure content is placed after the `---` separator
- Check for markdown syntax errors
- Verify file paths for images are correct

## Contributing

Found a bug or have a feature request? Please open an issue on the GitHub repository.

## License

This plugin is released under the MIT License.

---

**Made with ❤️ for the Obsidian community**
