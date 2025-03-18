import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./DateSelector.css";

const DateSelector = () => {
  // State for  Date picker
  const [serviceDate, setServiceDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // const handleCustomerChange = (e) => {
  //   const value = e.target.value;
  //   if (value === "new") {
  //     // setCustomer(""); // Reset customer selection
  //     navigate("/addnewcustomer"); // Navigate to the "New Customer" page
  //   } else {
  //     // setCustomer({ name: value }); // Update customer with selected name
  //   }
  // };

  // function SelectedCustomer(e) {
  //   // return setCustomer(e.target.value);
  // }

  return (
    <div className="addnewinvoice-form-group service-date">
      <button
        className="datepicker-button"
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
      >
        {" "}
        Date:
        {serviceDate ? serviceDate.toLocaleDateString() : " Select a date"}
      </button>

      {isDatePickerOpen && (
        <DatePicker
          id="service-date"
          selected={serviceDate}
          onChange={(date) => {
            setServiceDate(date);
            setIsDatePickerOpen(false);
          }}
          dateFormat="MM/dd/yyyy"
          inline
          showYearDropdown
          scrollableYearDropdown
          customInput={null}
        />
      )}
    </div>
  );
};

export default DateSelector;
