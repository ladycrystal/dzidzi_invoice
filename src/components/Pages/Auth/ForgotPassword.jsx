import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { MdEmail } from "react-icons/md";
import TextInputField from "../../common/TextInputField";
import MessageBox from "../../common/MessageBox";
import FormButton from "../../common/FormButton";
import LoadingScreen from "../../common/LoadingScreen";
import useLoadingError from "../../../utils/hooks/useLoadingError";
// import { validateEmail } from "../../../utils/validators";
import API from "../../../api/axios";
import { Link } from "react-router-dom";

const AuthCard = styled(MuiCard)(({ theme }) => ({
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
    maxWidth: "450px",
  },
}));

const AuthContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

function ForgotPassword() {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setMessage("");
  }, [email]);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail) {
      setErrMsg("Please enter a valid email address.");
      errRef.current?.focus();
      return;
    }
    setIsLoading(true);
    setErrMsg("");
    try {
      await API.post("/forgot-password", JSON.stringify({ email }), {
        headers: { "Content-Type": "application/json" },
      });
      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
      setEmail("");
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No server response. Please try again later.");
      } else if (error.response?.status === 422) {
        setErrMsg("Invalid email format. Please check your email.");
      } else {
        setErrMsg("Failed to send reset link. Please try again.");
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // DRY: Use loading/error hook
  const loadingError = useLoadingError({ loading: isLoading, error: errMsg });

  return (
    <AuthContainer>
      <Container component="main" maxWidth="xs">
        <AuthCard variant="outlined">
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>

          {loadingError ||
            (message && <MessageBox message={message} isError={false} />)}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextInputField
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              valid={validEmail}
              onChange={handleChange}
              placeholder="your.email@example.com"
              icon={MdEmail}
              required
              refProp={emailRef}
              focus={emailFocus}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={!validEmail && emailFocus && email.length > 0}
            />
            <FormButton
              onClick={handleSubmit}
              disabled={!validEmail || isLoading}
              text="Send Reset Link"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Back to Login
            </Link>
          </Box>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
}

export default ForgotPassword;
