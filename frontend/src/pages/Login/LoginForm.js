import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password});
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="redirect-text">
      Don't have an account?{" "}
        <span className="redirect-link" onClick={() => navigate("/register")}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
