import React, { useState, useEffect, useRef } from "react";
import TextInputField from "../../common/TextInputField";
import PasswordField from "../../common/PasswordField";
import MessageBox from "../../common/MessageBox";
import FormButton from "../../common/FormButton";
import LoadingScreen from "../../common/LoadingScreen";
import { FaUser, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import Typography from "@mui/material/Typography";

import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Stack,
  Box,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  FormHelperText,
  Container,
} from "@mui/material";
import { GoogleIcon, FacebookIcon } from "../../../utils/CustomIcons";

const RootGrid = styled(Grid)(({ theme }) => ({
  minHeight: "100vh",
}));

const StoryBox = styled(Box)(({ theme }) => ({
  // background:
  //   theme.palette.mode === "light"
  //     ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
  //     : "linear-gradient(135deg, #263238 0%, #37474f 100%)",
  color: theme.palette.getContrastText(theme.palette.background.paper),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  margin: "auto",
  padding: theme.spacing(4),
  maxWidth: 400,
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "500px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "flex",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

//creating a regex to validate telephone, email, and password

const TEL_REGEX = /^\+?[0-9]{1,4}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$]).{8,24}$/;
const NAME_REGEX = /^[A-Za-z\u00C0-\u017F]+(?:[ '-][A-Za-z\u00C0-\u017F]+)*$/;

function SignUpPage() {
  //setting focus on all user input when the component loads and one to focus on error
  // Refs for individual input fields
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef(); // You had userRef, let's make it specific for email or the first input
  const telephoneRef = useRef();
  const passwordRef = useRef();
  const confirmPwdRef = useRef();
  const errRef = useRef();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPwd: "",
    telephone: "",
    acceptedTerms: false,
  });

  //state for password visibility toggle
  const [pwdVisibility, setPwdVisibility] = useState(false);

  //input focus states
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [telFocus, setTelFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  //setting states to capture name validation and input focus
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);

  //setting states to capture pwd validation and input focus
  const [validPwd, setValidPwd] = useState(false);

  //state for confirmpassword visibility toggle
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(false); //controls toggle for confirmpwd
  //setting states to capture confirmpwd validation
  // const [confirmPwd, setConfirmPwd] = useState(""); //tracks the changes in the pwdfield
  const [passwordsMatch, setPasswordsMatch] = useState(true); //check for matching passwords

  //setting states to capture tel validation
  const [validTel, setValidTel] = useState(false);

  //setting states to capture email validation and input focus
  const [validEmail, setValidEmail] = useState(false);

  //state for error & success messages
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  //set the focus when the page loads
  useEffect(() => {
    firstNameRef.current.focus(); // Set focus to the first name input
  }, []);

  //validate the respective fields
  useEffect(() => {
    const result = NAME_REGEX.test(formData.firstname);
    console.log("First Name:", formData.firstname, "Valid:", result); // For debugging
    setValidFirstName(result);
  }, [formData.firstname]);

  useEffect(() => {
    const result = NAME_REGEX.test(formData.lastname);
    console.log("Last Name:", formData.lastname, "Valid:", result); // For debugging
    setValidLastName(result);
  }, [formData.lastname]);

  useEffect(() => {
    const result = PWD_REGEX.test(formData.password);
    // console.log(result);
    // console.log(formData.password);
    setValidPwd(result);
  }, [formData.password]);

  useEffect(() => {
    // Only check for match if both fields have content
    const match =
      formData.password &&
      formData.confirmPwd &&
      formData.password === formData.confirmPwd;
    setPasswordsMatch(match);
  }, [formData.password, formData.confirmPwd]);

  useEffect(() => {
    const result = TEL_REGEX.test(formData.telephone);
    // console.log(result);
    // console.log(formData.telephone);
    setValidTel(result);
  }, [formData.telephone]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(formData.email);
    // console.log(result);
    // console.log(formData.email);
    setValidEmail(result);
  }, [formData.email]);

  useEffect(() => {
    setErrMsg("");
  }, [
    formData.email,
    formData.password,
    formData.firstname,
    formData.lastname,
    formData.telephone,
  ]);

  //handles changes that happen on the form for the different types of form fields
  const handleChange = (e) => {
    const { name, value } = e.target; //extracts the name and value from the event
    const type = e.target.type; //checks the input type(eg.checkbox,text,pwd)
    const checked = e.target.checked; //applies to the checkbox
    setFormData((formData) => ({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })); //updates the state of the form

    // setMessage("");
    // setErrMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password, confirmPwd, telephone } =
      formData;

    // 🔍 Log the values before checking for empty fields
    console.log({
      firstname,
      lastname,
      email,
      password,
      confirmPwd,
      telephone,
    });

    // for confirmpwd
    if (formData.password !== confirmPwd) {
      console.log("Passwords do not match");
      setErrMsg("Passwords do not match");
      return;
    }

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.telephone ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPwd
    ) {
      console.log("All fields are required!");
      setErrMsg("All fields are required!");
      return;
    }

    if (!formData.acceptedTerms) {
      console.log("You must accept the terms and conditions!");
      setErrMsg("You must accept the terms and conditions!");
      return;
    }

    // extra security if button enabled with JS hack in bg
    const v1 = EMAIL_REGEX.test(formData.email);
    const v2 = PWD_REGEX.test(formData.password);
    const v3 = TEL_REGEX.test(formData.telephone);
    const v4 = NAME_REGEX.test(formData.firstname); // New: validate firstname
    const v5 = NAME_REGEX.test(formData.lastname);
    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      // If any validation fails, log the error and set the error message
      console.log("Invalid Entry");
      setErrMsg("Invalid Entry");
      return;
    }
    console.log("All validations passed. Attempting API call.");
    setIsLoading(true);

    //format for backend receiving data
    const payload = JSON.stringify({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      telephone: formData.telephone,
    });

    try {
      console.log("Sending payload:", payload);
      console.log("Type of payload:", typeof payload);
      //  Send data to the signup endpoint
      const response = await API.post("/users", payload, {
        headers: {
          "Content-type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      });

      setMessage("Signup successful! Redirecting...");

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPwd: "",
        telephone: "",
        acceptedTerms: false,
      }); // Reset form
      setIsLoading(false); // Stop the loader
      navigate("/login"); //now navigate
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
        console.log("No response from server:", error);
      } else if (error.response?.status === 400) {
        setErrMsg("Bad Request: Please check your input.");
      } else if (error.response?.status === 409) {
        setErrMsg("User with this email or phone number already exists.");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized: Please log in.");
      } else if (error.response?.status === 403) {
        setErrMsg(
          "Forbidden: You do not have permission to access this resource."
        );
      } else if (error.response?.status === 422) {
        //  specific error check
        console.error(
          "Unprocessable Content Error:",
          error.response.data.detail
        );

        // You can also try to display these details to the user
        // For example, if detail is an array of objects like [{loc: ['body', 'firstname'], msg: 'field required'}, ...]
        if (
          error.response?.data?.detail &&
          Array.isArray(error.response.data.detail)
        ) {
          const errorMessages = error.response.data.detail
            .map((err) => err.msg)
            .join(", ");
          setErrMsg(`Registration failed: ${errorMessages}`);
        } else {
          setErrMsg("Registration Failed: Invalid data provided.");
        }
      } else {
        setErrMsg("Registration Failed");
      }
      console.error("Signup error details:", error);
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
      <SignUpContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <RootGrid
            container
            direction={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {/* LEFT: User Story / Illustration */}

            <Grid
              item
              xs={12}
              md={4}
              component={StoryBox}
              // push story below form on xs
              order={{ xs: 2, md: 1, sm: 2 }}
            >
              <Typography variant="h3" gutterBottom>
                Why Dzidzi Invoice?
              </Typography>
              <Typography variant="body1" paragraph>
                • Manage orders, riders, and payments seamlessly. <br />
                • Auto-notify riders on payment. <br />• Beautiful, responsive
                interface.
              </Typography>
            </Grid>

            {/* right: Form */}

            <Grid
              item
              xs={12}
              md={8}
              component={Box}
              elevation={6}
              square
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 4,
                // mt: 5,
              }}
              order={{ xs: 1, md: 2, sm: 1 }}
              // direction={{ xs: "column-reverse", md: "row" }}
            >
              <Box
              // mt={-5}
              >
                <Card
                  variant="outlined"
                  className="signup-form-container"
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: 500 },
                    mx: "auto",
                    p: { xs: 1, sm: 4 },
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      width: "100%",
                      fontSize: "clamp(2rem, 10vw, 2.15rem)",
                    }}
                    align="center"
                  >
                    Signup
                  </Typography>

                  {isLoading && <LoadingScreen />}
                  {errMsg ? (
                    <MessageBox
                      refProp={errRef}
                      message={errMsg}
                      isError={true}
                    />
                  ) : message ? (
                    <MessageBox message={message} isError={false} />
                  ) : null}

                  <Grid
                    container
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    spacing={
                      2
                      //  xs: 2,
                      //  md: 3
                    }
                    // xs={12}
                    // md={12}
                    sx={{ width: "100%" }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      // sx={{ width: "40%" }}
                    >
                      <TextInputField
                        id="firstname"
                        label="First Name"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        valid={validFirstName}
                        onChange={handleChange}
                        placeholder="John"
                        icon={FaUser} // Or a suitable icon
                        required
                        refProp={firstNameRef} // Consider separate refs for better focus management, or adjust logic
                        focus={firstNameFocus} // Adjust focus logic as needed for multiple fields
                        onFocus={() => setFirstNameFocus(true)}
                        onBlur={() => setFirstNameFocus(false)}
                        error={
                          !validFirstName &&
                          firstNameFocus &&
                          formData.firstname.length > 0
                        } // Show error if invalid, focused, and not empty
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      //  sx={{ width: "40%" }}
                    >
                      <TextInputField
                        error={
                          !validLastName &&
                          lastNameFocus &&
                          formData.lastname.length > 0
                        } // Show error if invalid, focused, and not empty
                        id="lastname"
                        label="Last Name"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        valid={validLastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        icon={FaUser} // Or a suitable icon
                        required
                        refProp={lastNameRef} // Consider separate refs for better focus management, or adjust logic
                        focus={lastNameFocus} // Adjust focus logic as needed for multiple fields
                        onFocus={() => setLastNameFocus(true)}
                        onBlur={() => setLastNameFocus(false)}
                      />
                    </Grid>
                    {/* </Grid> */}
                    {/* <Grid
                    container
                    
                    spacing={{ xs: 2, md: 3 }}
                    xs={12}
                    md={12}
                    sx={{ width: "100%" }}
                    fullWidth
                  > */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      // sx={{ width: "40%" }}
                    >
                      <TextInputField
                        error={
                          !validTel && telFocus && formData.telephone.length > 0
                        }
                        id="telephone"
                        label="Phone Number"
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        valid={validTel}
                        onChange={handleChange}
                        placeholder="e.g.+1234567890"
                        icon={FaPhone}
                        required
                        refProp={telephoneRef}
                        focus={telFocus}
                        onFocus={() => setTelFocus(true)}
                        onBlur={() => setTelFocus(false)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      // sx={{ width: "40%" }}
                    >
                      <TextInputField
                        error={
                          !validEmail && emailFocus && formData.email.length > 0
                        }
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        valid={validEmail}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        icon={MdEmail}
                        required
                        refProp={emailRef}
                        focus={emailFocus}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                    </Grid>
                    {/* </Grid> */}
                    {/* <Grid
                    container
                    // component="form"
                    // onSubmit={handleSubmit}
                    // noValidate
                    spacing={{ xs: 2, md: 3 }}
                    xs={12}
                    md={6}
                    sx={{ width: "100%" }}
                    fullWidth
                  > */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      //sx={{ width: "40%" }}
                    >
                      <PasswordField
                        refProp={passwordRef}
                        type="password"
                        label="Password"
                        visible={pwdVisibility} //toggle type dynamically
                        name="password"
                        id="pwd"
                        value={formData.password}
                        valid={validPwd}
                        aria-label="Enter your password."
                        placeholder="Enter your password"
                        toggleVisibility={() =>
                          setPwdVisibility(!pwdVisibility)
                        }
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
                        focus={pwdFocus}
                        aria-describedby="pwdnote"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      //sx={{ width: "40%" }}
                    >
                      <PasswordField
                        type="password"
                        label="Confirm Password"
                        // fullWidth
                        visible={confirmPwdVisible}
                        name="confirmPwd"
                        id="confirmpwd"
                        value={formData.confirmPwd}
                        valid={
                          passwordsMatch &&
                          formData.confirmPwd.length > 0 &&
                          validPwd
                        } // It's valid if they match, not empty, AND the first password passes its own regex
                        error={
                          !passwordsMatch &&
                          (formData.confirmPwd || "").length > 0 // Error if not matching AND has text
                          //|| (confirmPwdFocus && formData.confirmPwd.length === 0) // OR error if focused and empty (optional: helps with "required" visual feedback)
                        }
                        onChange={handleChange}
                        aria-label="Confirm password."
                        placeholder="Re-enter password"
                        inputSx={{
                          paddingLeft: "12px",
                          paddingRight: "12px",
                          "&::placeholder": {
                            color: "rgba(0, 0, 0, 0.5)",
                            opacity: 1,
                            fontStyle: "italic",
                            paddingLeft: "8px",
                          },
                        }}
                        labelSx={{
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        }}
                        toggleVisibility={() =>
                          setConfirmPwdVisible(!confirmPwdVisible)
                        }
                        refProp={confirmPwdRef}
                        focus={confirmPwdFocus}
                        onFocus={() => setConfirmPwdFocus(true)}
                        onBlur={(e) => {
                          if (!e.relatedTarget) {
                            // Only hide if focus leaves the input entirely
                            setConfirmPwdFocus(false);
                          }
                        }}
                        aria-describedby="confirmpwdnote"
                        showValidityIcon={true}
                      />
                      {confirmPwdFocus &&
                        (formData.confirmPwd || "").length > 0 && (
                          <FormHelperText
                            sx={{
                              color: passwordsMatch
                                ? "success.main"
                                : "error.main",
                              marginTop: -1,
                              marginBottom: 0.6,
                            }}
                          >
                            {passwordsMatch
                              ? "Passwords match"
                              : "Passwords do not match"}
                          </FormHelperText>
                        )}
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // marginTop: "-30px",
                      mt: 1,
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "11px",
                        },
                      }}
                      label={
                        <>
                          I agree to the&nbsp;
                          <Link href="" target="_blank" rel="noopener">
                            Terms and Conditions
                          </Link>
                        </>
                      }
                      control={
                        <Checkbox
                          sx={{
                            transform: "scale(0.7)", // scales the checkbox down
                            //padding: "4px",
                          }}
                          name="acceptedTerms"
                          checked={formData.acceptedTerms}
                          onChange={handleChange}
                        />
                      }
                    />
                  </Box>

                  <FormButton
                    onClick={handleSubmit}
                    disabled={
                      !validEmail ||
                      !validPwd ||
                      !validFirstName ||
                      !validLastName ||
                      !passwordsMatch ||
                      !formData.acceptedTerms
                    }
                    text="Signup"
                    type="submit"
                    variant="contained"
                  />
                  {/* </Grid> */}

                  <Divider sx={{ my: 2 }}>
                    <Typography sx={{ color: "text.secondary" }}>or</Typography>
                  </Divider>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => alert("Sign up with Google")}
                      startIcon={<GoogleIcon />}
                    >
                      Sign up with Google
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => alert("Sign up with Facebook")}
                      startIcon={<FacebookIcon />}
                    >
                      Sign up with Facebook
                    </Button>
                    <Box>
                      <Typography sx={{ textAlign: "center" }}>
                        Already have an account? {""}
                        <Link to="/login" variant="body 2">
                          Login
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </RootGrid>
        </Container>
        <div className="terms-container"></div>
      </SignUpContainer>
    </>
  );
}

export default SignUpPage;
