import React, { useState } from "react";
import "./AddNewInvoice.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";

function AddNewInvoice() {
  // State for Add Customer dropdown
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState("");

  // State for Service Date picker
  const [serviceDate, setServiceDate] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setCustomer(""); // Reset customer selection
      navigate("/addnewcustomer"); // Navigate to the "New Customer" page
    } else {
      setCustomer({ name: value }); // Update customer with selected name
    }
  };

  function SelectedCustomer(e) {
    return setCustomer(e.target.value);
  }

  function NewCustomerDetails(e) {
    return setNewCustomer(e.target.value);
  }

  function AddNewCustomer() {
    if (newCustomer) {
      setCustomers([...customers, newCustomer]);
      setCustomer(newCustomer);
      setNewCustomer("");
    }
  }

  React.useEffect(() => {
    if (location.state?.newCustomer) {
      setCustomer(location.state.newCustomer); // Update customer state with all details from NewCustomer
    }
  }, [location.state]);

  return (
    <div className="invoice-container">
      <header className="invoice-header">
        <h1>New Invoice</h1>
        <div className="invoice-actions">
          <button className="btn">Preview</button>
          <button className="btn">Save as Draft</button>
          <button className="btn primary">Send</button>
        </div>
      </header>
      <div className="details-container">
        <section className="invoice-details">
          <h2>Details</h2>

          <form className="details-form">
            {customer ? (
              <div className="form-group">
                <label htmlFor="customer">Add Customer</label>
                <div className="customer-details">
                  <div className="customer-details-container">
                    <p className="customer-name">{customer.name}</p>
                    <p className="customer-email">{customer.email}</p>
                    <p className="customer-phone">{customer.phone}</p>
                  </div>
                  <div className="customer-actions">
                    <p
                      className="view-details"
                      onClick={() =>
                        alert(`Viewing details for ${customer.name}`)
                      }
                    >
                      <a href="">View Details </a>
                    </p>
                    <vr />
                    <p
                      className="remove-details"
                      onClick={() => setCustomer("")}
                    >
                      Remove
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <select
                id="customer"
                value={customer}
                onChange={handleCustomerChange}
                className="dropdown"
              >
                <option value="">Select a customer</option>
                {customers.map((cust, index) => (
                  <option key={index} value={cust}>
                    {cust}
                  </option>
                ))}
                <option value="new">+ Create New Customer</option>
              </select>
            )}

            <div className="form-group">
              <label>Invoice Title</label>
              <input type="text" placeholder="Invoice title" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service-date">Service Date</label>
                <DatePicker
                  id="service-date"
                  selected={serviceDate}
                  onChange={(date) => setServiceDate(date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  className="datepicker-input"
                />
              </div>
              <div className="form-group">
                <label>Invoice ID</label>
                <input type="text" placeholder="Enter invoice ID" />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Message"></textarea>
            </div>
          </form>
        </section>
        <hr />
        <section className="line-items">
          <h2>Line Items</h2>
          <div className="items-list">
            <button className="add-item">+ Add an Item</button>
            <div className="totals">
              <div className="discount">
                <p>
                  <a href="">Add Discount </a>
                </p>
                <p>
                  Subtotal: <span>$0.00</span>
                </p>
                <p>
                  Tax:<span>$0.00</span>
                </p>
              </div>
              <div className="shipping">
                <p>
                  <a href="">Add Shipping Fee or Service Charge</a>
                </p>
                <p className="total">
                  Total:<span>$0.00</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <hr />
        <section className="attachments">
          <h2>Attachments and Custom Fields</h2>
          <label className="attachments-upload">
            <p>
              Attach up to 10 files totaling 25 MB. Supported file types: JPG,
              PNG, GIF, TIFF, BMP, PDF.
            </p>
            <input type="file" name="" id="" />
            <button className="btn">Add</button>
          </label>

          <label className="attachments-upload">
            <p>Add existing contracts or create a new one.</p>
            <input type="file" name="" id="" />
            <button className="btn">Add</button>
          </label>
        </section>
        <hr />
      </div>
    </div>
  );
}

export default AddNewInvoice;
