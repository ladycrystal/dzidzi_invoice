import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Box, TextField, InputAdornment } from "@mui/material";
import { styled } from "@mui/system";

// styled component for the background icon wrapper
const BackgroundIconWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme?.spacing ? theme.spacing(1.5) : "12px", // Adjust this for initial horizontal position of the icon
  top: "50%",
  transform: "translateY(-50%)",
  color: theme?.palette?.text?.disabled || "#bdbdbd", // Subtle color for background icon
  opacity: 0.3, // Make it semi-transparent
  pointerEvents: "none", // Ensure it doesn't interfere with input clicks
  zIndex: 1, // Place it behind the text content but above the TextField's background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem", // Adjust icon size as needed
}));

function TextInputField({
  type,
  id,
  name,
  value,
  label,
  placeholder,
  icon: Icon,
  valid,
  onChange,
  onFocus,
  onBlur,
  focus,
  autoComplete = "off",
  required = true,
  refProp,
  ariaDescribedBy = "",
  showValidationIcons = true,
  error = false,
  readOnly = false,
  sx,
}) {
  // Determine if the field should have extra left padding for the icon
  const hasBackgroundIcon = !!Icon;
  const iconPadding = hasBackgroundIcon ? "5px" : undefined; // ~spacing(3) + icon size

  return (
    <Box className="form-group" sx={{ position: "relative" }}>
      {showValidationIcons && (
        <>
          <span className={valid ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={valid || !value ? "hide" : "invalid"}>
            <FaTimes />
          </span>
        </>
      )}

      <div className="form-group-style">
        <TextField
          valid={valid}
          error={error}
          id={id}
          label={label}
          variant="standard"
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={label}
          aria-invalid={valid ? "false" : "true"}
          aria-describedby={ariaDescribedBy}
          autoComplete={autoComplete}
          className="form-input"
          inputRef={refProp}
          focus={focus}
          required={required}
          slotProps={{
            input: {
              readOnly: readOnly,
              endAdornment: hasBackgroundIcon ? (
                <BackgroundIconWrapper>
                  <InputAdornment position="end">
                    <Icon />
                  </InputAdornment>
                </BackgroundIconWrapper>
              ) : undefined,
            },
          }}
          sx={{
            width: "100%", // TextField takes full width
            // Target the root of the input element which wraps the actual <input>
            "& .MuiInputBase-root": {
              position: "relative", // Needed for absolute positioning of the icon
              paddingLeft: iconPadding, // Add left padding to the input area if icon is present
            },
            // Adjust the label position to align with the new input text start
            "& .MuiInputLabel-root": {
              "&:not(.MuiInputLabel-shrink)": {
                marginLeft: hasBackgroundIcon ? "5px" : undefined, // Shift label to align with text
              },
              // When the label IS shrunk (i.e., above the input)
              "&.MuiInputLabel-shrink": {
                // Adjust the transform-x value as needed to align with padding
                // Default is usually 'translate(0, -1.5px) scale(0.75)' for standard variant
                // You might need to add a small amount, e.g., 'translate(20px, -1.5px) scale(0.75)'
                // if the default spacing doesn't look right.
                // For now, I'm omitting a change here to let MUI handle its default shrink behavior.
              },
            },
            // Adjust the placeholder position if needed, to align with the text
            "& .MuiInputBase-input::placeholder": {
              paddingLeft: hasBackgroundIcon ? "0px" : undefined, // Placeholder itself doesn't need extra padding if input has it
              color: "rgba(0, 0, 0, 0.5)",
              opacity: 1,
            },
          }}
        />
      </div>
    </Box>
  );
}

export default TextInputField;
