import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ShiftHandover.css";

const API_URL = "http://localhost:5001";

export default function ShiftHandover() {
  const { user } = useAuth();

  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const token = localStorage.getItem("token");

  // Fetch handovers
  const fetchHandovers = () => {
    fetch(`${API_URL}/api/handovers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHandovers(data);
        } else {
          console.error("Error:", data);
          setHandovers([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching handovers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHandovers();
  }, []);

  // Add handover
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !summary) return;

    fetch(`${API_URL}/api/handovers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        summary,
      }),
    })
      .then((res) => res.json())
      .then((newHandover) => {
        if (newHandover.message && !newHandover._id) {
          alert(newHandover.message);
          return;
        }

        setHandovers((prevHandovers) => [
          ...prevHandovers,
          newHandover,
        ]);

        setTitle("");
        setSummary("");
      })
      .catch((err) => {
        console.error("Error adding shift handover:", err);
      });
  };

  return (
    <div className="handover-page">
      <div className="handover-container">

        {/* Header */}
        <div className="handover-header">
          <h1>Shift Handover</h1>
          <p>Manage and view shift handover records.</p>
        </div>

        {/* Only Admin, Doctor and Staff can create */}
        {user &&
          ["admin", "doctor", "staff"].includes(user.role) && (
            <form
              onSubmit={handleSubmit}
              className="handover-form"
            >
              <input
                type="text"
                placeholder="Shift Title / Handover Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Shift Summary / Notes"
                value={summary}
                onChange={(e) =>
                  setSummary(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="add-handover-button"
              >
                Add Shift Handover
              </button>
            </form>
          )}

        {/* Handover List */}
        {loading ? (
          <div className="handover-loading">
            Loading shift handovers...
          </div>
        ) : handovers.length === 0 ? (
          <div className="handover-message">
            No shift handovers found.
          </div>
        ) : (
          <div className="handover-list">
            {handovers.map((handover) => (
              <div
                className="handover-card"
                key={handover._id || handover.id}
              >
                <div className="handover-card-icon">
                  ⇄
                </div>

                <div className="handover-card-info">
                  <strong>{handover.title}</strong>

                  <span>
                    {handover.summary || handover.notes}
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