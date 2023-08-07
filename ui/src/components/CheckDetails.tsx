import { Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Check } from "./types";

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
      <Typography variant="h4"> Name: {check?.name}</Typography>
      <Typography variant="h6">
        Target name: {check?.target.domain_name}
      </Typography>
      <Typography variant="h6">
        Status: <Chip label="pending" color="warning" size="small" />
      </Typography>
    </>
  );
};

export default CheckDetails;
