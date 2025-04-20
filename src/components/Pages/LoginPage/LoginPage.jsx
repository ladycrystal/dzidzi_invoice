import React, { useEffect, useState, useRef } from "react";
import TextInputField from "../ReusableComponents/TextInputField";
import PasswordField from "../ReusableComponents/PasswordField";
import MessageBox from "../ReusableComponents/MessageBox";
import LoadingScreen from "../../screens/LoadingScreen";
import FormButton from "../ReusableComponents/FormButton";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

function LoginPage() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$]).{8,24}$/;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  //state for password visibility toggle
  const [pwdVisibility, setPwdVisibility] = useState(false);
  //states for email and password
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [formData.username, formData.password]);

  useEffect(() => {
    setMessage("");
  }, [formData]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(formData.username);
    setValidEmail(result);
  }, [formData.username]);

  useEffect(() => {
    const result = PWD_REGEX.test(formData.password);
    setValidPwd(result);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage("Both fields are required!");
      return;
    }

    setIsLoading(true);

    //format for backend receiving data using x-www-form-urlencoded
    const payload = new URLSearchParams();
    payload.append("username", formData.username);
    payload.append("password", formData.password);

    try {
      const response = await API.post("auth/token", payload, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);

        setMessage("Login successful!");
        setIsLoading(true);

        // Wait for a short moment before starting fade out
        setTimeout(() => {
          setFadeOut(true); // Trigger fade out
        }, 2000);

        setTimeout(() => {
          setIsLoading(false); // hide spinner
          setFadeOut(false); // reset animation state
          navigate("/Home"); // Navigate to the home page
          setFormData({ username: "", password: "" }); // Reset form
          //setIsLoading(false);
        }, 2000);
      } else {
        setMessage("Invalid credentials. Please try again.");
        console.log(message);
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
        console.log(message);
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized");
        console.log("error: ", error.response);
      } else {
        setErrMsg("Login Failed");
        console.log("login error: ", error.response);
      }
      if (errRef.current) {
        errRef.current.focus();
      }
      console.log("ERROR:", error);
      console.log("ERROR MESSAGE:", errMsg);
    } finally {
      setIsLoading(false); //always stops the loader
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <h2 className="signup-title">Login</h2>
          {isLoading && <LoadingScreen fadeOut={fadeOut} />}
          {errMsg ? (
            <MessageBox refProp={errRef} message={errMsg} isError={true} />
          ) : message ? (
            <MessageBox message={message} isError={false} />
          ) : null}

          <form onSubmit={handleSubmit}>
            <TextInputField
              label="Email"
              type="email"
              name="username"
              value={formData.username}
              valid={validEmail}
              onChange={handleChange}
              placeholder="example@gmail.com"
              icon={MdEmail}
              required
              refProp={userRef}
              focus={emailFocus}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            <PasswordField
              label="Password"
              visible={pwdVisibility} //toggle type dynamically
              name="password"
              id="pwd"
              value={formData.password}
              valid={validPwd}
              aria-label="Enter your password."
              placeholder="password"
              toggleVisibility={() => setPwdVisibility(!pwdVisibility)}
              onChange={handleChange}
              onFocus={() => setPwdFocus(true)}
              onBlur={(e) => {
                //  hide instructions if focus moves away from both input and eye-icon
                if (
                  !e.relatedTarget ||
                  !e.relatedTarget.classList.contains("toggle-password-icon")
                ) {
                  setPwdFocus(false);
                }
              }}
              focus={pwdFocus}
              aria-describedby="pwdnote"
            />

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

            <FormButton disabled={!validEmail || !validPwd} text="Login" />

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
