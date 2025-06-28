import React, { useState, useEffect } from "react";
import TextInputField from "../../common/TextInputField";
import LoadingScreen from "../../common/LoadingScreen";
import useChangeHandler from "../../../utils/hooks/useChangeHandler";
import API from "../../../api/axios";
import MessageBox from "../../common/MessageBox";
import FormButton from "../../common/FormButton";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Stack,
  Box,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";

const RootGrid = styled(Grid)(({ theme }) => ({
  minHeight: "100vh",
}));

const StoryBox = styled(Box)(({ theme }) => ({
  // background:
  //   theme.palette.mode === "light"
  //     ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
  //     : "linear-gradient(135deg, #263238 0%, #37474f 100%)",
  color: theme.palette.getContrastText(theme.palette.background.paper),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  margin: "auto",
  padding: theme.spacing(4),
  maxWidth: 400,
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  // width: "100%",
  height: "70%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  maxHeight: "100vh",
  margin: "0 auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
    height: "535px",
    maxHeight: "calc(100vh - 64px)", // Adjust for header height
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(0.5),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const GetAddressForm = () => {
  const { formData, handleChange, resetForm } = useChangeHandler({
    firstname: "",
    lastname: "",
    telephone: "",
    city: "",
    country: "",
    postal_code: "",
    street: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // if no token, take them back to login
      navigate("/login");
      return;
    }
    // Try to save pending address if it exists
    const pendingAddress = localStorage.getItem("pendingAddress");
    if (pendingAddress) {
      const parsedAddress = JSON.parse(pendingAddress);

      API.post("/addresses", parsedAddress)
        .then((response) => {
          localStorage.removeItem("pendingAddress");
          localStorage.setItem("savedAddress", JSON.stringify(response.data));
          console.log("Address saved successfully from pendingAddress");
        })
        .catch((error) => {
          console.error("Failed to save address from pendingAddress:", error);
        });
    }
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if all fields are entered before submission
    if (
      !formData.city.trim() ||
      !formData.country.trim() ||
      !formData.postal_code ||
      !formData.street.trim()
      // !formData.firstname.trim() ||
      // !formData.lastname.trim() ||
      // !formData.telephone
    ) {
      setMessage("All fields are required!");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting form data:", formData);

      const response = await API.post("/addresses", formData);

      console.log("Address created:", response.data);
      // Save address to localStorage for later use
      localStorage.setItem("savedAddress", JSON.stringify(response.data));

      setIsError(false);
      setIsSubmitting(false);
      setMessage("Address created successfully!");

      localStorage.setItem("addressCompleted", "true");

      navigate("/home");

      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error from API:", error.response?.data || error.message);
      setMessage("Failed to create address. Please try again.");
      setIsError(true);
      setIsSubmitting(false);
    } finally {
      setIsLoading(false); //always stops the loader
    }
  };

  return (
    <>
      <SignUpContainer
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          direction: "row",
          minWidth: "100vw",
          minHeight: "100vh",
        }}
      >
        <StoryBox
          sx={{
            px: 2,
            py: 1.5,
            mt: 2,
            // borderRadius: 2,
            backgroundColor: "background.paper",
            //boxShadow: 3, // Material UI elevation
            transform: "translateY(-17px)", // slight lift
          }}
        >
          <Typography
            component="h1"
            variant="h2 outlined"
            sx={{
              width: "100%",
              p: 0.5,
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
            }}
          >
            Tell us a bit about yourself.
          </Typography>
        </StoryBox>
        <Card
          onSubmit={HandleSubmit}
          noValidate
          component="form"
          xs={12}
          md={6}
          sx={{
            maxWidth: "100%",
            //mt: -2,
            // maxHeight: "100%",

            // overflowY: "auto",
          }}
        >
          {/* <Box
            component="form"
            onSubmit={HandleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 1, mt: -10 }}
          > */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              // mt: 3,
            }}
          >
            Personal Details
          </Typography>
          {/* <TextInputField
              id="firstname"
              name="firstname"
              value={formData.firstname}
              label="First Name"
              placeholder="e.g John"
              valid={formData.firstname.trim() !== ""}
              onChange={handleChange}
              required
              showValidationIcons={false}
            />
            <TextInputField
              id="lastname"
              name="lastname"
              value={formData.lastname}
              label="Last Name"
              placeholder="e.g. Doe"
              valid={formData.lastname.trim() !== ""}
              onChange={handleChange}
              required
              showValidationIcons={false}
            />

            <TextInputField
              id="telephone"
              name="telephone"
              value={formData.telephone}
              label="Telephone"
              placeholder="123456789"
              valid={formData.telephone.trim() !== ""}
              onChange={handleChange}
              required
              showValidationIcons={false}
            /> */}

          <TextInputField
            id="city"
            name="city"
            value={formData.city}
            label="City"
            placeholder="Enter city"
            valid={formData.city.trim() !== ""}
            onChange={handleChange}
            required
            showValidationIcons={false}
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
            showValidationIcons={false}
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
            showValidationIcons={false}
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
            showValidationIcons={false}
          />
          {/* Message Box for success or error */}
          <MessageBox
            message={message}
            isError={isError}
            style={{ margin: "0px" }}
          />

          {/* Form submission button */}
          <FormButton
            type="submit"
            variant="contained"
            text={isSubmitting ? "Submitting..." : "Save Address"}
            disabled={isSubmitting}
          />
          {/* </Box> */}
        </Card>
      </SignUpContainer>
    </>
  );
};

export default GetAddressForm;
