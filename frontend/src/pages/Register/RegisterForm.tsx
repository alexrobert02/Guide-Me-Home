import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onRegister({ email, password, role });
    // onRegister({ email, password });
  };

  return (
    <div className="auth-container">
      <h2 className="title">Register</h2>
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
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        <div className="form-group">
          <label>Role:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="assistant"
                checked={role === "assistant"}
                onChange={() => setRole("assistant")}
              />
              Assistant
            </label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      <p className="redirect-text">
        Do you already have an account?{" "}
        <span className="redirect-link" onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default RegisterForm;
