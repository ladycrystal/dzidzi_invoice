import React, { useState, useEffect, useRef } from "react";
import TextInputField from "../ReusableComponents/TextInputField";
import useChangeHandler from "../../hooks/useChangeHandler";
import API from "../../../api/axios";
import MessageBox from "../ReusableComponents/MessageBox";
import FormButton from "../ReusableComponents/FormButton";
import NavBar from "../ReusableComponents/NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

const AddressPage = () => {
  const { formData, setFormData, handleChange, resetForm } = useChangeHandler({
    city: "",
    country: "",
    postal_code: "",
    street: "",
  });

  const userRef = useRef();
  const errRef = useRef();
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await API.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = meRes.data;
        setUserData(user); // contains name, email, phone, id

        // Fetch address if user.id exists
        const addressRes = await API.get(`/addresses/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const address = addressRes.data;
        setAddressId(address.id);
        setFormData({
          city: address.city || "",
          country: address.country || "",
          postal_code: address.postal_code || "",
          street: address.street || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrMsg(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error.message ||
            "An error occurred"
        );
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addressId) {
        // UPDATE address if addressId exists
        const response = await API.put(`/addresses/${addressId}`, formData, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage("Address updated successfully");
        console.log("Address updated:", response.data);
      }
      //  else {
      //   // CREATE address if no addressId is present (this is unlikely now)
      //   const response = await API.post("/addresses", formData, {
      //     headers: {
      //       "Content-type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      //   setMessage("Address created successfully");
      //   setAddressId(response.data.id); // Save the new address ID if needed
      //   console.log("Address created:", response.data);
    } catch (error) {
      console.error("Error submitting address:", error);
      if (!error?.response) {
        setErrMsg("No server response.");
      } else if (error.response?.status === 400) {
        setErrMsg("Invalid input.");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized.");
      } else {
        setErrMsg(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error.message ||
            "An error occurred"
        );
      }

      //  Only focus if the ref exists and is mounted
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  return (
    <>
      <NavBar
        title=""
        isSidebarOpen={showSidebar}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        SidebarComponent={SideBar}
        showProfile={false}
        showNotifications={false}
        showSearch={false}
      />
      <div className="address-form-container">
        <form
          onSubmit={handleSubmit}
          noValidate
          method="POST"
          style={{
            // height: "89vh",
            width: "86.8vw",
            marginLeft: " 50px",
            overflowX: "hidden",
          }}
        >
          {errMsg ? (
            <MessageBox refProp={errRef} message={errMsg} isError={true} />
          ) : message ? (
            <MessageBox message={message} isError={false} />
          ) : null}

          <section className="w-100">
            <h2>Personal Information</h2>

            <TextInputField
              label="Name"
              type="text"
              value={userData?.name || ""}
              refProp={userRef}
            />

            <TextInputField
              label="Email"
              type="email"
              value={userData?.email || ""}
              refProp={userRef}
            />

            <TextInputField
              label="Telephone"
              type="text"
              value={formData?.phone || ""}
              refProp={userRef}
            />
          </section>

          <section className="w-100">
            <h2>Address Information</h2>
            <TextInputField
              label="City"
              showValidationIcons={false}
              type="text"
              name="city"
              id="city"
              refProp={userRef}
              autoComplete="off"
              aria-label="Enter your city"
              value={formData?.city || ""}
              onChange={handleChange}

              // required
            />

            <TextInputField
              label="Country"
              showValidationIcons={false}
              type="text"
              name="country"
              id="country"
              refProp={userRef}
              autoComplete="off"
              value={formData?.country || ""}
              onChange={handleChange}

              // required
            />

            <TextInputField
              label="Postal code"
              showValidationIcons={false}
              type="text"
              name="postal_code"
              id="postal_code"
              refProp={userRef}
              value={formData?.postal_code || ""}
              onChange={handleChange}

              // required
              //
            />

            <TextInputField
              label="Street Address"
              showValidationIcons={false}
              type="text"
              name="street"
              id="street"
              refProp={userRef}
              autoComplete="off"
              value={formData?.street || ""}
              onChange={handleChange}

              // required
            />
          </section>
          <FormButton text="Save" />
        </form>
      </div>
    </>
  );
};

export default AddressPage;
