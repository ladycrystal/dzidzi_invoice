import React, { useState } from "react";
import NavBar from "../Pages/NavBar/NavBar";
import SideBar from "../Pages/SideBar/SideBar";
import Footer from "../Pages/Footer/Footer";
import Box from "@mui/material/Box";

const Layout = ({
  children,
  navBarProps = {},
  showFooter = true,
  showSidebar = true,
  sidebarProps = {},
  contentSx = {},
}) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const handleToggleSidebar = () => setIsSideBarOpen((prev) => !prev);

  return (
    <>
      <NavBar
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSideBarOpen}
        {...navBarProps}
      />
      <Box
        sx={{
          pt: { xs: "56px", sm: "64px" },
          minHeight: "100vh",
          backgroundColor: "background.default",
          pb: 10,
          width: "100%",
          maxWidth: "100vw",
          margin: "0 auto",
          boxSizing: "border-box",
          ...contentSx,
        }}
      >
        {children}
      </Box>
      {showFooter && <Footer />}
      {showSidebar && (
        <SideBar
          isSideBar={isSideBarOpen}
          toggleSideBar={handleToggleSidebar}
          {...sidebarProps}
        />
      )}
    </>
  );
};

export default Layout;
