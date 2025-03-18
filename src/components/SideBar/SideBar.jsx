import React from "react";
import "./SideBar.css";

const SideBar = ({ isSideBar, isHomePage, toggleSideBar }) => {
  return (
    <>
      {/* animation effect only when not on dashboard screen */}
      {!isHomePage && isSideBar && (
        <div className="sidebar-overlay" onClick={toggleSideBar}></div>
      )}

      <section
        className={`sidebar ${isSideBar ? "sidebar-open" : ""} ${
          isHomePage ? "sidebar-home" : ""
        }`}
      >
        <div className="sidebar-container">
          <ul className="ul-container">
            <li className="sidebar-list">Home</li>
            <li className="sidebar-list">Invoices</li>
            <li className="sidebar-list">Reports</li>
            <li className="sidebar-list">Settings</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default SideBar;
