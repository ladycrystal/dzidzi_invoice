import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import Home from "./components/HomePage/Home";
import NotFound from "./components/HomePage/NotFound";
import InvoicePage from "./components/InvoicePage/InvoicePage";
import AddNewInvoice from "./components/InvoicePage/AddNewInvoice";
import AddNewCustomer from "./components/AddNewCustomerPage/AddNewCustomer";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/addnewinvoice" element={<AddNewInvoice />} />
        <Route path="/addnewcustomer" element={<AddNewCustomer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
