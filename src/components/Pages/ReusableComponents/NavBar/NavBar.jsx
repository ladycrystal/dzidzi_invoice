import React from "react";
import "./NavBar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { useLocation } from "react-router-dom";

const NavBar = ({
  title = "Home",
  logoSrc = "",
  showSearch = true,
  showProfile = true,
  showNotifications = true,
  onToggleSidebar,
  SidebarComponent = null,
  isSidebarOpen = false,
  Profileicon: PIcon,
  Searchicon: SIcon,
  Notificationicon: NIcon,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  return (
    <>
      <nav className="nav-container">
        <div className="hamburger-container nav-left" onClick={onToggleSidebar}>
          <RxHamburgerMenu className="hamburger-icon" />
          <p className="home">{title}</p>
        </div>

        <img src={logoSrc} alt="logo" className="nav-middle" />

        <div className="nav-right">
          {showProfile && (
            <div className="icon-container">
              <span className="profile-icon">{<PIcon />}</span>
            </div>
          )}
          {showSearch && (
            <div className="icon-container">
              <span className="search-icon">{<SIcon />}</span>
            </div>
          )}
          {showNotifications && (
            <div className="icon-container">
              <span className="notification-icon">{<NIcon />}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Optional Sidebar */}
      {SidebarComponent && (
        <SidebarComponent
          isSideBar={isSidebarOpen}
          isHomePage={isHomePage}
          toggleSideBar={onToggleSidebar}
        />
      )}
    </>
  );
};

export default NavBar;
