const { useState } = React;

const initialNotes = [
 {
  id: 1,
  title: "Web Design Lab Exam",
  category: "College",
  text: "Revise HTML semantic tags, CSS media queries, and React useState before Monday.",
  date: "12 Nov 2026"
 },
 {
  id: 2,
  title: "Data Science Assignment",
  category: "Study",
  text: "Complete data visualisation questions and submit the notebook by Friday.",
  date: "11 Nov 2026"
 },
 {
  id: 3,
  title: "Library Books Return",
  category: "Personal",
  text: "Return Computer Networks book to library before due date.",
  date: "10 Nov 2026"
 }
];

function App() {
 const [notes, setNotes] = useState(() => {
  try {
   const saved = localStorage.getItem("my_notes");
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

 function save(updated) {
  setNotes(updated);
  try { localStorage.setItem("my_notes", JSON.stringify(updated)); } catch (e) {}
 }

 function handleSubmit(e) {
  e.preventDefault();
  if (!title.trim() || !text.trim()) {
   alert("Please fill in title and note content.");
   return;
  }

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (editId) {
   save(notes.map(n => n.id === editId ? { ...n, title: title.trim(), category, text: text.trim(), date: today } : n));
   setEditId(null);
  } else {
   save([{ id: Date.now(), title: title.trim(), category, text: text.trim(), date: today }, ...notes]);
  }

  setTitle(""); setText(""); setCategory("College");
 }

 function handleEdit(note) {
  setEditId(note.id);
  setTitle(note.title);
  setCategory(note.category);
  setText(note.text);
 }

 function handleDelete(id) {
  if (confirm("Delete this note?")) {
   save(notes.filter(n => n.id !== id));
   if (editId === id) { setEditId(null); setTitle(""); setText(""); setCategory("College"); }
  }
 }

 const filtered = notes.filter(n =>
  n.title.toLowerCase().includes(search.toLowerCase()) ||
  n.text.toLowerCase().includes(search.toLowerCase())
 );

 return (
  <div>
   {/* Add / Edit Note Form */}
   <div className="form-card" id="add-note">
    <h2>{editId ? "Edit Note" : "Add New Note"}</h2>
    <form onSubmit={handleSubmit}>
     <div className="form-group">
      <label>Title</label>
      <input type="text" placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)} required />
     </div>
     <div className="form-group">
      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
       <option value="College">College</option>
       <option value="Study">Study</option>
       <option value="Personal">Personal</option>
      </select>
     </div>
     <div className="form-group">
      <label>Note</label>
      <textarea placeholder="Write your note here..." value={text} onChange={e => setText(e.target.value)} required />
     </div>
     <div className="btn-row">
      <button type="submit" className={editId ? "btn-update" : "btn-add"}>
       {editId ? "Update Note" : "Add Note"}
      </button>
      {editId && (
       <button type="button" className="btn-cancel" onClick={() => { setEditId(null); setTitle(""); setText(""); setCategory("College"); }}>
        Cancel
       </button>
      )}
     </div>
    </form>
   </div>

   {/* Notes List */}
   <div className="notes-section" id="notes">
    <h2>All Notes ({filtered.length})</h2>
    <div className="search-row">
     <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
    </div>

    {filtered.length === 0 ? (
     <p className="empty-msg">No notes found.</p>
    ) : (
     filtered.map(note => (
      <div key={note.id} className={`note-card cat-${note.category}`}>
       <h4 className="note-card-title">{note.title}</h4>
       <p className="note-card-text">{note.text}</p>
       <div className="note-card-footer">
        <span className={`cat-badge ${note.category}`}>{note.category}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
         <span>{note.date}</span>
         <div className="note-actions">
          <button className="btn-edit" onClick={() => handleEdit(note)}>Edit</button>
          <button className="btn-delete" onClick={() => handleDelete(note.id)}>Delete</button>
         </div>
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
