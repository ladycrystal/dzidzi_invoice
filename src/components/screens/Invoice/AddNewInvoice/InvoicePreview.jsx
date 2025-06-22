import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import FormButton from "../../../Pages/ReusableComponents/FormButton";
import API from "../../../../api/axios";

const InvoicePreview = ({ invoiceData }) => {
  // if (!invoiceData) {
  //   return <Typography>Loading invoice data...</Typography>;
  // }

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Use mock data if invoiceData is not provided
  const mockData = {
    VAT: 25,
    invoice_rows: [
      {
        description: "Service A",
        price_per_unit: 20000,
        quantity: 1,
        work_start_time: "2025-02-01T00:00:00",
        work_end_time: "2025-02-21T01:00:00",
      },
    ],
    invoice_date: "2025-02-20T11:00:00",
    payment_date: "2025-02-20T11:00:00",
    reference: "REF-1234",
    total_amount: 20000,
    work_end_time: "2025-02-21T01:00:00",
    work_start_time: "2025-02-01T00:00:00",
    partner_name: "Jane Doe",
  };

  // Use invoiceData if available, otherwise fallback to mockData
  const data = invoiceData || mockData;

  // Destructure relevant fields
  const {
    VAT,
    invoice_rows,
    payment_date,
    reference,
    total_amount,
    work_start_time,
    work_end_time,
    partner_name,
    invoice_date,
  } = data;

  const formattedInvoiceDate = dayjs(invoice_date).format("DD/MM/YYYY");
  const formattedPaymentDate = dayjs(payment_date).format("DD/MM/YYYY");
  const formattedStart = dayjs(work_start_time).format("DD/MM/YYYY");
  const formattedEnd = dayjs(work_end_time).format("DD/MM/YYYY");

  const createInvoice = async (invoiceData) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await API.post("/api/v1/invoices", invoiceData);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMsg(
          "Failed to send invoice: " +
            (error.response.data?.message || "Unknown error from server")
        );
        console.error("API Error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response:", error.request);
        setErrorMsg("Failed to send invoice: No response from server");
      } else {
        // Something else happened
        console.error("Error:", error.message);
        setErrorMsg("Failed to send invoice: " + error.message);
      }
      throw error;
    }
  };

  const handleSendInvoice = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    const invoiceData = {
      VAT,
      invoice_rows,
      payment_date,
      reference,
      total_amount,
      work_start_time,
      work_end_time,
    };

    try {
      const result = await createInvoice(invoiceData);
      setSuccessMsg("Invoice created successfully!");
      console.log("Invoice created:", result);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invoice creation failed.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        {/* Alert Messages */}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Invoice header */}
        <Typography variant="h4" align="center" gutterBottom>
          INVOICE
        </Typography>

        <Divider sx={{ mb: 2, height: "1px", border: " black 1px solid" }} />

        {/* From Section */}
        <Grid
          container
          mb={2}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 5, md: 10 }}
        >
          <Grid item>
            <Typography>DZIDZI Delivery Services</Typography>
            <Typography>123 Market Street</Typography>
            <Typography>Accra, Ghana</Typography>
          </Grid>
          <Box>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Date of Invoice:</strong> {formattedInvoiceDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Payment Date:</strong> {formattedPaymentDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Working Hours:</strong> {formattedStart} -{" "}
                {formattedEnd}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Reference:</strong> {reference}
              </Typography>
            </Grid>
          </Box>
        </Grid>

        <Divider sx={{ mb: 2, height: "1px", border: " black 1px solid" }} />

        <Paper variant="" sx={{ p: 1, mb: 1 }}>
          {/* Partner Details Header */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            {partner_name} - Partner Fees from: {formattedStart} -{" "}
            {formattedEnd}
          </Typography>
          {invoice_rows.map((row, index) => (
            <Box key={index} mb={1}>
              <Typography variant="body2" color="text.secondary">
                Description: {row.description}
              </Typography>
              <Typography>
                {row.quantity} Pcs x ${row.price_per_unit}
              </Typography>
            </Box>
          ))}
          <Typography>Tax: {VAT}%</Typography>

          <Typography variant="h6" mt={2}>
            Total: ${total_amount}
          </Typography>
        </Paper>

        <Divider sx={{ mb: 2, height: "1px", border: " black 1px solid" }} />

        {/* Tip and additional info */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          {partner_name} - Tips from customers from : {formattedStart} -
          {formattedEnd}
        </Typography>
        <Box>
          <Typography variant="body1">Tip: $0</Typography>
          <Typography variant="body1">Tax: $0</Typography>
        </Box>

        <Divider sx={{ mb: 2, height: "1px", border: " black 1px solid" }} />

        {/* Final Total */}
        <Typography variant="h6">
          Total Payout (after tax): ${total_amount}
          {/* assuming no tax deducted */}
        </Typography>
      </Box>

      <Box
        display="flex"
        sx={{
          justifyContent: "center",
          xs: 1,
          sm: 2,
          md: 10,
          mb: 2,
          mt: 2,
        }}
      ></Box>
      {/* Loader */}
      <Box display="flex" justifyContent="center" sx={{ mb: 2, mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <FormButton
            onClick={handleSendInvoice}
            type="submit"
            variant="contained"
            text="Send Invoice"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1rem",
            }}
          />
        )}
      </Box>
    </>
  );
};

export default InvoicePreview;
