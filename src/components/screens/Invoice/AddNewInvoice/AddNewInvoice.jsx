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
  const [items, setItems] = useState([]); // List of items
  const [newItem, setNewItem] = useState(""); // Input field for new item
  const [isExpanded, setIsExpanded] = useState(true); // Toggle for visibility

  // State for Service Date picker
  const [serviceDate, setServiceDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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

  // Add new item when Enter is pressed
  const handleAddItem = (e) => {
    if (e.key === "Enter" && newItem.trim() !== "") {
      setItems([...items, { name: newItem, qty: 1, price: 0 }]);
      setNewItem(""); // Clear input field
    }
  };

  // Handle input changes for quantity & price
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Remove item
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // add a new customer to your database for easy selection
  function AddNewCustomer() {
    if (newCustomer) {
      setCustomers([...customers, newCustomer]);
      setCustomer(newCustomer);
      setNewCustomer("");
    }
  }
  // taking customer information from AddNewCustomer to render
  React.useEffect(() => {
    if (location.state?.newCustomer) {
      setCustomer(location.state.newCustomer); // New customer details from AddNewCustomer is retrieved and rendered using location from AddNewCustomer line14 -17.
    }
  }, [location.state]);

  return (
    <>
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
                  <div className="customer-details">
                    <div className="customer-details-container">
                      <p className="customer-name">
                        {customer.customerName || "No Name"}
                      </p>
                      <p className="customer-email">
                        {customer.email || "No email "}
                      </p>
                      <p className="customer-phone">
                        {customer.phone || "No phone "}
                      </p>
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
                <>
                  <div className="newinvoice-addcustomer">
                    <label htmlFor="customer">Add Customer</label>
                    <select
                      id="customer"
                      value={customer}
                      onChange={handleCustomerChange}
                      className="addnewinvoice-dropdown"
                    >
                      <option value="">Select a customer</option>
                      {customers.map((cust, index) => (
                        <option key={index} value={cust}>
                          {cust}
                        </option>
                      ))}
                      <hr className="addnewinvoice-dropdown-bar" />
                      <option value="new">
                        <span>+</span> Create New Customer
                      </option>
                    </select>
                  </div>
                </>
              )}

              <div className="addnewinvoice-title">
                <label>Invoice Title</label>
                <input type="text" placeholder="Invoice title" />
              </div>
              <div className="addnewinvoice-form-row">
                <div className="addnewinvoice-form-group service-date">
                  <label htmlFor="service-date">Service Date</label>
                  <DatePicker
                    id="service-date"
                    selected={serviceDate}
                    onChange={(date) => {
                      setServiceDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Select a date"
                    className="datepicker-input"
                    isClearable // Allows user to clear the selected date
                    showYearDropdown
                    scrollableYearDropdown
                  />
                </div>
                <div className="addnewinvoice-form-group">
                  <label>Invoice ID</label>
                  <input
                    type="text"
                    placeholder="Enter invoice ID"
                    className="invoice-id"
                  />
                </div>
              </div>
              <div className="addnewinvoice-form-group ">
                <label className="message">Message</label>
                <textarea placeholder="Message"></textarea>
              </div>
            </form>
          </section>
          <hr />
          {/* line items */}
          <section className="line-items">
            {/* toggle line items section */}
            <div
              className="line-items-header"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h2>Line Items</h2>
              <span className={`toggle-arrow ${isExpanded ? "up" : "down"}`}>
                &#x25B2;
              </span>
            </div>

            {isExpanded && (
              <div className="items-list">
                <table className="line-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th></th> {/* Empty for delete button */}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={item.name}
                            readOnly
                            className="item-name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.qty}
                            min="1"
                            required
                            className="item-qty"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "qty",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.price}
                            min="0"
                            required
                            className="item-price"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "price",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className="item-total">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="delete-item"
                            onClick={() => handleDeleteItem(index)}
                          >
                            ✖
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5">
                        <input
                          type="text"
                          className="add-item-input"
                          placeholder="+ Add an item"
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          onKeyDown={handleAddItem}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* discount aside */}
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

          {/* <hr /> */}
          {/* attachments section */}
          {/* <section className="attachments">
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
          </section> */}
          <hr />
        </div>
      </div>
    </>
  );
}

export default AddNewInvoice;
