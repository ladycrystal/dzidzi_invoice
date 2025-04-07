import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

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
            <li className="sidebar-list">
              <Link to="/home">Dashboard</Link>
            </li>
            <li className="sidebar-list">
              <Link to="/invoice">Invoices</Link>
            </li>
            <li className="sidebar-list">
              <Link to="/salaries">Salaries</Link>
            </li>
            <li className="sidebar-list">
              <Link to="/settings">Customers</Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default SideBar;
