import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility"; // For the View icon
import API from "../../../../api/axios";
import NavBar from "../../../Pages/NavBar/NavBar";
import SideBar from "../../../Pages/SideBar/SideBar";
import Footer from "../../../Pages/Footer/Footer";

// --- Mock Data (Replace with actual API fetching) ---
const MOCK_INVOICES = [
  {
    id: "INV001",
    client: "Alpha Corp",
    date: "2025-01-15",
    amount: 150.75,
    status: "Paid",
  },
  {
    id: "INV002",
    client: "Beta LLC",
    date: "2025-02-20",
    amount: 300.0,
    status: "Draft",
  },
  {
    id: "INV003",
    client: "Gamma Inc",
    date: "2025-03-05",
    amount: 75.2,
    status: "Impending",
  },
  {
    id: "INV004",
    client: "Delta Co",
    date: "2025-04-10",
    amount: 220.5,
    status: "Paid",
  },
  {
    id: "INV005",
    client: "Epsilon Ltd",
    date: "2025-05-18",
    amount: 450.0,
    status: "Draft",
  },
  {
    id: "INV006",
    client: "Zeta Ent",
    date: "2024-12-01",
    amount: 125.0,
    status: "Paid",
  },
  {
    id: "INV007",
    client: "Eta Group",
    date: "2025-06-01",
    amount: 50.0,
    status: "Impending",
  },
  {
    id: "INV008",
    client: "Theta Corp",
    date: "2025-01-25",
    amount: 180.0,
    status: "Paid",
  },
  {
    id: "INV009",
    client: "Iota LLC",
    date: "2024-11-10",
    amount: 90.0,
    status: "Draft",
  },
  {
    id: "INV010",
    client: "Kappa Inc",
    date: "2025-02-10",
    amount: 600.0,
    status: "Paid",
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const MyInvoiceManagement = ({ onToggleSidebar }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all-time"); // 'all-time', 'this-month', 'last-30-days', 'this-year'
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all', 'paid', 'draft', 'impending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  // --- Simulate API Fetch on Mount ---
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app: const response = await API.get('/invoices');

        //const response = await API.get('/invoices'); // Assuming Sam agrees and updates the back end to provide this endpoint
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        //     const mappedInvoices = response.data.map(item => ({
        //       id: item.id, // Assuming each invoice object has an 'id'
        //       client: item.client_name || 'N/A', // Placeholder: You'll need actual client info from backend
        //       date: item.payment_date, // Using payment_date as the 'Period' column date
        //       amount: item.total_amount,
        //       status: item.status || 'Unknown', // Assuming an invoice object has a 'status'
        //    })); //add this line to map the invoices from the endpoint to the expected format

        // For now, using mock data

        //     setInvoices(MOCK_INVOICES);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // --- Filtering Logic (Memoized for performance) ---
  const filteredInvoices = useMemo(() => {
    let tempInvoices = [...invoices];

    // Filter by Period
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    tempInvoices = tempInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      // if (isNaN(invoiceDate)) return false; // Skip invalid dates

      switch (selectedPeriod) {
        case "all-time":
          return true;
        case "this-month":
          return (
            invoiceDate.getFullYear() === currentYear &&
            invoiceDate.getMonth() === currentMonth
          );
        case "last-30-days":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return invoiceDate >= thirtyDaysAgo && invoiceDate <= now;
        case "this-year":
          return invoiceDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });

    // Filter by Status
    if (selectedStatus !== "all") {
      tempInvoices = tempInvoices.filter(
        (invoice) => invoice.status === selectedStatus
      );
    }

    return tempInvoices;
  }, [invoices, selectedPeriod, selectedStatus]);

  // --- Calculate Total Amount for the Year from filtered invoices ---
  // The request specifically asked for "total of money from the invoices for the year".
  // Assuming 'for the year' means for the *current* year within the *filtered* set.
  // If it should be irrespective of current filters, adjust this logic.
  const totalAmountForYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return filteredInvoices
      .filter((invoice) => new Date(invoice.date).getFullYear() === currentYear)
      .reduce((sum, invoice) => sum + invoice.amount, 0)
      .toFixed(2); // Format to 2 decimal places
  }, [filteredInvoices]);

  // --- Event Handlers ---
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleViewInvoice = (invoiceId) => {
    // In a real application, you would navigate to a detailed view page
    // e.g., navigate(`/invoice/${invoiceId}`);
    // For now, let's just log it.
    alert(`Viewing Invoice: ${invoiceId}`); // Using alert as per instructions, replace with MessageBox
    console.log(`Viewing Invoice: ${invoiceId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading Invoices...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <NavBar
        title="My Invoices" // Title for the NavBar
        onToggleSidebar={() => setShowSidebar((prev) => !prev)} // Pass the toggle function to NavBar
        isSidebarOpen={showSidebar} // Pass the sidebar state
        SidebarComponent={SideBar}
        showProfile={true} // Show profile icon
        showNotifications={true} // Show notifications icon
        showSearch={true} // Show search/mail icon
        logoSrc="" // Provide your logo source if any
      />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "lg", mx: "auto" }}>
        {" "}
        {/* Container for centering and padding */}
        {/* Row 1: Heading */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: { xs: 3, md: 5 }, pt: { xs: "64px", sm: "64px" } }}
        >
          My Invoices
        </Typography>
        {/* Row 2: Filters */}
        <StyledPaper sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Period Filter */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="period-select-label">Period</InputLabel>
                <Select
                  labelId="period-select-label"
                  id="period-select"
                  value={selectedPeriod}
                  label="Period"
                  onChange={handlePeriodChange}
                >
                  <MenuItem value="all-time">All Time</MenuItem>
                  <MenuItem value="this-month">This Month</MenuItem>
                  <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                  <MenuItem value="this-year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={selectedStatus}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Impending">Impending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </StyledPaper>
        {/* Row 3: Invoice Table */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Invoice List
          </Typography>
          <TableContainer>
            <Table stickyHeader aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No invoices found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewInvoice(invoice.id)}
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
        {/* Row 4: Total Amount */}
        <StyledPaper>
          <Typography variant="h6" align="right">
            Total for Current Year : ${totalAmountForYear}
          </Typography>
        </StyledPaper>
      </Box>
      <SideBar
        isSideBar={showSidebar} // Controls visibility based on state
        isHomePage={false} // Adjust this prop based on your SideBar's logic
        toggleSideBar={() => setShowSidebar((prev) => !prev)} // <--- Allows closing the sidebar from within
      />
      <Footer />
    </>
  );
};

export default MyInvoiceManagement;
