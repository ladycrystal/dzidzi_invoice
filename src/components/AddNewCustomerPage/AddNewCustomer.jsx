import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNewCustomer() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    // Save customer logic here (e.g., API call)
    console.log("Customer Saved:", { customerName, email, phone });
    navigate("/"); // Navigate back to the invoice page
  };

  return (
    <div className="new-customer-container">
      <h1>Create New Customer</h1>
      <form className="new-customer-form">
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <button type="button" className="btn primary" onClick={handleSave}>
          Save Customer
        </button>
      </form>
    </div>
  );
}

export default AddNewCustomer;
