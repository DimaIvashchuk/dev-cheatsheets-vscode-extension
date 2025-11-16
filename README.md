# Dev Cheatsheet

A VS Code extension to store and display developer cheat-sheets including regex patterns, git commands, code snippets, terminal tricks, and more.

## Features

- **📚 Built-in Cheatsheets**: Comes with a curated collection of useful cheat-sheets for Regex, Git, JavaScript, and Terminal commands
- **🔍 Search & Filter**: Quickly find cheat-sheets by title, tags, category, or subcategory
- **⚙️ Custom Cheatsheets**: Add your own cheat-sheets via VS Code settings
- **🎨 Clean UI**: Modern, dual-pane interface with sidebar navigation that respects your VS Code theme
- **📂 Organized Hierarchy**: Cheat-sheets are grouped by category and subcategory for easy navigation
- **🌲 Tree View Navigation**: Sidebar displays an interactive tree view of all cheatsheets
- **🔽 Collapse/Expand**: Toggle visibility of categories and subcategories
- **🎯 Quick Navigation**: Click on any item in the sidebar to scroll directly to it in the main content

## Usage

1. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
2. Type and select: `Dev Cheatsheets Open`
3. Browse, search, and copy the cheat-sheets you need!

## Extension Settings

This extension contributes the following settings:

* `dev-cheatsheet.customCheatsheets`: Array of custom cheat-sheets to add to the default collection

### Adding Custom Cheatsheets

Add your own cheat-sheets by editing your VS Code settings (`settings.json`):

```json
{
  "dev-cheatsheet.customCheatsheets": [
    {
      "title": "My Custom Command",
      "description": "Description of what this does",
      "code": "echo 'Hello World'",
      "category": "Custom",
      "subcategory": "Bash",
      "tags": ["custom", "bash", "example"]
    }
  ]
}
```

Each cheatsheet object should have:
- `title` (string): The title of the cheat-sheet
- `description` (string): A brief description
- `code` (string): The code snippet or command
- `category` (string): Category name (e.g., "Git", "JavaScript", "Terminal")
- `subcategory` (string, optional): Subcategory name (defaults to "Other" if not provided)
- `tags` (array): Array of searchable tags

## Development

To run the extension in development mode:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` to open a new VS Code window with the extension loaded
4. Run the command `Dev Cheatsheets Open` from the Command Palette

To compile TypeScript:
```bash
npm run compile
```

To watch for changes:
```bash
npm run watch
```

## File Structure

```
dev-cheatsheets-vscode-extension/
├── data/
│   └── cheats.json          # Default cheat-sheets
├── src/
│   ├── extension.ts         # Main extension logic
│   └── webview.html         # Webview UI
├── package.json             # Extension manifest
└── README.md
```

## Release Notes

### 0.0.1

Initial MVP release with enhanced features:
- Display default cheat-sheets grouped by category and subcategory
- Sidebar navigation with interactive tree view
- Collapse/expand functionality for categories and subcategories
- Click-to-navigate from sidebar to content
- Search and filter functionality (by title, tags, category, and subcategory)
- Support for custom user cheat-sheets via settings
- Clean, theme-aware dual-pane UI
- 15 built-in cheatsheets across multiple categories

---

**Enjoy!**
