import { useState } from "react";

const useFormHandler = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => setFormData(initialState);

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
};

export default useFormHandler;
