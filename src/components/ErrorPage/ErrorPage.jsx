import React from "react";
import { Container, Typography, Box } from "@mui/material";

const ErrorPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "90vh",
        paddingTop: "40px",
      }}
    >
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h1">Oops!</Typography>
      </Box>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Something went wrong.
      </Typography>
      <Typography variant="body1">
        We're having trouble loading the page. Please try again later.
      </Typography>
    </Container>
  );
};

export default ErrorPage;
