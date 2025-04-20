import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNewCustomer() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    // Save customer logic here
    console.log("Customer Saved:", { customerName, email, phone });

    if (customerName && email && phone) {
      navigate("/addnewinvoice", {
        state: { newCustomer: { customerName, email, phone } },
      }); // Information of the new customer added is passed to the AddNewInvoice component using state.  This will be accessed on that component using location. AddNewInvoice line 46-50
    } else {
      alert("Please fill in all fields.");
    }
  };

  function NewCustomerDetails(e) {
    return setCustomerName(e.target.value);
  }

  return (
    <div className="new-customer-container">
      <h1>Create New Customer</h1>
      <form className="new-customer-form">
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={NewCustomerDetails}
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
