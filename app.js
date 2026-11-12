const { useState, useEffect } = React;

// Sample initial notes matching college student context
const initialNotes = [
  {
    id: 1,
    title: "Web Design Lab Exam",
    category: "College",
    text: "Revise HTML5 semantic tags, CSS media queries, and React state management (useState) before Monday.",
    date: "12 Nov 2026"
  },
  {
    id: 2,
    title: "Data Science Assignment",
    category: "Study",
    text: "Complete data visualization questions in Python and submit the notebook by Friday.",
    date: "11 Nov 2026"
  },
  {
    id: 3,
    title: "Library Books Return",
    category: "Personal",
    text: "Return Computer Networks book to the central library before due date to avoid fine.",
    date: "10 Nov 2026"
  }
];

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("react_notes_app");
      return saved ? JSON.parse(saved) : initialNotes;
    } catch (e) {
      return initialNotes;
    }
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("College");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    try {
      localStorage.setItem("react_notes_app", JSON.stringify(notes));
    } catch (e) {
      console.log(e);
    }
  }, [notes]);

  // Handle form submit (Add or Update)
  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert("Please enter both title and note content.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    if (editId) {
      setNotes(notes.map(note =>
        note.id === editId ? { ...note, title: title.trim(), category, text: text.trim(), date: currentDate } : note
      ));
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        category: category,
        text: text.trim(),
        date: currentDate
      };
      setNotes([newNote, ...notes]);
    }

    // Reset form fields
    setTitle("");
    setText("");
    setCategory("College");
  }

  // Load note details into form for editing
  function handleEdit(note) {
    setEditId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setText(note.text);
  }

  // Cancel edit mode
  function handleCancelEdit() {
    setEditId(null);
    setTitle("");
    setText("");
    setCategory("College");
  }

  // Delete note
  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(note => note.id !== id));
      if (editId === id) {
        handleCancelEdit();
      }
    }
  }

  // Filter notes by search keyword
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.text.toLowerCase().includes(search.toLowerCase()) ||
    note.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>React Notes App</h1>
        <p>Keep track of your daily college notes and reminders</p>
      </header>

      {/* Note Creation / Edit Form */}
      <form className="note-form" onSubmit={handleSubmit}>
        <h3>{editId ? "Edit Note" : "Add New Note"}</h3>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="College">College</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <textarea
            placeholder="Write your note here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="3"
            required
          />
        </div>

        <div className="btn-group">
          <button type="submit" className={editId ? "btn-update" : "btn-primary"}>
            {editId ? "Update Note" : "Add Note"}
          </button>
          {editId && (
            <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search and Note Count Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="count-badge">Total Notes: {filteredNotes.length}</span>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <p className="empty-message">No notes found.</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className={`note-card tag-${note.category}`}>
              <div className="note-header">
                <h4 className="note-title">{note.title}</h4>
                <span className="badge">{note.category}</span>
              </div>
              <p className="note-text">{note.text}</p>
              <div className="note-footer">
                <span>{note.date}</span>
                <div className="note-actions">
                  <button className="btn-edit" onClick={() => handleEdit(note)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
