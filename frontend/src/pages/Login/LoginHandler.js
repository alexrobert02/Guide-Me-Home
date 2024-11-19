import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

function LoginHandler() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("role", credentials.role);
        localStorage.setItem("token", data.token); 
        navigate("/"); 
      } else {
        alert("Invalid email, password, or role. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default LoginHandler;
