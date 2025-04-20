import React, { useState } from "react";
import TextInputField from "../AuthPage/TextInputField";
import useChangeHandler from "../../hooks/useChangeHandler";
import API from "../../../api/axios";
import MessageBox from "../AuthPage/MessageBox";
import FormButton from "../AuthPage/FormButton";
import { Link, useNavigate } from "react-router-dom";

const GetAddressForm = () => {
  const { formData, handleChange, resetForm } = useChangeHandler({
    city: "",
    country: "",
    postal_code: "",
    street: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if all fields are valid before submission
    if (
      !formData.city ||
      !formData.country ||
      !formData.postal_code ||
      !formData.street
    ) {
      setMessage("All fields are required!");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await API.post("/addresses", formData);
      setMessage("Address created successfully!");
      setIsError(false);
      setIsSubmitting(false);
      console.log("Address created:", response.data);

      // Redirect to login page after 1 second
      setTimeout(() => {
        // setIsLoading(false); // hide spinner
        // setFadeOut(false);
        navigate("/login");
      }, 1000);
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      setMessage("Failed to create address. Please try again.");
      setIsError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <TextInputField
        id="city"
        name="city"
        value={formData.city}
        label="City"
        placeholder="Enter city"
        valid={formData.city.trim() !== ""}
        onChange={handleChange}
        required
      />
      <TextInputField
        id="country"
        name="country"
        value={formData.country}
        label="Country"
        placeholder="Enter country"
        valid={formData.country.trim() !== ""}
        onChange={handleChange}
        required
      />
      <TextInputField
        id="postal_code"
        name="postal_code"
        value={formData.postal_code}
        label="Postal Code"
        placeholder="Enter postal code"
        valid={formData.postal_code.trim() !== ""}
        onChange={handleChange}
        required
      />
      <TextInputField
        id="street"
        name="street"
        value={formData.street}
        label="Street"
        placeholder="Enter street"
        valid={formData.street.trim() !== ""}
        onChange={handleChange}
        required
      />

      {/* Message Box for success or error */}
      <MessageBox message={message} isError={isError} />

      {/* Form submission button */}
      <FormButton
        text={isSubmitting ? "Submitting..." : "Save Address"}
        disabled={isSubmitting}
      />
    </form>
  );
};

export default GetAddressForm;
