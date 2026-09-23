import React, { useEffect, useState } from 'react';

export default function ShiftHandover() {
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  // Fetch shift handovers function
  const fetchHandovers = () => {
    fetch('http://localhost:5000/api/handovers')
      .then((res) => res.json())
      .then((data) => {
        setHandovers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shift handovers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHandovers();
  }, []);

  // Handle form submission (POST API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !summary) return;

    fetch('http://localhost:5000/api/handovers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, summary }),
    })
      .then((res) => res.json())
      .then((newHandover) => {
        setHandovers([...handovers, newHandover]); // Add new handover to list
        setTitle(''); // Clear form fields
        setSummary('');
      })
      .catch((err) => console.error("Error adding shift handover:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shift Handover</h1>
      <p>Manage and view shift handover records.</p>
      
      {/* Form to add a new shift handover */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Shift Title / Handover Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        <textarea 
          placeholder="Shift Summary / Notes" 
          value={summary} 
          onChange={(e) => setSummary(e.target.value)} 
          required
          style={{ padding: '8px', minHeight: '80px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Shift Handover</button>
      </form>

      {/* Display Shift Handovers List */}
      {loading ? (
        <p>Loading shift handovers...</p>
      ) : (
        <ul>
          {handovers.length === 0 ? (
            <p>No shift handovers found.</p>
          ) : (
            handovers.map((handover) => (
              <li key={handover._id || handover.id} style={{ marginBottom: '12px' }}>
                <strong>{handover.title}</strong>: {handover.summary || handover.notes}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}