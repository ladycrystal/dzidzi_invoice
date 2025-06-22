import React, { useState } from "react";
import Footer from "../Footer/Footer";
import SideBar from "../SideBar/SideBar";
import DashboardScreen from "../../screens/Dashboard/DashboardScreen";
import { FaUser, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      {/* Dashboard with Menu Button */}
      <DashboardScreen onToggleSidebar={toggleSidebar} />
      {/* Sidebar Drawer */}
      <SideBar
        isSideBar={isSidebarOpen}
        isHomePage={true}
        toggleSideBar={toggleSidebar}
      />
      {/* <Footer /> */}
    </>
  );
}

export default Home;
