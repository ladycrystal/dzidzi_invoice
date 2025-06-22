import React, { useState, useEffect, useRef } from "react";
import TextInputField from "../ReusableComponents/TextInputField";
import useChangeHandler from "../../hooks/useChangeHandler";
import API from "../../../api/axios";
import MessageBox from "../ReusableComponents/MessageBox";
import FormButton from "../ReusableComponents/FormButton";
import NavBar from "../ReusableComponents/NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import { Grid, Container, Typography, Box } from "@mui/material";
import Footer from "../Footer/Footer";
import usePageNavigation from "../../hooks/PageNavigation/usePageNavigation";

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
  const [showSidebar, setShowSidebar] = useState(false);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrMsg("");
    setLoading(true);

    try {
      // 2. Update/Create Address Information
      const addressData = {
        street: formData.street,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
      };

      console.log(
        "Attempting address operation with ID:",
        addressId,
        "Data:",
        addressData
      );

      let res;
      if (addressId) {
        // If addressId exists, update the existing address
        res = await API.put(`/addresses/${addressId}`, addressData);
        if (res.status >= 200 && res.status < 300) {
          setMessage("Address updated successfully.");
        } else {
          throw new Error("Failed to update address.");
        }
      } else {
        // If no addressId, create a new address
        res = await API.post("/addresses", addressData);
        console.log("Response from address creation:", res);
        // Check if the response is successful
        if (res.status >= 200 && res.status < 300) {
          setAddressId(res.data.id);
          setMessage("Address created successfully.");
        } else {
          throw new Error("Failed to create address.");
        }
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
    <>
      <NavBar
        title=""
        isSidebarOpen={showSidebar}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        SidebarComponent={SideBar}
        showProfile={false}
        showNotifications={false}
        showSearch={false}
        logoSrc=""
      />
      <Container
        maxWidth="xl"
        sx={{ py: 3, display: "flex", justifyContent: "center" }}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          method="POST"
          style={{
            // height: "89vh",
            width: "86.8vw",
            // marginLeft: " 50px",
            overflowX: "hidden",
          }}
        >
          {errMsg ? (
            <MessageBox
              refProp={errRef}
              message={errMsg}
              isError={true}
              style={{
                display: "block",
                margin: "20px auto",
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: "6px",
                //  background: "#e6f4ea", // light green for success
                // color: "#1b5e20",      // dark green text
                fontWeight: 500,
              }}
            />
          ) : message ? (
            <MessageBox
              message={message}
              isError={false}
              style={{
                display: "block",
                margin: "20px auto",
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: "6px",
                //  background: "#e6f4ea", // light green for success
                //  color: "#1b5e20",      // dark green text
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
              xs={12}
              md={12}
              sx={{ width: "100%", paddingX: "20px" }}
              fullWidth
              className="mb-3"
            >
              <Grid item xs={12} md={6} sx={{ width: "40%" }}>
                <TextInputField
                  fullWidth
                  label="First name"
                  name="firstname"
                  id="firstname"
                  showValidationIcons={false}
                  type="text"
                  value={formData.firstname.trim() || ""}
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
                  value={formData.lastname.trim() || ""}
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
                  value={formData.email.trim().toLowerCase() || ""}
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
                  value={formData.city.trim() || ""}
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
                  value={formData.country.trim() || ""}
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
                  value={formData?.street.trim() || ""}
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
      <Footer />

      {/* SideBar component, its visibility is controlled by showSidebar state */}
      <SideBar
        isSideBar={showSidebar} // <--- This prop controls the sidebar's visibility
        isHomePage={false}
        toggleSideBar={() => setShowSidebar((prev) => !prev)} // <--- Allows closing the sidebar from within
      />
    </>
  );
};

export default AddressPage;
