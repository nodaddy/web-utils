# Nexonware Markdown Editor

A powerful, feature-rich markdown editor with live preview, syntax highlighting, and export options.

## Features

- **Live Preview**: See your markdown rendered in real-time as you type
- **Syntax Highlighting**: Code blocks are automatically highlighted
- **Multiple View Modes**: Split view, editor-only, or preview-only
- **Export Options**: Export your markdown as HTML, PDF, or Markdown files
- **Formatting Toolbar**: Quick access to common markdown formatting options
- **Theme Support**: Light and dark themes for comfortable editing
- **Adjustable Font Size**: Small, medium, and large font options
- **Fullscreen Mode**: Distraction-free editing
- **Auto-Save**: Your content is automatically saved to localStorage
- **Character Count**: Track character, word, and line counts

## Usage

### Basic Markdown Syntax

- **Bold Text**: Wrap text with double asterisks: `**bold text**`
- **Italic Text**: Wrap text with single asterisks: `*italic text*`
- **Headings**: Use hash symbols: `# Heading 1`, `## Heading 2`, etc.
- **Links**: `[Link text](URL)`
- **Images**: `![Alt text](image URL)`
- **Lists**: Start lines with `-` or `1.`
- **Code**: Wrap inline code with backticks: `` `code` ``
- **Code Blocks**: Wrap blocks with triple backticks:
  ```
  ```javascript
  // Your code here
  ```
  ```
- **Blockquotes**: Start lines with `>`
- **Horizontal Rules**: Use three hyphens: `---`
- **Tables**:
  ```
  | Header 1 | Header 2 |
  | -------- | -------- |
  | Cell 1   | Cell 2   |
  ```

### Toolbar Functions

- **View Mode**: Toggle between split, editor-only, and preview-only views
- **Text Formatting**: Bold, italic, headings, lists, blockquotes, code
- **Insert Elements**: Links, images, tables, horizontal rules
- **Export**: Save your content as HTML, PDF, or Markdown
- **Settings**: Change theme and font size
- **Fullscreen**: Toggle fullscreen mode for distraction-free editing

## Implementation Details

The Markdown Editor is built using:

- React for the UI components
- markdown-it for parsing and rendering markdown
- highlight.js for syntax highlighting
- jsPDF for PDF export
- Tailwind CSS with typography plugin for styling

## Future Enhancements

- Collaborative editing
- Custom themes
- More export formats
- Table of contents generation
- Spell checking
- Image uploads
- Markdown templates 