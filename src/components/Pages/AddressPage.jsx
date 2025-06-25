import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import TextInputField from "../common/TextInputField";
import useChangeHandler from "../../utils/hooks/useChangeHandler";
import API from "../../api/axios";
import MessageBox from "../common/MessageBox";
import FormButton from "../common/FormButton";
import { Grid, Container, Typography, Box } from "@mui/material";
import usePageNavigation from "../../utils/hooks/PageNavigation/usePageNavigation";

const AddressPage = ({ onToggleSideBar }) => {
  const { formData, setFormData, resetForm } = useChangeHandler({
    firstname: "",
    lastname: "",
    telephone: "",
    city: "",
    country: "",
    postal_code: "",
    street: "",
  });

  const userRef = useRef();
  const errRef = useRef();
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [addressId, setAddressId] = useState(null);

  const capitalizeFirst = (str) =>
    str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1) : "";

  const token = localStorage.getItem("token");

  // Load address on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get("/users/me");
        const user = res.data;
        console.log("API response user data:", user); // Check the raw user object
        // Set form data with the parsed address values
        setFormData((prev) => {
          const newFormData = {
            ...prev,
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email || "",
            telephone: user.telephone || "",
            city: user.address?.city || "",
            country: user.address?.country || "",
            postal_code: user.address?.postal_code || "",
            street: user.address?.street || "",
          };
          console.log(
            "setFormData (new state for lastname):", //remove this after debugging
            newFormData.lastname //remove this after debugging
          ); // Check what's being set
          return newFormData; //remove this after debugging
        });
        if (user.address?.id) {
          setAddressId(user.address.id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setErrMsg("Failed to load profile data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setMessage("");
    setErrMsg("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to build address data
  const getAddressData = () => ({
    street: formData.street,
    city: formData.city,
    postal_code: formData.postal_code,
    country: formData.country,
  });

  // Helper to update address
  const updateAddress = async (id, data) => {
    const res = await API.put(`/addresses/${id}`, data);
    if (res.status >= 200 && res.status < 300) {
      setMessage("Address updated successfully.");
    } else {
      throw new Error("Failed to update address.");
    }
  };

  // Helper to create address
  const createAddress = async (data) => {
    const res = await API.post("/addresses", data);
    if (res.status >= 200 && res.status < 300) {
      setAddressId(res.data.id);
      setMessage("Address created successfully.");
    } else {
      throw new Error("Failed to create address.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrMsg("");
    setLoading(true);

    const addressData = getAddressData();

    try {
      if (addressId) {
        await updateAddress(addressId, addressData);
      } else {
        await createAddress(addressData);
      }
    } catch (error) {
      console.error(
        "Error updating/creating address:",
        error.response?.data || error.message
      );
      setErrMsg("Failed to update address. Please try again.");
      if (errRef.current) {
        errRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading profile data...</p>;
  // Add a console.log right before rendering the TextInputField
  console.log("Current formData.lastname before render:", formData.lastname);
  return (
    <Layout>
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          display: "flex",
          justifyContent: "center",
          pt: { xs: "56px", sm: "64px" },
          width: "100%", // Ensure it doesn't exceed viewport width
          // overflowX: "hidden",
          boxSizing: "border-box",
          // maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          method="POST"
          style={{
            // height: "89vh",
            width: "100%",
            margin: "0 auto",
            // overflowX: "hidden",
            maxWidth: 900,
          }}
        >
          {errMsg ? (
            <MessageBox
              refProp={errRef}
              message={errMsg}
              isError={true}
              style={{
                display: "block",
                margin: "-25px auto 5px auto",
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 500,
              }}
            />
          ) : message ? (
            <MessageBox
              message={message}
              isError={false}
              style={{
                display: "block",
                margin: "-25px auto 5px auto",
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 500,
              }}
            />
          ) : null}

          <Box className="w-100 mb-3" sx={{ marginBottom: "20px" }}>
            <Typography variant="h4" gutterBottom>
              Personal Information
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              sx={{ paddingX: "20px" }}
              className="mb-3" //remove this after debugging
            >
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  fullWidth
                  label="First name"
                  name="firstname"
                  id="firstname"
                  showValidationIcons={false}
                  type="text"
                  value={capitalizeFirst(formData.firstname)}
                  refProp={userRef}
                  onChange={handleChange}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "40%" }}>
                <TextInputField
                  fullWidth
                  label="Last name"
                  name="lastname"
                  id="lastname"
                  showValidationIcons={false}
                  type="text"
                  value={capitalizeFirst(formData.lastname)}
                  refProp={userRef}
                  onChange={handleChange}
                  readOnly={true}
                  //style={{ paddingX: "50px" }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              xs={12}
              md={12}
              sx={{ width: "100%", paddingX: "20px" }}
              fullWidth
              className="mb-3"
            >
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="Email"
                  showValidationIcons={false}
                  name="email"
                  id="email"
                  type="email"
                  value={(formData.email || "").trim().toLowerCase()}
                  refProp={userRef}
                  onChange={handleChange}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="Telephone"
                  showValidationIcons={false}
                  name="telephone"
                  id="telephone"
                  type="text"
                  value={formData.telephone || ""}
                  refProp={userRef}
                  onChange={handleChange}
                  readOnly={true}
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="w-100">
            <Typography variant="h4" gutterBottom>
              Address Information
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              xs={12}
              md={12}
              sx={{ width: "100%", paddingX: "20px" }}
              fullWidth
              className="mb-3"
            >
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="City"
                  showValidationIcons={false}
                  type="text"
                  name="city"
                  id="city"
                  refProp={userRef}
                  autoComplete="off"
                  aria-label="Enter your city"
                  value={capitalizeFirst(formData.city)}
                  onChange={handleChange}
                  // required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="Country"
                  showValidationIcons={false}
                  type="text"
                  name="country"
                  id="country"
                  refProp={userRef}
                  autoComplete="off"
                  value={capitalizeFirst(formData.country)}
                  onChange={handleChange}
                  // required
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              xs={12}
              md={12}
              sx={{ width: "100%", paddingX: "20px" }}
              fullWidth
              className="mb-3"
            >
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="Postal code"
                  showValidationIcons={false}
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  refProp={userRef}
                  value={formData.postal_code || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  label="Street Address"
                  showValidationIcons={false}
                  type="text"
                  name="street"
                  id="street"
                  refProp={userRef}
                  autoComplete="off"
                  value={capitalizeFirst(formData.street)}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
          <FormButton
            type="submit"
            variant="contained"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //width: "100%",
              margin: "50px",
            }}
            color={"primary"}
            disabled={loading}
            text={addressId ? "Update Address" : "Save Address"}
          />
        </form>
      </Container>
    </Layout>
  );
};

export default AddressPage;
