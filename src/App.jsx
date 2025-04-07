import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import Home from "./components/HomePage/Home";
import NotFound from "./components/HomePage/NotFound";
import InvoiceScreen from "./components/screens/Invoice/InvoiceScreen";
import SalariesScreen from "./components/screens/Salaries/SalariesScreen";
import CustomersScreen from "./components/screens/customers/CustomersScreen";
import AddNewInvoice from "./components/screens/Invoice/AddNewInvoice/AddNewInvoice";
import { useNavigate, useLocation } from "react-router-dom";

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
        <Route path="/invoice" element={<InvoiceScreen />} />
        <Route path="/salaries" element={<SalariesScreen />} />
        <Route path="/customers" element={<CustomersScreen />} />
        <Route path="/addnewinvoice" element={<AddNewInvoice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
