import React, { useState } from "react";
import "./NavBar.css"; // Keep your existing CSS
import { RxHamburgerMenu } from "react-icons/rx"; // For the hamburger icon
import { Link, useLocation } from "react-router-dom"; // For navigation (Link is used internally for example)

// Material-UI Imports (moved from DashboardScreen)
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

// Material-UI Icons (moved from DashboardScreen)
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle"; // The Profile Icon
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

// Import useNavigate here if you want to add navigation from MenuItems within NavBar
import { useNavigate } from "react-router-dom";

const NavBar = ({
  title = "Home", // Title for the hamburger menu section
  logoSrc = "", // Logo source
  showSearch = true,
  showProfile = true,
  showNotifications = true,
  onToggleSidebar, // Function passed from parent to toggle sidebar
  // SidebarComponent, // Removed this prop, Sidebar will be rendered by DashboardScreen
  isSidebarOpen, // Boolean state passed from parent to indicate sidebar status
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home"; // Example usage, might not be needed in NavBar directly

  const navigate = useNavigate(); // Initialize useNavigate for menu item actions

  // State for the profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* AppBar, Toolbar, and all icons/menu logic */}
      <Box sx={{ flexGrow: 1, width: "100vw", className: "container" }}>
        <AppBar
          position="sticky"
          sx={{
            top: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above sidebar/drawer if any
            // backgroundColor: (theme) => theme.palette.background.paper, // Optional: match your theme
            //color: (theme) => theme.palette.text.primary, // Optional: match your theme
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", // Optional: subtle shadow
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
            className="container2"
          >
            {/* Hamburger Menu (from original NavBar) */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={onToggleSidebar} // Use the passed prop
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {logoSrc ? (
                <img src={logoSrc} alt="logo" className="nav-middle" />
              ) : (
                "LOGO"
              )}
            </Typography>

            {/* Right-hand side icons and profile menu */}
            <Box sx={{ flexGrow: 1, display: "contents" }}>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {showSearch && ( // Conditional rendering for Search (using MailIcon as placeholder from Dashboard)
                  <IconButton
                    size="large"
                    aria-label="show new mails" // Reusing label, might want to change
                    color="inherit"
                  >
                    <Badge badgeContent={4} color="error">
                      <MailIcon />{" "}
                      {/* Assuming this was intended for Search or a general mail icon */}
                    </Badge>
                  </IconButton>
                )}

                {showNotifications && ( // Conditional rendering for Notifications
                  <IconButton
                    size="large"
                    aria-label="show new notifications"
                    color="inherit"
                  >
                    <Badge badgeContent={17} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                )}

                {showProfile && ( // Conditional rendering for Profile Icon and Menu
                  <Tooltip title="Profile">
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleClick} // Opens the menu
                      color="inherit"
                    >
                      <AccountCircle /> {/* The main profile icon */}
                    </IconButton>
                  </Tooltip>
                )}

                {/* The Profile Menu component */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose} // Closes menu when any item is clicked
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* Menu Items with navigation */}
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/addresssettings"); // Navigate to address settings
                    }}
                  >
                    <Avatar /> Profile
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                  </MenuItem> */}
                  <Divider />
                  {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem> */}
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default NavBar;
