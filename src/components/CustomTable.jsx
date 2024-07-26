import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    "@media (max-width: 600px)": {
      fontSize: "10px",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    "@media (max-width: 600px)": {
      fontSize: "10px",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CustomTable = ({
  rows,
  columns,
  onDeleteClick,
  onEditClick,
  idField,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={"center"}
                  sx={{
                    "@media (max-width: 600px)": {
                      display: column.hideOnMobile ? "none" : "table-cell",
                    },
                  }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row[idField]}>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={"center"}
                      component={column.id === idField ? "th" : "td"}
                      scope={column.id === idField ? "row" : undefined}
                      sx={{
                        "@media (max-width: 600px)": {
                          display: column.hideOnMobile ? "none" : "table-cell",
                        },
                      }}
                    >
                      {row[column.id]}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">
                    <IconButton onClick={() => onEditClick(row)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteClick(row[idField])}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length + 1} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomTable;
