import "./App.css";
import React from "react";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register/RegisterHandler";
import Login from "./pages/Login/LoginHandler";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            localStorage.getItem("isAuthenticated") === "true" ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            localStorage.getItem("isAuthenticated") === "true" ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>Welcome Home</h1>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
