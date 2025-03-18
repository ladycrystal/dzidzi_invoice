import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import Home from "./components/HomePage/Home";
import NotFound from "./components/HomePage/NotFound";
import InvoicePage from "./components/InvoicePage/InvoicePage";
import AddNewInvoice from "./components/InvoicePage/AddNewInvoice";
import AddNewCustomer from "./components/AddNewCustomerPage/AddNewCustomer";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";

function App() {
  /**
   * hooks
   */
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * effects
   */
  useEffect(() => {
    // adding login class to body
    if (
      location.pathname.includes("login") ||
      location.pathname.includes("signup")
    ) {
      document.body.classList.add("auth");
    } else {
      document.body.classList.remove("auth");
    }
    console.log(location);
    console.log(navigate);
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/addnewinvoice" element={<AddNewInvoice />} />
        <Route path="/addnewcustomer" element={<AddNewCustomer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
