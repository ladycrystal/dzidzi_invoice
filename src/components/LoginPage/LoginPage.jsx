import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import {
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://invoiceapp-8ub4.onrender.com/api/v1/auth/token",
        formData
      );
      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful!");
        navigate("/home"); // Navigate to the "add invoice" page
        setFormData({ email: "", password: "" }); // Reset form
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occured. Please try again");
    }

    if (!formData.email || !formData.password) {
      setMessage("Both fields are required!");
      return;
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form-container">
          <form onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-group-style">
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
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-group-style">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <FaEye className="form-icon" />
              </div>
            </div>

            <div className="remember-forgot">
              <div className="remember">
                <input
                  type="checkbox"
                  name=""
                  id="checkbox"
                  className="remember-me"
                />
                <label htmlFor="checkbox">Remember me</label>
              </div>
              <div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>
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
      </div>
    </>
  );
}

export default LoginPage;
