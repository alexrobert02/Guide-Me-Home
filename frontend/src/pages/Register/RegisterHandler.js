import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

function RegisterHandler() {
  const navigate = useNavigate();

  const handleRegister = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login"); 
      } else {
        alert("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return <RegisterForm onRegister={handleRegister} />;
}

export default RegisterHandler;
