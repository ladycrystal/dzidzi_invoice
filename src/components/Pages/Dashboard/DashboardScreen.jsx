import React, { useEffect, useState } from "react";

import Layout from "../Layout";
import "./Dashboard.css";
import API from "../../../api/axios";

import YearlyEarningsChart from "../../charts/YearlyEarningsChart";
import MonthlyEarningsBarChart from "../../charts/MonthlyEarningsBarChart";
// Importing Material-UI components and styles
import { styled, useTheme } from "@mui/material/styles"; // Import useTheme

import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // For formatting dates

// Import NavBar component
import NavBar from "../NavBar/NavBar";
import { Grid, Paper, Box, Typography, Button } from "@mui/material";

// Styled components for consistent UI elements (optional, but good practice)
const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
  minHeight: "100%", // Ensure all cards in a grid have equal height
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // Distribute space
}));

const CardHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const DashboardScreen = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access the Material-UI theme

  // --- Simulated Data States ---
  // Sample data for the bar chart
  // In a real application, this data would typically come from an API call
  // or a global state management system.
  const [currentWeekEarnings, setCurrentWeekEarnings] = useState(0);
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState(0);
  const [pendingInvoicesCount, setPendingInvoicesCount] = useState(0);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);
  const [latestInvoice, setLatestInvoice] = useState(null);

  //  Yearly earnings mockdata for the line chart
  const [yearlyEarningsData, setYearlyEarningsData] = useState([
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1500 },
    { month: "Mar", earnings: 1800 },
    { month: "Apr", earnings: 1600 },
    { month: "May", earnings: 2000 },
    { month: "Jun", earnings: 1750 },
    { month: "Jul", earnings: 1900 },
    { month: "Aug", earnings: 2100 },
    { month: "Sep", earnings: 1700 },
    { month: "Oct", earnings: 2200 },
    { month: "Nov", earnings: 1950 },
    { month: "Dec", earnings: 2300 },
  ]);

  // State to manage sidebar visibility and user information
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  // --- Data Fetching Simulation ---
  useEffect(() => {
    // Simulate an asynchronous data fetch
    const fetchData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate mock data for 4 weeks in the current month
      const mockEarnings = [
        { week: "Week 1", earnings: 1200 },
        { week: "Week 2", earnings: 1500 },
        { week: "Week 3", earnings: 900 },
        { week: "Week 4", earnings: 2000 },
        // Add a 5th week if the current month has it, or if it's the last week
        { week: "Week 5", earnings: 750 }, // Example for months with 5 partial weeks
      ];

      // Get current week's earnings (simplistic: last entry)
      const latestWeekEarnings =
        mockEarnings[mockEarnings.length - 1]?.earnings || 0;
      setCurrentWeekEarnings(latestWeekEarnings);

      // Calculate current month's total earnings
      const monthTotal = mockEarnings.reduce(
        (sum, item) => sum + item.earnings,
        0
      );
      setCurrentMonthEarnings(monthTotal);

      // Simulate number of pending invoices
      setPendingInvoicesCount(7);

      // Set the monthly earnings data for the chart
      setMonthlyEarningsData(mockEarnings);

      // Simulate details for the latest invoice
      setLatestInvoice({
        invoiceId: "INV-2024-001",
        clientName: "Acme Corp Solutions",
        amount: 750.0,
        date: new Date(), // Current date as the invoice date
        status: "Pending",
      });
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  // --- Event Handlers ---
  const handleLatestInvoiceClick = () => {
    // Navigate to the invoices page when the latest invoice shortcut is clicked
    navigate("/myinvoicemanagement");
  };
  // Function to toggle the sidebar visibility
  // This function will be passed to the NavBar component to handle sidebar toggling
  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("users/me");
        const userFirstName = response.data?.firstname || "User";
        setFirstName(userFirstName);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setFirstName("User");
      }
    };

    fetchUser();
  }, []);

  return (
    <Layout
      navBarProps={{
        title: "Dashboard",
        showProfile: true,
        showNotifications: true,
        showSearch: true,
        logoSrc: "https://via.placeholder.com/150",
      }}
      sidebarProps={{ isHomePage: true }}
    >
      {/* Main dashboard content */}
      <Box
        sx={{
          //p: 3,
          // pt: { xs: "56px", sm: "64px" },
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          // pb: 10, // Add enough bottom padding so content is not hidden behind Footer
          //overflowX: "hidden", // Prevent horizontal scroll
          width: "100%",
          maxWidth: "100vw", // wider container
          margin: "0 auto", // center on page
          boxSizing: "border-box",
          className: "dashboard-container", // Optional: for custom styles
        }}
      >
        {/* <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            className: "dashboard-grid-container",
            width: "100%", // Ensure the grid takes full width
            // maxWidth: "100vw", // Ensure the grid does not exceed viewport width
            margin: "0 auto",
          }}
        > */}
        {/* <Grid item xs={12} md={12} className="dashboard-grid-item" width="100%"> */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 3,
            marginBottom: 3,
          }}
        >
          Welcome, {firstName || "User"}!
        </Typography>

        {/* --- Shortcut Section: Current Week, Month, Pending Invoices --- */}
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "100vw",
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            className: "dashboard-shortcut-summarycards-grid",
          }}
        >
          {/* Current Week Earnings Card */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionPaper elevation={2}>
              <CardHeader variant="h6">Current Week Earnings</CardHeader>
              <ValueText color="primary">
                €{currentWeekEarnings.toFixed(2)}
              </ValueText>
            </SectionPaper>
          </Grid>
          {/* Current Month Earnings Card */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionPaper elevation={2}>
              <CardHeader variant="h6">Current Month Earnings</CardHeader>
              <ValueText color="primary">
                €{currentMonthEarnings.toFixed(2)}
              </ValueText>
            </SectionPaper>
          </Grid>
          {/* Pending Invoices Count Card */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionPaper elevation={2}>
              <CardHeader variant="h6">Pending Invoices</CardHeader>
              <ValueText color="error">{pendingInvoicesCount}</ValueText>
            </SectionPaper>
          </Grid>
        </Grid>

        {/* --- Charts Section: Bar (month) and Line (year) side by side --- */}

        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          width="100%"
          className="dashboard-charts-grid"
        >
          {/* Monthly Earnings Bar Chart */}
          <Grid item xs={12} sm={6} sx={{ width: "45vw" }}>
            <MonthlyEarningsBarChart
              data={monthlyEarningsData.map((d) => d.earnings)}
              total={currentMonthEarnings}
              change={8} // or your actual % change
            />
          </Grid>

          {/* Yearly Earnings Line Chart */}

          <Grid item xs={12} sm={6} sx={{ width: "45vw" }}>
            <YearlyEarningsChart
              data={yearlyEarningsData.map((d) => d.earnings)}
              change={-5} // or your actual % change
            />
          </Grid>
        </Grid>

        {/* --- Latest Invoice Shortcut --- */}
        <SectionPaper
          elevation={3}
          margin="auto"
          // Make the entire card clickable
          sx={{
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
            p: 3,
            height: "50%",
            width: "50%",
            // marginTop: "20px",
            // marginLeft: "20px",
          }}
          onClick={handleLatestInvoiceClick}
        >
          <CardHeader variant="h6" gutterBottom sx={{ height: "25%" }}>
            Latest Invoice
          </CardHeader>
          {latestInvoice ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Invoice ID:</strong> {latestInvoice.invoiceId}
                </Typography>
                <Typography variant="body1">
                  <strong>Client:</strong> {latestInvoice.clientName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Amount:</strong> €{latestInvoice.amount.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Date:</strong>{" "}
                  {format(latestInvoice.date, "MMM dd, yyyy")}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>{" "}
                  <Box
                    component="span"
                    sx={{
                      color:
                        latestInvoice.status === "Pending"
                          ? "error.main"
                          : "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    {latestInvoice.status}
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1">No latest invoice found.</Typography>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#43a047", // your custom color
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#388e3c", // darker shade on hover
                },
              }}
              onClick={handleLatestInvoiceClick}
            >
              View All Invoices
            </Button>
          </Box>
        </SectionPaper>
        {/* </Grid> */}
        {/* </Grid> */}
      </Box>
    </Layout>
  );
};

export default DashboardScreen;
