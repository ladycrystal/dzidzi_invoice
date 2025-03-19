import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Both fields are required!");
      return;
    }

    setMessage("Login successful!");
    navigate("/home"); // Navigate to the "add invoice" page
    setFormData({ email: "", password: "" }); // Reset form
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form-container">
          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="form-input"
                required
              />
              <MdEmail className="form-icon" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
                className="form-input"
                required
              />
              <FaLock className="form-icon" />
            </div>

            <div className="remember-forgot">
              <label htmlFor="">
                <input type="checkbox" name="" id="" className="" />
                Remember me
              </label>
              <a href="">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account?
                <Link to="/signup">Register</Link>
              </p>
            </div>
          </form>
        </div>
        {message && (
          <p
            className={
              message.includes("successful")
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}
      </div>
    </>
  );
}

export default LoginPage;
