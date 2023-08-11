import { Chip, Typography, Link as MUILink, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Check } from "./types";
import { Link } from "react-router-dom";
import MonitoringChart from "./MonitoringChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import UptimeContainer from "./UptimeContainer";

const CheckDetails: React.FC = () => {
  const [check, setCheck] = useState<Check | null>(null);
  const { checkId } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks/${checkId}`)
      .then((response) => response.json())
      .then((data) => setCheck(data))
      .catch((error) => console.error("Error:", error));
  }, [checkId]);

  return (
    <>
      <UptimeContainer>
        <IconButton component={Link} to="/checks">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h4" style={{ marginLeft: "16px" }}>
          {check?.name}
        </Typography>
      </UptimeContainer>
      <UptimeContainer>
        <MUILink variant="h6">{check?.target.domain_name}</MUILink>
        <Typography variant="h6">
          <Chip
            sx={{ width: "100px", borderRadius: 2.5, marginLeft: "16px" }}
            label="Up"
            color="success"
            size="small"
          />
        </Typography>
      </UptimeContainer>
      <UptimeContainer>
        <MonitoringChart />
      </UptimeContainer>
    </>
  );
};

export default CheckDetails;
