# Dev Cheatsheet

A VS Code extension to store and display developer cheat-sheets like regex patterns, git commands, code snippets, terminal tricks, and more.

## Features

- **📚 Built-in Cheatsheets**: Comes with a curated collection of 100+ useful cheat-sheets for Regex, Git, JavaScript, SQL, Docker, Linux, and more
- **🔍 Search & Filter**: Quickly find cheat-sheets by title, tags, category, or subcategory
- **📤 Export**: Export the default cheatsheets to your current folder for editing
- **📥 Import**: Import your own cheatsheets from external JSON files
- **🎨 Clean UI**: Modern, dual-pane interface with sidebar navigation that respects your VS Code theme
- **📂 Organized Hierarchy**: Cheat-sheets are grouped by category and subcategory for easy navigation
- **🌲 Tree View Navigation**: Sidebar displays an interactive tree view of all cheatsheets
- **🔽 Collapse/Expand**: Toggle visibility of categories and subcategories (collapsed by default)
- **🎯 Quick Navigation**: Click on any item in the sidebar to scroll directly to it in the main content
- **📋 Copy to Clipboard**: One-click copy button for each code snippet

## Usage

### Opening the Cheatsheets Viewer

1. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
2. Type and select: `Dev Cheatsheet: Open`
3. Browse, search, and copy the cheat-sheets you need!

### Exporting Cheatsheets

1. Open the Command Palette
2. Type and select: `Dev Cheatsheet: Export to Current Folder`
3. The default cheatsheets will be copied to your current workspace folder as `cheats.json`

### Importing Cheatsheets

1. Open the Command Palette
2. Type and select: `Dev Cheatsheet: Import from File`
3. Select a JSON file containing your cheatsheets
4. The imported cheatsheets will be merged with the default ones and displayed in the viewer

## Extension Settings

This extension contributes the following settings:

* `dev-cheatsheet.importedFilePath`: Path to an external JSON file with additional cheatsheets (set automatically via the Import command)

### Creating Custom Cheatsheets

You can create your own cheatsheets by creating a JSON file with an array of cheatsheet objects.

**Each cheatsheet object should have:**
- `title` (string): The title of the cheat-sheet
- `description` (string): A brief description
- `code` (string): The code snippet or command
- `category` (string): Category name (e.g., "Git", "JavaScript", "Terminal")
- `subcategory` (string, optional): Subcategory name (defaults to "Other" if not provided)
- `tags` (array): Array of searchable tags

**Option 1: Start from default cheatsheets**
1. Run `Dev Cheatsheet: Export to Current Folder`
2. Edit the exported `cheats.json` file
3. Run `Dev Cheatsheet: Import from File` and select your edited file

**Option 2: Create from scratch**
Create a JSON file (e.g., `my-cheats.json`):
```json
[
  {
    "title": "My Custom Regex",
    "description": "A helpful regex pattern",
    "code": "^[a-z]+$",
    "category": "Regex",
    "subcategory": "Custom",
    "tags": ["regex", "custom"]
  },
  {
    "title": "My Docker Command",
    "description": "Custom docker setup",
    "code": "docker-compose up -d",
    "category": "Docker",
    "subcategory": "Compose",
    "tags": ["docker", "compose"]
  }
]
```

Then import the file using `Dev Cheatsheet: Import from File`.

The imported cheatsheets are automatically merged with the default ones and will persist across VS Code sessions.

**Enjoy!**
