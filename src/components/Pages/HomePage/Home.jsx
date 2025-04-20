import React, { useState } from "react";
import NavBar from "../ReusableComponents/NavBar/NavBar";
import Footer from "../Footer/Footer";
import SideBar from "../SideBar/SideBar";
import DashboardScreen from "../../screens/Dashboard/DashboardScreen";
import { FaUser, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <NavBar
        title="Dashboard"
        logoSrc="/assets/logo.png"
        showProfile
        showSearch
        showNotifications
        isSidebarOpen={showSidebar}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        SidebarComponent={SideBar}
        Profileicon={FaUser}
        Searchicon={FaSearch}
        Notificationicon={IoIosNotifications}
      />

      <DashboardScreen />

      <Footer />
    </>
  );
}

export default Home;
