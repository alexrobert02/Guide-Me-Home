import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="auth-container">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit} className="form">
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button
          type="button"
          className="show-password-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      <p className="redirect-text">
        Don't have an account?{" "}
        <span className="redirect-link" onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
