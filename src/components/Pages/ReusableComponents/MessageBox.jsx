import React from "react";

function MessageBox({ refProp, message, isError = true }) {
  return (
    <p
      refProp={refProp}
      className={
        message ? (isError ? "errmsg" : "success-message") : "offscreen"
      }
      aria-live="assertive"
    >
      {message}
    </p>
  );
}

export default MessageBox;
