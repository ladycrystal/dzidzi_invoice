import React, { useEffect, useState, useRef } from "react";
import TextInputField from "../ReusableComponents/TextInputField";
import PasswordField from "../ReusableComponents/PasswordField";
import MessageBox from "../ReusableComponents/MessageBox";
import LoadingScreen from "../../screens/LoadingScreen";
import FormButton from "../ReusableComponents/FormButton";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Stack,
  Box,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { GoogleIcon, FacebookIcon } from "../../utils/CustomIcons";
//import AppTheme from "../../utils/AppTheme";
import ColorModeSelect from "../../utils/ColorModeSelect";

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
    width: "450px",
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
    display: "block",
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

const RootGrid = styled(Grid)(({ theme }) => ({
  minHeight: "100vh",
}));
//ON this page, the email name is set to username since the backend expects a username(in this case email is used for validation) for validation
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
      const response = await API.post("/auth/token", payload, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      });

      // Store  user info
      // localStorage.setItem("userId", response.data.id);

      if (response.data.access_token) {
        // Store token
        localStorage.setItem("token", response.data.access_token);

        setMessage("Login successful!");

        // const addressCompleted =
        //   localStorage.getItem("addressCompleted") === "true";
        // fetch user info
        const userResponse = await API.get("/users/me");
        const userAddress = userResponse.data.address; // Get the address object
        //identify returning users
        const hasAddress =
          userAddress !== null && Object.keys(userAddress).length > 0;

        if (hasAddress) {
          navigate("/home");
        } else {
          navigate("/getaddress");
        }

        setFormData({ username: "", password: "" }); // Reset login form
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
        console.log("error: ", error);
      } else if (error.response?.status === 401) {
        setErrMsg("Wrong email or password");
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
      <SignUpContainer className="glass">
        <RootGrid
          container
          spacing={2}
          direction={{ xs: "column-reverse", md: "row" }}
          justifyContent="center"
          alignItems="center"
        >
          {/* Leftside of the screen */}
          <Grid
            item
            xs={12}
            md={6}
            component={StoryBox}
            // push story below form on xs
            order={{ xs: 2, md: 1 }}
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

          {/* rightside of the screen */}
          <Grid
            item
            xs={12}
            md={6}
            component={StoryBox}
            elevation={6}
            square
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
            }}
            order={{ xs: 1, md: 2 }}
            direction={{ xs: "column-reverse", md: "row" }}
          >
            <Card variant="outlined" className="signup-form-container">
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  width: "100%",
                  fontSize: "clamp(2rem, 10vw, 2.15rem)",
                }}
                align="center"
              >
                Login
              </Typography>

              {isLoading && <LoadingScreen />}
              {errMsg ? (
                <MessageBox refProp={errRef} message={errMsg} isError={true} />
              ) : message ? (
                <MessageBox message={message} isError={false} />
              ) : null}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextInputField
                  id="email"
                  error={
                    !validEmail && emailFocus && formData.username.length > 0
                  }
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
                  type="password"
                  label="Password"
                  visible={pwdVisibility} //toggle type dynamically
                  name="password"
                  id="pwd"
                  value={formData.password}
                  valid={validPwd}
                  aria-label="Enter your password."
                  placeholder="Enter your password"
                  toggleVisibility={() => setPwdVisibility(!pwdVisibility)}
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "-30px",
                  }}
                >
                  <FormControlLabel
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "11px",
                      },
                    }}
                    label="Remember me"
                    control={
                      <Checkbox
                        sx={{
                          transform: "scale(0.7)", // scales the checkbox down
                          //padding: "4px",
                        }}
                        // checked={handleChange}
                        onChange={handleChange}
                      />
                    }
                  />
                  <Typography sx={{ fontSize: "11px" }}>
                    <Link to="">Forgot password?</Link>
                  </Typography>
                </Box>

                <FormButton
                  disabled={!validEmail || !validPwd}
                  text="Login"
                  type="submit"
                  variant="contained"
                />
              </Box>
              <Divider>
                <Typography sx={{ color: "text.secondary" }}>or</Typography>
              </Divider>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => alert("Login with Google")}
                  startIcon={<GoogleIcon />}
                >
                  Login with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => alert("Login with Facebook")}
                  startIcon={<FacebookIcon />}
                >
                  Login with Facebook
                </Button>
                <Box>
                  <Typography sx={{ textAlign: "center" }}>
                    Don't have an account? {""}
                    <Link to="/signup" variant="body 2">
                      Register
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </RootGrid>
      </SignUpContainer>
    </>
  );
}

export default LoginPage;
