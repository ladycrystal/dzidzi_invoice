import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import SignUpPage from "./components/Pages/SignUpPage/SignUpPage";
import Home from "./components/Pages/HomePage/Home";
import NotFound from "./components/Pages/HomePage/NotFound";
import InvoiceScreen from "./components/screens/Invoice/InvoiceScreen";
import SalariesScreen from "./components/screens/Salaries/SalariesScreen";
import CustomersScreen from "./components/screens/customers/CustomersScreen";
import AddNewInvoice from "./components/screens/Invoice/AddNewInvoice/AddNewInvoice";
import { useNavigate, useLocation } from "react-router-dom";
import "./components/Pages/SignUpPage/SignUpPage.css";
import "./components/Pages/LoginPage/LoginPage.css";
import GetAddressForm from "./components/Pages/SignUpPage/GetAddressForm";
import AddressPage from "./components/Pages/SignUpPage/AddressPage";

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
    // adding login classname to body
    if (
      location.pathname.includes("login") ||
      location.pathname.includes("signup")
    ) {
      document.body.classList.add("auth");
    } else {
      document.body.classList.remove("auth");
    }
  }, [location.pathname]);

  useEffect(() => {
    const element = document.querySelectorAll(".form-group-style");
    if (location.pathname.includes("addresssettings")) {
      element.forEach((el) => {
        el.classList.add("form-group-style-address");
      });
    } else {
      element.forEach((el) => {
        el.classList.remove("form-group-style-address");
      });
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<InvoiceScreen />} />
        <Route path="/salaries" element={<SalariesScreen />} />
        <Route path="/customers" element={<CustomersScreen />} />
        <Route path="/addnewinvoice" element={<AddNewInvoice />} />
        <Route path="/getaddress" element={<GetAddressForm />} />
        <Route path="/addresssettings" element={<AddressPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
