import "./App.css";
import * as React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import Register from "./pages/Register/RegisterHandler";
import Login from "./pages/Login/LoginHandler";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home/Home";
import TestPage from "./pages/TestPage/TestPage";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      <Route element={<ProtectedRoute isAuth={isAuthenticated} />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/debug" element={<TestPage></TestPage>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
