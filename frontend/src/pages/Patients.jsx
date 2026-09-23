import React, { useEffect, useState } from 'react';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form ke states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Patients fetch karne ka function
  const fetchPatients = () => {
    fetch('http://localhost:5000/api/patients')
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Form submit handle karne ka function (POST API Call)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age) return;

    fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, age: Number(age) }),
    })
      .then((res) => res.json())
      .then((newPatient) => {
        setPatients([...patients, newPatient]); // List me naya patient add kar do
        setName(''); // Form clear kar do
        setAge('');
      })
      .catch((err) => console.error("Error adding patient:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Patients</h1>
      <p>Manage and view patient records.</p>
      
      {/* Naya Patient Add karne ka Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Patient Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        <input 
          type="number" 
          placeholder="Age" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Patient</button>
      </form>

      {/* Patients List Display */}
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <ul>
          {patients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            patients.map((patient) => (
              <li key={patient._id || patient.id} style={{ marginBottom: '8px' }}>
                <strong>{patient.name}</strong> (Age: {patient.age})
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}