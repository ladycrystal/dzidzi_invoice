import React, { useState, useEffect, useRef } from "react";
import "./SignUpPage.css";
import {
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

//creating a regex to validate telephone, email, and password

const TEL_REGEX = /^\+?[0-9]{1,4}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$]).{8,24}$/;

function SignUpPage() {
  //setting focus on all user input when the component loads and one to focus on error
  const userRef = useRef();
  const errRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    telephone: "",
    acceptedTerms: false,
  });

  //state for password visibility
  const [pwdVisibility, setPwdVisibility] = useState(false);

  //setting states to capture name validation and input focus
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  //setting states to capture pwd validation and input focus
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  //setting states to capture tel validation and input focus
  const [validTel, setValidTel] = useState(false);
  const [telFocus, setTelFocus] = useState(false);

  //setting states to capture email validation and input focus
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  //state for error & success messages
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  // const samplePayload = {
  //   email: "lhahdhiye@gmail.com",
  //   firstname: "Lady",
  //   lastname: "Doe",
  //   password: "1234",
  //   telephone: "452874334",
  // };

  //set the focus when the page loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //validate the respective fields
  useEffect(() => {
    const result = PWD_REGEX.test(formData.password);
    console.log(result);
    console.log(formData.password);
    setValidPwd(result);
  }, [formData.password]);

  useEffect(() => {
    const result = TEL_REGEX.test(formData.telephone);
    console.log(result);
    console.log(formData.telephone);
    setValidTel(result);
  }, [formData.telephone]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(formData.email);
    console.log(result);
    console.log(formData.email);
    setValidEmail(result);
  }, [formData.email]);

  useEffect(() => {
    setErrMsg("");
  }, [formData.telephone, formData.email, formData.password]);

  useEffect(() => {
    setMessage("");
  }, [formData]);

  //handles changes that happen on the form for the different types of form fields
  const handleChange = (e) => {
    const { name, value } = e.target; //extracts the name and value from the event
    const type = e.target.type; //checks the input type(eg.checkbox,text,pwd)
    const checked = e.target.checked; //applies to the checkbox
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value }); //updates the state of the form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.telephone
    ) {
      setMessage("All fields are required!");
      return;
    }

    if (!formData.acceptedTerms) {
      setMessage("You must accept the terms and conditions!");
      return;
    }

    // extra security if button enabled with JS hack in bg
    const v1 = EMAIL_REGEX.test(formData.email);
    const v2 = PWD_REGEX.test(formData.password);
    const v3 = TEL_REGEX.test(formData.telephone);
    if (!v1 || !v2 || v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    //format for backend receiving data
    const payload = JSON.stringify({
      email: formData.email,
      firstname: formData.name,
      lastname: " ",
      password: formData.password,
      telephone: formData.telephone,
    });

    const token = localStorage.getItem("token");

    try {
      //  Send data to the signup endpoint
      const response = await API.post("/users", payload, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMessage("Signup successful! Redirecting to login...");
      console.log("Response: ", response.data);
      console.log("Token: ", response.accessToken);
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);

      setFormData({
        name: "",
        email: "",
        password: "",
        telephone: "",
        acceptedTerms: false,
      }); // Reset form
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 409) {
        setErrMsg("User with this email or phone number already exists.");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized: Please log in.");
      } else if (error.response?.status === 403) {
        setErrMsg(
          "Forbidden: You do not have permission to access this resource."
        );
      }
      console.error(
        "Signup error:",
        error?.response ? error.response?.data : error.message
      );
      errRef.current.focus(); //for screen reader to detect the error field
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit} noValidate method="POST">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <div className="form-group-style">
                <input
                  type="text"
                  name="name"
                  id="name"
                  ref={userRef}
                  autoComplete="off"
                  aria-label="Enter your name"
                  aria-invalid={validName ? "false" : "true"}
                  value={formData.name}
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  className="form-input"
                  required
                />
                <FaUser className="form-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
                <span className={validEmail ? "valid" : "hide"}>
                  <FaCheck />
                </span>
                <span
                  className={validEmail || !formData.email ? "hide" : "invalid"}
                >
                  <FaTimes />
                </span>
              </label>
              <div className="form-group-style">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  autoComplete="off"
                  aria-label="Enter your email."
                  placeholder="example@gmail.com"
                  onChange={handleChange}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  ref={userRef}
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="uidnote"
                  className="form-input"
                  required
                />
                <MdEmail className="form-icon" />
              </div>
            </div>

            <p
              id="uidnote"
              className={
                emailFocus && formData.email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FaInfoCircle />
              Must be a valid email format. <br />
              Example: user@example.com <br />
              Only letters, numbers, underscores, hyphens, and dots are allowed.
            </p>

            <div className="form-group">
              <label htmlFor="pwd" className="form-label">
                Password
                <span className={validPwd ? "valid" : "hide"}>
                  <FaCheck />
                </span>
                <span
                  className={
                    validPwd || !formData.password ? "hide" : "invalid"
                  }
                >
                  <FaTimes />
                </span>
              </label>

              <div className="form-group-style">
                <input
                  type={pwdVisibility ? "text" : "password"} //toggle type dynamically
                  name="password"
                  id="pwd"
                  value={formData.password}
                  aria-label="Enter your password."
                  placeholder="password"
                  onChange={handleChange}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={(e) => {
                    //  hide instructions if focus moves away from both input and eye-icon
                    if (
                      !e.relatedTarget ||
                      !e.relatedTarget.classList.contains(
                        "toggle-password-icon"
                      )
                    ) {
                      setPwdFocus(false);
                    }
                  }}
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  className="form-input"
                  required
                />

                {/* Eye Icon to Toggle Password Visibility */}
                {pwdVisibility ? (
                  <FaEyeSlash
                    className="toggle-password-icon form-icon"
                    tabIndex="0" //does not trigger onblur immediately
                    onClick={() => setPwdVisibility(false)}
                  />
                ) : (
                  <FaEye
                    className="toggle-password-icon form-icon"
                    tabIndex="0"
                    onClick={() => setPwdVisibility(true)}
                  />
                )}
              </div>
            </div>

            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FaInfoCircle />
              Must be a valid email format. <br />
              Example: user@example.com <br />
              Only letters, numbers, underscores, hyphens, and dots are allowed.
            </p>

            <div className="form-group">
              <label htmlFor="tel" className="form-label">
                Telephone
                <span className={validTel ? "valid" : "hide"}>
                  <FaCheck />
                </span>
                <span
                  className={
                    validTel || !formData.telephone ? "hide" : "invalid"
                  }
                >
                  <FaTimes />
                </span>
              </label>
              <div className="form-group-style">
                <input
                  type="tel"
                  id="tel"
                  name="telephone"
                  autoComplete="off"
                  aria-label="Enter your phone number"
                  value={formData.telephone}
                  placeholder="e.g. 44444444"
                  onChange={handleChange}
                  onFocus={() => setTelFocus(true)}
                  onBlur={() => setTelFocus(false)}
                  ref={userRef}
                  aria-invalid={validTel ? "false" : "true"}
                  aria-describedby="telnote"
                  className="form-input"
                  required
                />
                <FaPhone className="form-icon" />
              </div>
            </div>
            <p
              id="telnote"
              className={
                telFocus && formData.telephone && !validTel
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FaInfoCircle />
              Must be a valid email format. <br />
              Example: user@example.com <br />
              Only letters, numbers, underscores, hyphens, and dots are allowed.
            </p>

            <div className="terms-style">
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
                  I agree to the <a href="#">terms and conditions</a>
                </p>
              </label>
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>

            <div className="register-link">
              <p>
                Already have an account?
                <Link to="/login">Login</Link>
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

      <div className="terms-container"></div>
    </>
  );
}

export default SignUpPage;
