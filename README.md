# Web Design Experiment 7: React.js Study Notes Portal

A modern Single-Page Application (SPA) built with React.js that allows college students to organize, view, add, update, search, and delete study notes with local persistence.

## Features
- **Semantic Project Layout**: Responsive top navigation bar, header banner, sidebar controls, responsive notes grid, and footer.
- **Full CRUD State Management**:
  - **Create**: Add notes with title, category (College, Study, Project, Personal), and description.
  - **Read**: Live searchable notes catalog with instant category filtering and item counter.
  - **Update**: Edit existing notes directly in the sidebar form with Cancel support.
  - **Delete**: Remove notes with confirmation modal.
- **Persistence**: Automatically syncs state with browser `localStorage`.
- **React Concepts**:
  - `useState` for component state and form fields.
  - `useEffect` for localStorage synchronization.
  - In-browser Babel transpilation for GitHub Pages deployment without build tooling.

## Files
- `index.html` - HTML container with React 18 & Babel CDNs
- `style.css` - Responsive grid, category tags, and clean card styling
- `app.js` - React components, hooks, and event handlers
