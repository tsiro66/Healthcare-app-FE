import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField } from "@mui/material";

const Searchbar = () => {
  return (
    <Box>
      <SearchIcon sx={{ m: 1 }} />
      <TextField size="small" variant="outlined" label="Search"></TextField>
    </Box>
  );
};

export default Searchbar;
