import { Chip, Typography, Link as MUILink, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Check } from "./types";
import { Link, useNavigate } from "react-router-dom";

import MonitoringChart from "./MonitoringChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import UptimeContainer from "./UptimeContainer";
import CheckDetailsOptions from "./CheckDetailsOptions";
import DeleteCheckModal from "./DeleteCheckModal";

const CheckDetails: React.FC = () => {
  const [check, setCheck] = useState<Check | null>(null);
  const [isDeleteCheckOpen, setIsDeleteCheckOpen] = useState(false);
  const { checkId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks/${checkId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then((data) => setCheck(data))
      .catch((error) => {
        console.error(error);

        navigate("/checks");
      });
  }, [checkId, navigate]);

  const openModal = () => {
    setIsDeleteCheckOpen(true);
  };

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
        <CheckDetailsOptions
          onDelete={openModal}
          onEdit={() => null}
          onPause={() => null}
        />
      </UptimeContainer>
      <UptimeContainer>
        <MonitoringChart />
      </UptimeContainer>
      <DeleteCheckModal
        open={isDeleteCheckOpen}
        onClose={() => setIsDeleteCheckOpen(false)}
        checkId={checkId}
      />
    </>
  );
};

export default CheckDetails;
