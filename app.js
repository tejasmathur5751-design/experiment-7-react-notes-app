const { useState, useEffect } = React;

const defaultNotes = [
  {
    id: 1,
    title: "Web Design Lab Viva Prep",
    category: "College",
    text: "Revise HTML5 semantic elements, CSS media queries, and React state management (useState, useEffect) for Monday's evaluation.",
    date: "12 Nov 2026"
  },
  {
    id: 2,
    title: "Data Science Project Dataset",
    category: "Project",
    text: "Clean missing values in student performance dataset, compute correlation matrices, and generate exploratory scatter plots.",
    date: "11 Nov 2026"
  },
  {
    id: 3,
    title: "Algorithms Final Exam Syllabus",
    category: "Study",
    text: "Focus revision on Dynamic Programming, Dijkstra's algorithm, Graph Traversals (BFS/DFS), and Divide & Conquer techniques.",
    date: "10 Nov 2026"
  },
  {
    id: 4,
    title: "Library Book Return Date",
    category: "Personal",
    text: "Return Operating Systems Concepts (Silberschatz) and Database Systems book to central library before 20th November.",
    date: "09 Nov 2026"
  }
];

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const stored = localStorage.getItem("student_react_notes");
      return stored ? JSON.parse(stored) : defaultNotes;
    } catch (e) {
      return defaultNotes;
    }
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("College");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("student_react_notes", JSON.stringify(notes));
    } catch (e) {
      console.log(e);
    }
  }, [notes]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert("Please fill in both title and note content!");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    if (editId) {
      setNotes(notes.map(note =>
        note.id === editId
          ? { ...note, title: title.trim(), category, text: text.trim(), date: currentDate }
          : note
      ));
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        category,
        text: text.trim(),
        date: currentDate
      };
      setNotes([newNote, ...notes]);
    }

    setTitle("");
    setText("");
    setCategory("College");
  }

  function handleEdit(note) {
    setEditId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setText(note.text);
    window.scrollTo({ top: 150, behavior: "smooth" });
  }

  function handleCancel() {
    setEditId(null);
    setTitle("");
    setText("");
    setCategory("College");
  }

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(note => note.id !== id));
      if (editId === id) {
        handleCancel();
      }
    }
  }

  // Categories count
  const categories = ["All", "College", "Study", "Project", "Personal"];
  const getCategoryCount = (cat) => {
    if (cat === "All") return notes.length;
    return notes.filter(n => n.category === cat).length;
  };

  // Filter notes by search keyword and category
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.text.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Top Navigation */}
      <header class="navbar">
        <div class="nav-container">
          <div class="nav-brand">Student Notes Portal &bull; Exp 7</div>
          <nav class="nav-links">
            <a href="#notes-section">Notes</a>
            <a href="#categories-section">Categories</a>
            <a href="#hooks-section">React Concepts</a>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section class="hero-banner">
        <div class="banner-content">
          <h1>React.js Study Notes Portal</h1>
          <p>Single-Page Application (SPA) demonstrating React hooks, CRUD state management, and real-time filtering</p>
        </div>
      </section>

      {/* Main Layout */}
      <main class="main-layout" id="notes-section">
        {/* Left Sidebar */}
        <aside class="sidebar-column">
          {/* Note Form */}
          <div class="card form-card">
            <h3>{editId ? "Edit Note" : "Add New Note"}</h3>
            <form onSubmit={handleSubmit}>
              <div class="form-group">
                <label>Note Title</label>
                <input
                  type="text"
                  placeholder="e.g., Data Science Viva..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div class="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="College">College</option>
                  <option value="Study">Study</option>
                  <option value="Project">Project</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div class="form-group">
                <label>Content</label>
                <textarea
                  placeholder="Write note description here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="3"
                  required
                />
              </div>

              <div class="btn-group">
                <button type="submit" class={`btn ${editId ? "btn-update" : "btn-primary"}`}>
                  {editId ? "Update Note" : "+ Add Note"}
                </button>
                {editId && (
                  <button type="button" class="btn btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Category Filter Widget */}
          <div class="card" id="categories-section">
            <h3>Filter by Category</h3>
            <div class="category-list">
              {categories.map((cat) => (
                <div
                  key={cat}
                  class={`category-item ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <span class="count-pill">{getCategoryCount(cat)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* React Hooks Info */}
          <div class="card info-card" id="hooks-section">
            <h3>React Concepts Used</h3>
            <h4>useState Hook</h4>
            <p>Manages active notes, form fields (title, category, text), filter keywords, and current edit states.</p>
            <h4>useEffect Hook</h4>
            <p>Syncs notes state with browser <code>localStorage</code> so updates persist across page reloads.</p>
          </div>
        </aside>

        {/* Right Content Area */}
        <section class="content-column">
          {/* Search Toolbar */}
          <div class="toolbar">
            <input
              type="text"
              class="search-input"
              placeholder="Search notes by keyword or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div class="notes-count-badge">
              Showing {filteredNotes.length} of {notes.length} notes
            </div>
          </div>

          {/* Notes Cards Grid */}
          {filteredNotes.length === 0 ? (
            <div class="empty-state">
              No notes found matching your search. Add a new note using the left panel!
            </div>
          ) : (
            <div class="notes-grid">
              {filteredNotes.map((note) => (
                <div key={note.id} class={`note-card cat-${note.category}`}>
                  <div>
                    <div class="note-card-header">
                      <h4>{note.title}</h4>
                      <span class={`badge cat-${note.category}`}>{note.category}</span>
                    </div>
                    <p class="note-body">{note.text}</p>
                  </div>
                  <div class="note-card-footer">
                    <span>{note.date}</span>
                    <div class="note-actions">
                      <button class="btn-sm btn-edit" onClick={() => handleEdit(note)}>Edit</button>
                      <button class="btn-sm btn-delete" onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer class="footer">
        <p>&copy; 2026 Web Design Lab &bull; Department of Data Science, JSS University &bull; Experiment 7</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
