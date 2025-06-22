import { TextField, InputAdornment, Box, IconButton } from "@mui/material";
import React from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { styled } from "@mui/system";

// styled component for the background icon wrapper
// const BackgroundIconWrapper = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   right: theme?.spacing ? theme.spacing(1.5) : "14px", // Adjust this for initial horizontal position of the icon
//   top: "50%",
//   transform: "translateY(-50%)",
//   color: theme?.palette?.text?.disabled || "#bdbdbd", // Subtle color for background icon
//   opacity: 0.8, // Make it semi-transparent
//   // pointerEvents: "none", // Ensure it doesn't interfere with input clicks
//   zIndex: 1, // Place it behind the text content but above the TextField's background
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "1.5rem", // Adjust icon size as needed
// }));

function PasswordField({
  id,
  name,
  value,
  label,
  placeholder,
  valid,
  onChange,
  onFocus,
  onBlur,
  visible,
  toggleVisibility,
  focus,
  ariaDescribedBy = "",
  error,
  helperText,
  inputSx, // Pass through inputSx for custom input styling
  labelSx, // Pass through labelSx for custom label styling
  refProp,
  showValidityIcon = true, // controls whether to show checkmark/times
}) {
  return (
    <div className="form-group">
      {showValidityIcon && (
        <>
          <span className={valid ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={valid || !value ? "hide" : "invalid"}>
            <FaTimes />
          </span>
        </>
      )}

      <div className="form-group-style" style={{ width: "100%" }}>
        <TextField
          type={visible ? "text" : "password"} //toggle type dynamically
          id={id}
          inputRef={refProp}
          label={label}
          variant="standard"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={label}
          aria-invalid={valid ? "false" : "true"}
          aria-describedby={ariaDescribedBy}
          className="form-input"
          required
          // focus={focus}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    //onClick={toggleVisibility}
                    onMouseDown={(e) => e.preventDefault()} // Prevents blurring input on button click
                    // edge="end"
                    className="toggle-password-icon" // Keep this class for onBlur logic
                    disableRipple // Disables the "ink ripple" effect on click
                    disableFocusRipple // Disables the ripple effect when gaining keyboard focus
                    disableTouchRipple // Disables the ripple effect on touch devices
                    disableTouchHighlight // Disables the highlight effect on touch devices
                    sx={{
                      // Optional: add some padding/margin to the button if needed
                      mr: -1, // Adjust this for tighter/looser spacing to the right edge if necessary
                      color: (theme) => theme.palette.text.secondary, // Make eye icon less prominent if desired
                      opacity: 0.7, // Make it slightly transparent
                    }}
                  >
                    {visible ? (
                      <FaEyeSlash
                        className="toggle-password-icon form-icon"
                        tabIndex="0"
                        onClick={toggleVisibility}
                      />
                    ) : (
                      <FaEye
                        className="toggle-password-icon form-icon"
                        tabIndex="0"
                        onClick={toggleVisibility}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
    </div>
  );
}

export default PasswordField;
