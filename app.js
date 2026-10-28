const { useState } = React;

function App() {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Sample Note', text: 'This is a sample note.' }
    ]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [editId, setEditId] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !text.trim()) return;

        if (editId) {
            setNotes(notes.map(n => n.id === editId ? { ...n, title, text } : n));
            setEditId(null);
        } else {
            setNotes([...notes, { id: Date.now(), title, text }]);
        }

        setTitle('');
        setText('');
    }

    function handleEdit(note) {
        setEditId(note.id);
        setTitle(note.title);
        setText(note.text);
    }

    function handleDelete(id) {
        setNotes(notes.filter(n => n.id !== id));
    }

    return (
        <div>
            <h2>Notes App</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <button type="submit">{editId ? 'Update' : 'Add'}</button>
            </form>

            <div>
                {notes.map(note => (
                    <div key={note.id} className="note">
                        <h3>{note.title}</h3>
                        <p>{note.text}</p>
                        <button onClick={() => handleEdit(note)}>Edit</button>
                        <button onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
