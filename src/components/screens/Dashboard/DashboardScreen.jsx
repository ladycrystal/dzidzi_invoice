import React from "react";
import DateSelector from "../DateSelector/DateSelector";
import "./Dashboard.css";

const DashboardScreen = () => {
  return (
    <section className="dashboard-container">
      <h3>Hello, Name</h3>
      <div className="overview">
        <p>Overview</p>
        <DateSelector />
        <ul>
          <li className="overview-list">Total Earnings:</li>
          <li className="overview-list">Completed Deliveries:</li>
          <li className="overview-list">Upcoming Deliveries:</li>
        </ul>
      </div>
      <hr />
    </section>
  );
};

export default DashboardScreen;
