import React from "react";

const LoadingScreen = ({ fadeOut }) => {
  return (
    <div
      className={`fullscreen-spinner 
        ${fadeOut ? "fade-out" : ""}
         d-flex flex-column  justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-75 z-3`}
    >
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
