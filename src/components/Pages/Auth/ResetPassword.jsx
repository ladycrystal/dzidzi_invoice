import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

import PasswordField from "../../common/PasswordField";
import MessageBox from "../../common/MessageBox";
import FormButton from "../../common/FormButton";
import LoadingScreen from "../../common/LoadingScreen";
import { Link } from "react-router-dom";
//import FormHelperText from "@mui/material";
import API from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

// Reusing styled components from ForgotPassword for consistency
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
    maxWidth: "450px", // A reasonable max-width for auth forms
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
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
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

function ResetPassword() {
  const { token } = useParams(); // Get the reset token from the URL
  const navigate = useNavigate();

  const passwordRef = useRef();
  const confirmPwdRef = useRef();
  const errRef = useRef();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwdVisibility, setPwdVisibility] = useState(false); // For new password
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(false); // For confirm password

  const [validPwd, setValidPwd] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [pwdFocus, setPwdFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password regex (reusing from SignUpPage)
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$]).{8,24}$/;

  useEffect(() => {
    passwordRef.current.focus();
    // You could add an initial API call here to validate the token
    // if your backend supports a separate validation endpoint.
    // If the token is invalid at this stage, you'd show an error.
  }, []);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(newPassword));
    setPasswordsMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
    setMessage("");
  }, [newPassword, confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Helper functions for error messages
  const getErrorMessage = (error) => {
    if (!error?.response) {
      return "No server response. Please try again later.";
    }
    const status = error.response?.status;
    switch (status) {
      case 401:
        return "Invalid or expired reset token. Please request a new link.";
      case 400:
        return "Passwords do not match or other input error from server.";
      case 422:
        return "New password does not meet strength requirements as per server rules.";
      default:
        return "Failed to reset password. An unexpected error occurred.";
    }
  };

  const handleResetError = (error) => {
    console.error(
      "Password reset failed:",
      error.response && error.response.data
        ? error.response.data
        : error.message
    );
    setErrMsg(getErrorMessage(error));
    setIsLoading(false);
    if (errRef.current) errRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validPwd) {
      setErrMsg("Password does not meet strength requirements.");
      if (errRef.current) errRef.current.focus();
      return;
    }
    if (!passwordsMatch) {
      setErrMsg("Passwords do not match.");
      if (errRef.current) errRef.current.focus();
      return;
    }

    setIsLoading(true);
    setErrMsg("");

    try {
      await API.post(
        "/reset-password",
        JSON.stringify({
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(
        "Your password has been successfully reset. Redirecting to login..."
      );
      setNewPassword("");
      setConfirmPassword("");
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      handleResetError(error);
    }
  };

  return (
    <AuthContainer>
      <Container component="main" maxWidth="xs">
        <AuthCard variant="outlined">
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
            Reset Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Enter your new password below.
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
            noValidate
            sx={{ mt: 1 }}
          >
            <PasswordField
              refProp={passwordRef}
              type="password"
              label="New Password"
              visible={pwdVisibility}
              name="newPassword"
              id="new_pwd"
              value={newPassword}
              valid={validPwd}
              aria-label="Enter your new password."
              placeholder="Enter your new password"
              toggleVisibility={() => setPwdVisibility(!pwdVisibility)}
              onChange={handleChange}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              focus={pwdFocus}
              aria-describedby="new_pwdnote"
              error={!validPwd && pwdFocus && newPassword.length > 0}
            />
            {pwdFocus && newPassword && !validPwd && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                8-24 chars. Must include uppercase, lowercase, number and
                special character.
              </Typography>
            )}
            <PasswordField
              refProp={confirmPwdRef}
              type="password"
              label="Confirm New Password"
              visible={confirmPwdVisible}
              name="confirmPassword"
              id="confirm_new_pwd"
              value={confirmPassword}
              valid={passwordsMatch && confirmPassword.length > 0 && validPwd} // Only valid if matches AND meets strength
              aria-label="Confirm your new password."
              placeholder="Confirm your new password"
              toggleVisibility={() => setConfirmPwdVisible(!confirmPwdVisible)}
              onChange={handleChange}
              onFocus={() => setConfirmPwdFocus(true)}
              onBlur={() => setConfirmPwdFocus(false)}
              focus={confirmPwdFocus}
              aria-describedby="confirm_new_pwdnote"
              error={!passwordsMatch && confirmPassword.length > 0} // Error only if not matching and has text
              showValidityIcon={true} // Ensure validation icons are shown
            />
            {
              confirmPwdFocus && confirmPassword.length > 0
              //&& (
              //   <FormHelperText
              //     sx={{
              //       color: passwordsMatch ? "success.main" : "error.main",
              //       mt: -1,
              //       mb: 0.6,
              //     }}
              //   >
              //     {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              //   </FormHelperText>
              // )
            }
            <FormButton
              onClick={handleSubmit}
              disabled={!validPwd || !passwordsMatch || isLoading}
              text="Reset Password"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              Remembered your password?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
}

export default ResetPassword;
