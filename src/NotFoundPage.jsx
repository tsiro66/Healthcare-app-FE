import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        height: "90vh",
      }}
    >
      <Typography variant="h2">404 Page Not Found</Typography>
      <Button
        component={Link}
        variant="contained"
        color="primary"
        to="/patients"
      >
        Go Back
      </Button>
      {/* Use Link instead of <a> for client-side routing (Link does not refresh the page) */}
    </Box>
  );
};

export default NotFoundPage;
