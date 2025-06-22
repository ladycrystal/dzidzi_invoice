import React, { useEffect, useState } from "react";
import SideBar from "../../Pages/SideBar/SideBar";
import "./Dashboard.css";
import API from "../../../api/axios";
import Footer from "../../Pages/Footer/Footer";
import { styled, useTheme } from "@mui/material/styles"; // Import useTheme
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart, // <-- NEW: Import LineChart
  Line, // <-- NEW: Import Line
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // For formatting dates

// Import NavBar component
import NavBar from "../../Pages/ReusableComponents/NavBar/NavBar";
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
  fontWeight: 600,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
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
    <>
      {/* Render the  NavBar component */}
      <NavBar
        onToggleSidebar={toggleSideBar} // Pass toggleSidebar to NavBar
        isSidebarOpen={isSideBarOpen} // Pass sidebar state for potential conditional rendering within NavBar
        title="Dashboard" // Example title for NavBar (e.g., in hamburger menu area)
        showProfile={true} // Show profile icon in NavBar
        showNotifications={true} // Show notifications icon in NavBar
        showSearch={true} // Show search/mail icon in NavBar
        logoSrc="https://via.placeholder.com/150" // Placeholder logo, replace with actual logo URL
      />

      {/* Main dashboard content */}
      <Box
        sx={{
          p: 3,
          pt: 0,
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          pb: 10, // Add enough bottom padding so content is not hidden behind Footer
          overflowX: "hidden", // Prevent horizontal scroll
          maxWidth: "1600px", // wider container
          margin: "0 auto", // center on page
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={12}>
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
              spacing={3}
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
            <Grid container spacing={3}>
              {/* Monthly Earnings Bar Chart */}
              <Grid item xs={12} md={6}>
                <SectionPaper elevation={1.5} sx={{ mb: 4 }}>
                  <CardHeader variant="h6" gutterBottom>
                    Your Earnings This Month
                  </CardHeader>
                  <Box sx={{ height: 400, width: "100%", mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyEarningsData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.divider}
                        />
                        <XAxis
                          dataKey="week"
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.1)" }}
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper, // Use resolved theme color
                            borderColor: theme.palette.divider, // Use resolved theme color
                            color: theme.palette.text.primary, // Use resolved theme color
                            borderRadius: "4px",
                          }}
                          itemStyle={{ color: theme.palette.text.primary }} // Use resolved theme color
                          labelStyle={{ color: theme.palette.text.secondary }} // Use resolved theme color
                          formatter={(value) => `€${value.toFixed(2)}`}
                        />
                        <Bar
                          dataKey="earnings"
                          fill={theme.palette.primary.main} // Use primary theme color
                          name="Earnings"
                          radius={[10, 10, 0, 0]} // Rounded top corners for bars
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </SectionPaper>
              </Grid>

              {/* Yearly Earnings Line Chart */}
              <Grid item xs={12} md={6}>
                <SectionPaper
                  elevation={1.5}
                  sx={{ mb: 4, textAlign: "center" }}
                >
                  <CardHeader variant="h6" gutterBottom>
                    Yearly Earnings Trend
                  </CardHeader>
                  <Box sx={{ height: 400, width: "100%", mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearlyEarningsData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.divider}
                        />
                        <XAxis
                          dataKey="month"
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.primary,
                            borderRadius: "4px",
                          }}
                          itemStyle={{ color: theme.palette.text.primary }}
                          labelStyle={{ color: theme.palette.text.secondary }}
                          formatter={(value) => `€${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke={theme.palette.primary.main}
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            stroke: theme.palette.primary.dark,
                            strokeWidth: 2,
                            fill: theme.palette.background.paper,
                          }}
                          activeDot={{ r: 8 }}
                          name="Earnings"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </SectionPaper>
              </Grid>
            </Grid>

            {/* --- Latest Invoice Shortcut --- */}
            <SectionPaper
              elevation={3}
              // Make the entire card clickable
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
                p: 3,
                height: "50%",
                width: "98%",
                marginTop: "20px",
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
                      <strong>Amount:</strong> €
                      {latestInvoice.amount.toFixed(2)}
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
                <Typography variant="body1">
                  No latest invoice found.
                </Typography>
              )}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLatestInvoiceClick}
                >
                  View All Invoices
                </Button>
              </Box>
            </SectionPaper>
          </Grid>
        </Grid>
      </Box>
      {/* Sidebar Drawer  */}
      <Footer
        sx={{
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          left: 0,
        }}
      />
      <SideBar
        isSideBar={isSideBarOpen}
        isHomePage={true}
        toggleSideBar={toggleSideBar}
      />
    </>
  );
};

export default DashboardScreen;
