import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
//import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { path } from "motion/react-client";

const SideBar = ({ isSideBar, isHomePage, toggleSideBar }) => {
  const DrawerList = (
    <Box
      sx={{ width: 250, height: "90%" }}
      role="presentation"
      onClick={toggleSideBar}
      onKeyDown={(e) => {
        if (e.key === "Escape") toggleSideBar();
      }}
    >
      <List sx={{ marginTop: 10 }}>
        {[
          { text: "Home", path: "/home" },
          { text: "Invoice", path: "/myinvoicemanagement" },
          { text: "Bank account", path: "/sendemail" },
          { text: "Drafts", path: "/drafts" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* animation effect only when not on dashboard screen
      {!isHomePage && isSideBar && (
        <div className="sidebar-overlay" onClick={toggleSideBar}></div>
      )} */}

      <section
        className={`sidebar ${isSideBar ? "sidebar-open" : ""} ${
          isHomePage ? "sidebar-home" : ""
        }`}
      >
        <div>
          <Drawer open={isSideBar} onClose={toggleSideBar}>
            {DrawerList}
          </Drawer>
        </div>
      </section>
    </>
  );
};

export default SideBar;
