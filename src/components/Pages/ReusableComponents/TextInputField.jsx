import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function TextInputField({
  id,
  type = "text",
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
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
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
      </label>
      <div className="form-group-style">
        <input
          type={type}
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
          autoComplete={autoComplete}
          className="form-input"
          ref={refProp}
          focus={focus}
          required={required}
        />
        {Icon && <Icon className="form-icon" />}
      </div>
    </div>
  );
}

export default TextInputField;
