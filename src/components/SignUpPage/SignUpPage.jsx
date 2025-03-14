import React, { useState } from "react";
import "./SignUpPage.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptedTerms: false,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const type = e.target.type;
    const checked = e.target.checked;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //prevents refresh upon submitting form

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("All fields are required!");
      return;
    }

    if (!formData.acceptedTerms) {
      setMessage("You must accept the terms and conditions!");
      return;
    }

    setMessage("Signup successful!");
    navigate("/login");
    setFormData({ name: "", email: "", password: "", acceptedTerms: false }); // Reset form
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit} noValidate method="POST">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                aria-label="Enter your name"
                value={formData.name}
                placeholder="e.g. John Doe"
                onChange={handleChange}
                className="form-input"
                required
              />
              <FaUser className="form-icon" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                aria-label="Enter your email."
                placeholder="example@gmail.com"
                onChange={handleChange}
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
                aria-label="Enter your password."
                placeholder="password"
                onChange={handleChange}
                className="form-input"
                required
              />
              <FaLock className="form-icon" />
            </div>

            <div className="">
              <label className="terms-conditions">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  aria-label="Click to agree to the terms and conditions"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  className="form-checkbox"
                  required
                />
                <p>
                  I agree to the <a href="#">terms and conditions</a>{" "}
                </p>
              </label>
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="register-link">
            <p>
              Already have an account?
              <Link to="/login">Login</Link>
            </p>
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
      </div>

      <div className="terms-container"></div>
    </>
  );
}

export default SignUpPage;
