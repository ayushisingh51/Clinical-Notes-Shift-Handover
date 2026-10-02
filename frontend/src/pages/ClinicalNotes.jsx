import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ClinicalNotes.css";

const API_URL = "http://localhost:5001";

export default function ClinicalNotes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  // Fetch clinical notes
  const fetchNotes = () => {
    fetch(`${API_URL}/api/clinical-notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          console.error("Error:", data);
          setNotes([]);
        }

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

  // Add clinical note
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) return;

    fetch(`${API_URL}/api/clinical-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        if (newNote.message && !newNote._id) {
          alert(newNote.message);
          return;
        }

        setNotes((prevNotes) => [
          ...prevNotes,
          newNote,
        ]);

        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error("Error adding clinical note:", err);
      });
  };

  return (
    <div className="clinical-notes-page">
      <div className="clinical-notes-container">

        {/* Header */}
        <div className="clinical-notes-header">
          <h1>Clinical Notes</h1>
          <p>View and manage patient clinical notes.</p>
        </div>

        {/* Only Admin, Doctor and Staff can create notes */}
        {user &&
          ["admin", "doctor", "staff"].includes(user.role) && (
            <form
              onSubmit={handleSubmit}
              className="clinical-note-form"
            >
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Note Description / Content"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="add-note-button"
              >
                Add Clinical Note
              </button>
            </form>
          )}

        {/* Clinical Notes List */}
        {loading ? (
          <div className="clinical-notes-loading">
            Loading clinical notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="clinical-notes-message">
            No clinical notes found.
          </div>
        ) : (
          <div className="clinical-notes-list">
            {notes.map((note) => (
              <div
                className="clinical-note-card"
                key={note._id || note.id}
              >
                <div className="clinical-note-icon">
                  N
                </div>

                <div className="clinical-note-info">
                  <strong>{note.title}</strong>

                  <span>
                    {note.description || note.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}