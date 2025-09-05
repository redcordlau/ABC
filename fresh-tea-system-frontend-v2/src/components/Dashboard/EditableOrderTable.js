import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";

export default class EditableOrderTable extends React.Component {
  render = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
      },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      "&:last-child td, &:last-child th": {
        border: 0,
      },
    }));

    var i = 1;
    const { rows } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="order table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 5 }}>#</StyledTableCell>
              <StyledTableCell sx={{ width: 150 }}>Name</StyledTableCell>
              <StyledTableCell>Food/Drink</StyledTableCell>
              <StyledTableCell sx={{ width: 100 }}>Remark</StyledTableCell>
              <StyledTableCell align="right" sx={{ width: 20 }}></StyledTableCell>
              <StyledTableCell align="right" sx={{ width: 20 }}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.user}>
                <StyledTableCell>{i++}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.user}
                </StyledTableCell>
                <StyledTableCell>{row.orderDisplay}</StyledTableCell>
                <StyledTableCell>{row.remark}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton aria-label="edit" size="medium" onClick={(e) => this.props.handleEdit(row)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton aria-label="delete" size="medium" onClick={(e) => this.props.handleDelete(row)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
}
