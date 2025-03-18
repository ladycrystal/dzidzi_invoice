import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import "../screens/Dashboard/Dashboard.css";

function Home() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <DashboardScreen />
      </div>
      <Footer />
    </>
  );
}

export default Home;
