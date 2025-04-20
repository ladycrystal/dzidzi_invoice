import React from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

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
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        <span className={valid ? "valid" : "hide"}>
          <FaCheck />
        </span>
        <span className={valid || !value ? "hide" : "invalid"}>
          <FaTimes />
        </span>
      </label>

      <div className="form-group-style">
        <input
          type={visible ? "text" : "password"} //toggle type dynamically
          id={id}
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
          focus={focus}
        />
        {/* Eye Icon to Toggle Password Visibility */}
        {visible ? (
          <FaEyeSlash
            className="toggle-password-icon form-icon"
            tabIndex="0" //does not trigger onblur immediately
            onClick={toggleVisibility}
          />
        ) : (
          <FaEye
            className="toggle-password-icon form-icon"
            tabIndex="0"
            onClick={toggleVisibility}
          />
        )}
      </div>
    </div>
  );
}

export default PasswordField;
