import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Check, Result } from "../types";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { useNATS } from "../modules/NATS/NATSContext";
import { JetStreamSubscription } from "nats.ws";
import { SUBJECT } from "../utils/constant";
import { ChipStatusCode, ChipStatusCodeType } from "../utils/statusCodeColor";

type UptimeTableRowProps = { check: Check };
type UptimeTableProps = { checks: Check[] };

const UptimeTableRow: React.FC<UptimeTableRowProps> = ({ check }) => {
  const { subscribe } = useNATS();
  const [result, setResult] = useState<Result>();
  const [chipStatusCode, setChipStatusCode] = useState<ChipStatusCodeType>();

  useEffect(() => {
    let localSub: JetStreamSubscription | undefined;

    subscribe(`${SUBJECT}.${check.id}`, (result: Result) => {
      setResult(result);
    }).then((subscription) => {
      localSub = subscription;
    });

    setChipStatusCode(ChipStatusCode(check, result));
    return () => {
      localSub?.unsubscribe();
    };
  }, [subscribe, check, result]);

  return (
    <TableRow
      key={check.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <Link to={`${check.id}`}>{check.name}</Link>
      </TableCell>
      <TableCell>
        <div style={{ width: "200px" }}>
          <Chip
            sx={{ width: "100px", borderRadius: 2.5 }}
            label={chipStatusCode?.label}
            color={chipStatusCode?.color}
            size="small"
          />
        </div>
      </TableCell>
      <TableCell>{result?.timestamp}</TableCell>
      <TableCell>
        {result?.data.status_code} - {result?.data.reason}
      </TableCell>
    </TableRow>
  );
};

const UptimeTable: React.FC<UptimeTableProps> = ({ checks }) => {
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
          {checks.map((check, index) => (
            <UptimeTableRow key={index} check={check} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UptimeTable;
