import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

function LogoutPage() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutMessage, setLogoutMessage] = useState("Logging you out...");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Simulate an API call to your backend logout endpoint
        // In a real application, this would invalidate the user's session/token on the server.
        // Example: await API.post('/logout'); // Or a specific user logout endpoint
        console.log("Simulating logout API call...");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

        // --- Client-side logout logic ---
        // Clear authentication tokens from localStorage, sessionStorage, or state management
        localStorage.removeItem("authToken"); // Example: clear JWT token
        sessionStorage.removeItem("userSession"); // Example: clear session data
        // If using a context/state management for user, dispatch a logout action
        // e.g., dispatch({ type: 'LOGOUT' });

        setLogoutMessage("Logged out successfully. Redirecting...");
        setIsLoggingOut(false);

        // Redirect to the login page after a short delay
        setTimeout(() => {
          navigate("/login"); // Navigate to your login page
        }, 500);
      } catch (error) {
        console.error("Logout failed:", error);
        setLogoutMessage("Logout failed. Please try again.");
        setIsLoggingOut(false);
        // Optionally, redirect to login anyway if a server error occurred but client-side tokens are cleared
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    performLogout();
  }, [navigate]); // navigate is in dependency array to avoid lint warnings, though it's stable

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        p: 3,
      }}
    >
      {isLoggingOut ? (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">{logoutMessage}</Typography>
        </>
      ) : (
        <Typography variant="h6">{logoutMessage}</Typography>
      )}
    </Box>
  );
}

export default LogoutPage;
