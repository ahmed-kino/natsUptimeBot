import { Chip, Typography, Link as MUILink, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Check, Result } from "../types";
import { Link, useNavigate } from "react-router-dom";

import MonitoringChart from "./MonitoringChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import UptimeContainer from "./UptimeContainer";
import CheckDetailsOptions from "./CheckDetailsOptions";
import DeleteCheckModal from "./DeleteCheckModal";
import { JetStreamSubscription } from "nats.ws";
import { useNATS } from "../modules/NATS/NATSContext";
import { CHECKS_URL, SUBJECT } from "../utils/constant";

const CheckDetails: React.FC = () => {
  const [check, setCheck] = useState<Check | null>(null);
  const [isDeleteCheckOpen, setIsDeleteCheckOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const { checkId } = useParams();
  const navigate = useNavigate();

  const { subscribe } = useNATS();

  useEffect(() => {
    let localSub: JetStreamSubscription | undefined;

    fetch(`${CHECKS_URL}${checkId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then((data) => setCheck(data))
      .then(() => {
        subscribe(`${SUBJECT}.${checkId}`, (result: Result) => {
          setResults((previousResults) => [...previousResults, result]);
        }).then((subscription) => {
          localSub = subscription;
        });
      })
      .catch((error) => {
        console.error(error);

        navigate("/checks");
      });
    return () => {
      localSub?.unsubscribe();
    };
  }, [checkId, navigate, subscribe]);

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
        <MonitoringChart results={results} />
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
