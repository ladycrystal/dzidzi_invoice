import React, { useState, useEffect, useRef } from "react";
import TextInputField from "../ReusableComponents/TextInputField";
import PasswordField from "../ReusableComponents/PasswordField";
import InstructionNote from "../ReusableComponents/InstructionNote";
import MessageBox from "../ReusableComponents/MessageBox";
import FormButton from "../ReusableComponents/FormButton";
import LoadingScreen from "../../screens/LoadingScreen";
import { FaUser, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

//creating a regex to validate telephone, email, and password

const TEL_REGEX = /^\+?[0-9]{1,4}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$]).{8,24}$/;
const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)?$/;

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

  //state for password visibility toggle
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
  const [isLoading, setIsLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const navigate = useNavigate();

  //set the focus when the page loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //validate the respective fields
  useEffect(() => {
    const result = NAME_REGEX.test(formData.name);
    console.log(result);
    console.log(formData.name);
    setValidName(result);
  }, [formData.name]);

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
      setErrMsg("All fields are required!");
      return;
    }

    if (!formData.acceptedTerms) {
      setErrMsg("You must accept the terms and conditions!");
      return;
    }

    // extra security if button enabled with JS hack in bg
    const v1 = EMAIL_REGEX.test(formData.email);
    const v2 = PWD_REGEX.test(formData.password);
    const v3 = TEL_REGEX.test(formData.telephone);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    setIsLoading(true);

    //format for backend receiving data
    const payload = JSON.stringify({
      email: formData.email,
      firstname: formData.name,
      lastname: " ",
      password: formData.password,
      telephone: formData.telephone,
    });

    try {
      //  Send data to the signup endpoint
      const response = await API.post("/users", payload, {
        headers: {
          "Content-type": "application/json",
        },
      });
      setIsLoading(true);
      setMessage("Signup successful! Redirecting...");

      setTimeout(() => {
        setFadeOut(true); // Trigger fade out
      }, 2000);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        setIsLoading(false); // hide spinner
        setFadeOut(false);
        navigate("/getaddress");

        setFormData({
          name: "",
          email: "",
          password: "",
          telephone: "",
          acceptedTerms: false,
        }); // Reset form
      }, 2000);
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
      } else {
        setErrMsg("Registration Failed");
      }
      console.error(
        "Signup error:",
        error?.response ? error.response?.data : error.message
      );
      //  Only focus if the ref exists and is mounted
      if (errRef.current) {
        errRef.current.focus();
      }
    } finally {
      setIsLoading(false); //always stops the loader
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          {isLoading && <LoadingScreen fadeOut={fadeOut} />}
          {errMsg ? (
            <MessageBox refProp={errRef} message={errMsg} isError={true} />
          ) : message ? (
            <MessageBox message={message} isError={false} />
          ) : null}

          <form onSubmit={handleSubmit} noValidate method="POST">
            <TextInputField
              label="Full Name"
              valid={validName}
              type="text"
              name="name"
              id="name"
              refProp={userRef}
              autoComplete="off"
              aria-describedby="namenote"
              aria-label="Enter your name"
              aria-invalid={validName ? "false" : "true"}
              value={formData.name}
              placeholder="e.g. John Doe"
              onChange={handleChange}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              required
              focus={userFocus}
              icon={FaUser}
            />

            <InstructionNote
              value={formData.name}
              noteid="namenote"
              focus={userFocus}
              condition={!validName}
              notemessage={
                <>
                  Must be a valid name. <br />
                  Only letters are allowed. <br />
                  Symbols,digits,double spaces, trailing spaces are not allowed.
                </>
              }
            />

            <TextInputField
              label="Email"
              type="email"
              name="email"
              id="email"
              valid={validEmail}
              focus={emailFocus}
              value={formData.email}
              autoComplete="off"
              aria-label="Enter your email."
              placeholder="example@gmail.com"
              onChange={handleChange}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              refProp={userRef}
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              className="form-input"
              required
              icon={MdEmail}
            />
            <InstructionNote
              value={formData.email}
              noteid="uidnote"
              focus={emailFocus}
              condition={!validEmail}
              notemessage={
                <>
                  Must be a valid email format. <br />
                  Example: user@example.com <br />
                  Only letters, numbers, underscores, hyphens, and dots are
                  allowed.
                </>
              }
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

            <InstructionNote
              noteid="pwdnote"
              focus={pwdFocus}
              condition={!validPwd}
              message="8-24 characters. Must include uppercase, lowercase, number & special character (!@#%$)"
            />
            <TextInputField
              label="Phone number"
              type="tel"
              id="tel"
              valid={validTel}
              name="telephone"
              autoComplete="off"
              aria-label="Enter your phone number"
              value={formData.telephone}
              placeholder="e.g. 44444444"
              onChange={handleChange}
              onFocus={() => setTelFocus(true)}
              onBlur={() => setTelFocus(false)}
              refProp={userRef}
              aria-invalid={validTel ? "false" : "true"}
              aria-describedby="telnote"
              className="form-input"
              required
              icon={FaPhone}
            />
            <InstructionNote
              noteid="telnote"
              focus={telFocus}
              condition={!validTel}
              message="Must be at least 10 digits (numbers only)."
            />

            <div className="terms-style">
              <label htmlFor="checkbox" className="terms-conditions">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  id="checkbox"
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

            <FormButton
              disabled={!validName || !validEmail || !validTel || !validPwd}
              text="Sign Up"
            />

            <div className="register-link">
              <p>
                Already have an account?
                <Link to="/login">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="terms-container"></div>
    </>
  );
}

export default SignUpPage;
