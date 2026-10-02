import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Patients.css";

const API_URL = "http://localhost:5001";

export default function Patients() {
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const token = localStorage.getItem("token");

  // Fetch patients
  const fetchPatients = () => {
    fetch(`${API_URL}/api/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          console.error("Error:", data);
          setPatients([]);
        }

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

  // Add patient
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age) return;

    fetch(`${API_URL}/api/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        age: Number(age),
      }),
    })
      .then((res) => res.json())
      .then((newPatient) => {
        if (newPatient.message) {
          alert(newPatient.message);
          return;
        }

        setPatients((prevPatients) => [
          ...prevPatients,
          newPatient,
        ]);

        setName("");
        setAge("");
      })
      .catch((err) => {
        console.error("Error adding patient:", err);
      });
  };

  return (
  <div className="patients-page">
    <div className="patients-container">

      <div className="patients-header">
        <h1>Patients</h1>
        <p>Manage and view patient records.</p>
      </div>

      {/* Only Admin, Doctor and Staff can add patients */}
      {user &&
        ["admin", "doctor", "staff"].includes(user.role) && (
          <form
            onSubmit={handleSubmit}
            className="patient-form"
          >
            <input
              type="text"
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />

            <button
              type="submit"
              className="add-patient-button"
            >
              Add Patient
            </button>
          </form>
        )}

      {/* Patients List */}
      {loading ? (
        <div className="patients-loading">
          Loading patients...
        </div>
      ) : patients.length === 0 ? (
        <div className="patients-message">
          No patients found.
        </div>
      ) : (
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              className="patient-card"
              key={patient._id || patient.id}
            >
              <div className="patient-card-avatar">
                {patient.name
                  ? patient.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "P"}
              </div>

              <div className="patient-card-info">
                <strong>{patient.name}</strong>
                <span>Age: {patient.age}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
);
}