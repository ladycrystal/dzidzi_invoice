import React, { useState } from "react";
import "./NavBar.css";
import SideBar from "../SideBar/SideBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUser, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const [isSideBar, setIsSideBar] = useState(false);
  const location = useLocation(); //gets current route information

  //detecting if we are on the overview page
  const isHomePage = location.pathname === "/home";

  //toggle sidebar on and off
  function toggleSideBar() {
    setIsSideBar(!isSideBar);
  }

  return (
    <>
      <nav className="nav-container">
        <div className="hamburger-container nav-left" onClick={toggleSideBar}>
          <RxHamburgerMenu className="hamburger-icon" />
          <p className="home">Home</p>
        </div>

        <img src="" alt="dzidzi-logo" className="nav-middle" />
        <div className="nav-right">
          <div className="icon-container">
            <FaUser className="profile-icon" />
          </div>
          <div className="icon-container">
            <FaSearch className="search-icon" />
          </div>
          <div className="icon-container">
            <IoIosNotifications className="notification-icon" />
          </div>
        </div>
      </nav>
      {/* Sidebar with props */}
      <SideBar
        isSideBar={isSideBar}
        isHomePage={isHomePage}
        toggleSideBar={toggleSideBar}
      />
    </>
  );
};

export default NavBar;
