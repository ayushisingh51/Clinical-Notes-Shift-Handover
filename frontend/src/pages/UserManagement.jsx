import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserManagement.css";

const API_URL = "http://localhost:5001";

export default function UserManagement() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH USERS
  // ===============================
  const fetchUsers = () => {
    fetch(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        return data;
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // ===============================
  // CREATE USER
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill all fields.");
      return;
    }

    fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to create user");
        }

        return data;
      })
      .then((data) => {
        alert("User created successfully.");

        setUsers((prevUsers) => [
          data.user,
          ...prevUsers,
        ]);

        setName("");
        setEmail("");
        setPassword("");
        setRole("viewer");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        alert(error.message);
      });
  };

  // ===============================
  // ACTIVATE / DEACTIVATE USER
  // ===============================
  const handleStatusChange = (userId, currentStatus) => {
    const newStatus = !currentStatus;

    fetch(`${API_URL}/api/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isActive: newStatus,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to update user status"
          );
        }

        return data;
      })
      .then((data) => {
        setUsers((prevUsers) =>
          prevUsers.map((existingUser) =>
            existingUser._id === userId ||
            existingUser.id === userId
              ? {
                  ...existingUser,
                  isActive: data.user.isActive,
                }
              : existingUser
          )
        );
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
        alert(error.message);
      });
  };

  // ===============================
  // NON-ADMIN
  // ===============================
  if (!user || user.role !== "admin") {
    return (
      <div className="user-management-page">
        <div className="user-management-container">
          <div className="user-management-message">
            <h2>Access Denied</h2>
            <p>
              Only administrators can access User Management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="user-management-container">

        {/* HEADER */}
        <div className="user-management-header">
          <h1>User Management</h1>
          <p>
            Create and manage users and their system roles.
          </p>
        </div>

        {/* CREATE USER FORM */}
        <div className="user-management-section">
          <h2>Create New User</h2>

          <form
            onSubmit={handleSubmit}
            className="user-management-form"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="staff">Staff</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="create-user-button"
            >
              Create User
            </button>
          </form>
        </div>

        {/* USER LIST */}
        <div className="user-management-section">
          <div className="users-list-header">
            <h2>All Users</h2>
            <span>
              {users.length} user{users.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="user-management-message">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="user-management-message">
              No users found.
            </div>
          ) : (
            <div className="users-list">
              {users.map((item) => {
                const itemId = item._id || item.id;

                const initials = item.name
                  ? item.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "U";

                return (
                  <div
                    className="user-card"
                    key={itemId}
                  >
                    <div className="user-avatar">
                      {initials}
                    </div>

                    <div className="user-info">
                      <strong>{item.name}</strong>

                      <span>{item.email}</span>

                      <div className="user-meta">
                        <span
                          className={`role-badge role-${item.role}`}
                        >
                          {item.role}
                        </span>

                        <span
                          className={
                            item.isActive
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="user-actions">
                      {itemId === user.id ? (
                        <span className="current-user-label">
                          You
                        </span>
                      ) : (
                        <button
                          className={
                            item.isActive
                              ? "deactivate-button"
                              : "activate-button"
                          }
                          onClick={() =>
                            handleStatusChange(
                              itemId,
                              item.isActive
                            )
                          }
                        >
                          {item.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}