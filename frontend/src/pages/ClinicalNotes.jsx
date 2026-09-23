import React, { useEffect, useState } from 'react';

export default function ClinicalNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch clinical notes function
  const fetchNotes = () => {
    fetch('http://localhost:5000/api/clinical-notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clinical notes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form submission (POST API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    fetch('http://localhost:5000/api/clinical-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        setNotes([...notes, newNote]); // Add new note to the list
        setTitle(''); // Clear form fields
        setDescription('');
      })
      .catch((err) => console.error("Error adding clinical note:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Clinical Notes</h1>
      <p>View and manage patient clinical notes.</p>
      
      {/* Form to add a new clinical note */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Note Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        <textarea 
          placeholder="Note Description / Content" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
          style={{ padding: '8px', minHeight: '80px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Clinical Note</button>
      </form>

      {/* Display Clinical Notes List */}
      {loading ? (
        <p>Loading clinical notes...</p>
      ) : (
        <ul>
          {notes.length === 0 ? (
            <p>No clinical notes found.</p>
          ) : (
            notes.map((note) => (
              <li key={note._id || note.id} style={{ marginBottom: '12px' }}>
                <strong>{note.title}</strong>: {note.description || note.content}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}