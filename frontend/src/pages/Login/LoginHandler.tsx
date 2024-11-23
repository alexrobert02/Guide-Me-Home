import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import axios from "axios";

const TRUE_STRING = "true";


function LoginHandler() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("isAuthenticated", TRUE_STRING);
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.accessToken);
        navigate("/");
      } else {
        alert("Invalid email, password, or role. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        alert(
          `Login failed: ${error.response.data.message || "Please try again."}`
        );
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default LoginHandler;
