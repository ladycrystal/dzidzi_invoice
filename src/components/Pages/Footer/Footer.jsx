import React from "react";

import { Box, Typography, Link, Container, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Box for the footer background and padding
const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Or theme.palette.background.paper if you prefer lighter
  color: theme.palette.primary.contrastText, // Text color contrasting with the background
  padding: theme.spacing(3.15, 2), // Vertical and horizontal padding
  marginTop: theme.spacing(6), // Add some space above the footer
  width: "100vw", // Ensure it takes full width
  boxSizing: "border-box", // Include padding in the element's total width and height
  borderTop: `1px solid ${theme.palette.divider}`,
  position: "relative", // Fix the footer at the bottom of the page
  bottom: 0, // Position it at the bottom
  right: 0, // Align to the right
  left: 0,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "inherit", // Inherit color from parent (FooterWrapper)
  textDecoration: "none", // Remove underline
  fontWeight: 500,
  fontSize: "1rem",
  transition: "color 0.2s", // Smooth color transition on hover
  "&:hover": {
    color: theme.palette.primary.dark,
    textDecoration: "underline", // Add underline on hover
  },
}));

const Footer = ({
  companyName = "DZIDZI Invoicing",
  links = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Contact Us", href: "/contact-us" },
  ],
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper component="footer">
      <Container maxWidth="lg">
        {" "}
        {/* Max width for content within the footer */}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Copyright Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Typography variant="body2">
              © {currentYear}
              {companyName}. All rights reserved.
            </Typography>
          </Grid>

          {/* Navigation Links Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "center", md: "right" } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Stack vertically on small, row on medium+
                justifyContent: { xs: "center", md: "flex-end" }, // Center on small, right-align on medium+
                alignItems: "center",
                gap: { xs: 1, md: 3 }, // Spacing between links
              }}
            >
              {links.map((link) => (
                <StyledLink key={link.href} href={link.href}>
                  {link.label}
                </StyledLink>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
