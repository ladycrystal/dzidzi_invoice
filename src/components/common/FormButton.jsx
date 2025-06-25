import React from "react";
import { Button } from "@mui/material";

const FormButton = ({ variant, text, color, disabled, onClick, type }) => {
  return (
    <Button
      variant={variant}
      type={type}
      disabled={disabled}
      color={color}
      onClick={onClick}
      fullWidth={true}
      sx={{
        textTransform: "none",
        fontSize: "1rem",
        padding: "10px 20px",
        marginTop: "10px",
        width: "70%",
        marginLeft: "10%",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        ...(variant === "contained" && {
          backgroundColor: color === "primary" ? "#1976d2" : "#006af5",
          "&:active": {
            backgroundColor: color === "primary" ? "#115293" : "#115293",
            transform: "scale(0.98)", // Slightly shrink on click
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          },
        }),
      }}
    >
      {text}
    </Button>
  );
};

export default FormButton;
