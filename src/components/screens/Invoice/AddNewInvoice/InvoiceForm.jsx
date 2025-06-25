import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
//import dayjs from "dayjs";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormButton from "../../../common/FormButton";
import Footer from "../../../Pages/Footer/Footer";

const InvoiceForm = () => {
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]); // You can load or mock data here
  const [serviceDate, setServiceDate] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    customerName: "",
    email: "",
    phone: "",
  });

  // when a different customer is selected
  const handleCustomerChange = (event) => {
    const selected = event.target.value;
    if (selected === "new") {
      // Handle new customer creation logic
      setNewCustomerModalOpen(true);
    } else {
      setCustomer(selected);
    }
  };

  const handleCreateCustomer = () => {
    if (!newCustomerData.customerName) return;
    setCustomers((prev) => [...prev, newCustomerData]);
    setCustomer(newCustomerData);
    setNewCustomerData({ customerName: "", email: "", phone: "" });
    setNewCustomerModalOpen(false);
  };

  // const handleCustomerSelectChange = (e) => {
  //   const value = e.target.value;
  //   if (value === "new") {
  //     setNewCustomerModalOpen(true);
  //   } else {
  //     handleCustomerChange(e);
  //   }
  // };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleAddItem = (event) => {
    if (event.key === "Enter" && newItem.trim() !== "") {
      setItems([...items, { name: newItem, qty: 1, price: 0 }]);
      setNewItem("");
    }
  };

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal - discount + shipping + tax;

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          border: "2px solid blue", // Debug only
          py: 4,
          // pt: { xs: "56px", sm: "64px" }, // Add this line
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">New Invoice</Typography>
          <Box display="flex" gap={2}>
            <FormButton text="Preview" variant="contained" />
            <FormButton variant="contained" text="Save as Draft" />
            <FormButton variant="contained" color="primary" text="Send" />
          </Box>
        </Box>

        <Box component="section" mb={4}>
          <Typography variant="h5" gutterBottom>
            Details
          </Typography>

          {customer ? (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body1">
                    <strong>Name:</strong> {customer.customerName || "No Name"}
                  </Typography>
                  <Typography variant="body2">
                    {customer.email || "No email"}
                  </Typography>
                  <Typography variant="body2">
                    {customer.phone || "No phone"}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() =>
                      alert(`Viewing details for ${customer.customerName}`)
                    }
                  >
                    View Details
                  </Button>
                  <Button color="error" onClick={() => setCustomer("")}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ) : (
            <FormControl fullWidth margin="normal">
              <Select
                value={customer}
                onChange={handleCustomerChange}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="">Select a customer</MenuItem>
                {customers.map((cust, index) => (
                  <MenuItem key={index} value={cust}>
                    {cust.customerName}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="new">+ Create New Customer</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Invoice Title"
            placeholder="Invoice title"
            margin="normal"
            value={invoiceTitle}
            onChange={(e) => setInvoiceTitle(e.target.value)}
          />

          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid item size={6}>
              <Typography>Service Date</Typography>
              <DatePicker
                selected={serviceDate}
                onChange={(date) => setServiceDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className="datepicker-input"
                isClearable
                showYearDropdown
                scrollableYearDropdown
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                label="Invoice ID"
                placeholder="Enter invoice ID"
                fullWidth
                margin="normal"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Message"
            placeholder="Message"
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        <Divider sx={{ height: "1px", border: " black 1px solid" }} />

        <Box component="section" my={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h5">Line Items</Typography>
            <Typography>{isExpanded ? "▲" : "▼"}</Typography>
          </Box>

          {isExpanded && (
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField value={item.name} fullWidth disabled />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              Number(e.target.value)
                            )
                          }
                          inputProps={{ min: 1 }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          inputProps={{ min: 0 }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        ${(item.qty * item.price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5}>
                      <TextField
                        fullWidth
                        placeholder="+ Add an item"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={handleAddItem}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Grid
          container
          component="section"
          my={4}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <Grid item size={6}>
            <TextField
              label="Discount"
              type="number"
              fullWidth
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              label="Shipping Fee / Service Charge"
              type="number"
              fullWidth
              value={shipping}
              onChange={(e) => setShipping(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        <Divider sx={{ height: "1px", border: " black 1px solid" }} />

        <Grid
          component="section"
          my={4}
          container
          columnSpacing={{ xs: 1, sm: 2, md: 1 }}
        >
          <Grid item size={6}>
            <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography>Tax (10%): ${tax.toFixed(2)}</Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Grid>
        </Grid>

        {/* New Customer Modal */}
        <Dialog
          open={newCustomerModalOpen}
          onClose={() => setNewCustomerModalOpen(false)}
        >
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Customer Name"
              fullWidth
              value={newCustomerData.customerName}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  customerName: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={newCustomerData.email}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  email: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              value={newCustomerData.phone}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  phone: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default InvoiceForm;
