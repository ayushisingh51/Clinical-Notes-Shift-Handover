import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import ClinicalNotes from "./pages/ClinicalNotes";
import ShiftHandover from "./pages/ShiftHandover";
import UserManagement from "./pages/UserManagement";
import Register from "./pages/Register";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        <Route
  path="/register"
  element={<Register />}
/>

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Patients */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "doctor",
                "staff",
                "viewer"
              ]}
            >
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* Clinical Notes */}
        <Route
          path="/clinical-notes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "doctor",
                "staff",
                "viewer"
              ]}
            >
              <ClinicalNotes />
            </ProtectedRoute>
          }
        />

        {/* Shift Handover */}
        <Route
          path="/shift-handover"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "doctor",
                "staff",
                "viewer"
              ]}
            >
              <ShiftHandover />
            </ProtectedRoute>
          }
        />

        {/* User Management ADMIN ONLY*/}
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
