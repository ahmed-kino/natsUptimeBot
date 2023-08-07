import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Check } from "./types";
import { Chip, ChipPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { Link } from "react-router-dom";

type UptimeTableRowProps = { row: Check; index: number };
type UptimeTableProps = { rows: Check[] };

// TODO: remove this later when we get real data
const TEMP_COLORS: OverridableStringUnion<
  | "primary"
  | "default"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>[] = ["error", "success", "warning", "secondary"];

const TEMP_LABELS = ["Down", "Up", "Pending", "Maintenance"];

const UptimeTableRow: React.FC<UptimeTableRowProps> = ({ row, index }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <Link to={`${row.id}`}>{row.name}</Link>
      </TableCell>
      <TableCell>
        <div style={{ width: "200px" }}>
          <Chip
            sx={{ width: "100px", borderRadius: 2.5 }}
            label={TEMP_LABELS[index]}
            color={TEMP_COLORS[index]}
            size="small"
          />
        </div>
      </TableCell>
      <TableCell>2023-08-06 13:49:22</TableCell>
      <TableCell>200 - OK</TableCell>
    </TableRow>
  );
};

const UptimeTable: React.FC<UptimeTableProps> = ({ rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>DateTime</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <UptimeTableRow row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UptimeTable;
