import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Check } from "./types";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

type UptimeTableRowProps = { row: Check };
type UptimeTableProps = { rows: Check[] };

const UptimeTableRow: React.FC<UptimeTableRowProps> = ({ row }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <Link to={`${row.id}`}>{row.name}</Link>
      </TableCell>
      <TableCell align="center">
        <Chip label="primary" color="error" size="small" />
      </TableCell>
      <TableCell align="center">
        <Chip label="primary" color="warning" size="small" />
      </TableCell>
    </TableRow>
  );
};

const UptimeTable: React.FC<UptimeTableProps> = ({ rows }) => {
  return (
    <TableContainer sx={{ height: "100%" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name </TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <UptimeTableRow row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UptimeTable;
