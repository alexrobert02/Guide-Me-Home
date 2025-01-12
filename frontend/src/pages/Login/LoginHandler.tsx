import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import axios from "axios";
import { DEFAULT_BACKEND_API_URL } from "../../ProjectDefaults";
import { requestPermissionForNotifications } from "../../firebase/firebase-config";
import { getUserEmail, getUserId } from "../../services/tokenDecoder";

const TRUE_STRING = "true";


function LoginHandler() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(
        `${DEFAULT_BACKEND_API_URL}/api/v1/user/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Authentication successful!")
        const data = response.data;
        localStorage.setItem("isAuthenticated", TRUE_STRING);
        localStorage.setItem("role", data.role);

        localStorage.setItem("token", data.accessToken);

        const fcmToken = await requestPermissionForNotifications();
        localStorage.setItem("fcmToken", fcmToken);

        console.log("FCM token:", fcmToken);
        if (fcmToken) {
          // Trimite token-ul de notificare la backend
          await axios.post(
            `${DEFAULT_BACKEND_API_URL}/api/v1/notifications/token`, 
            { 
              userId: getUserId(),
              fcmToken 
            },
            {
              headers: {
                "Authorization": `Bearer ${data.accessToken}`,
              },
            }
          );
        }

        window.location.reload();

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
