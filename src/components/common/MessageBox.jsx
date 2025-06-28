import React from "react";

function MessageBox({ refProp, message, isError = true, style }) {
  return (
    <p
      ref={refProp}
      className={
        message ? (isError ? "errmsg" : "success-message") : "offscreen"
      }
      aria-live="assertive"
      style={style}
    >
      {message}
    </p>
  );
}

export default MessageBox;
