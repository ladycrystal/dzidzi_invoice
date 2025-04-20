import React from "react";

const FormButton = ({ text, disabled }) => {
  return (
    <button type="submit" className="signup-button" disabled={disabled}>
      {text}
    </button>
  );
};

export default FormButton;
