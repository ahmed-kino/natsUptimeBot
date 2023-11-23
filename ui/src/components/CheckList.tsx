import React, { FunctionComponent, useEffect, useState } from "react";

import { Check } from "../types";
import UptimeTable from "./UptimeTable";
import UptimeContainer from "./UptimeContainer";
import { Button, Typography } from "@mui/material";
import AddCheck from "./AddCheck";
import { CHECKS_URL } from "../utils/constant";

const CheckList: FunctionComponent = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  const [fetchCheckList, setFetchCheckList] = useState(false);

  const openModal = () => {
    setIsAddCheckOpen(true);
  };

  useEffect(() => {
    fetch(CHECKS_URL)
      .then((response) => response.json())
      .then((checks) => setChecks(checks))
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        setFetchCheckList(false);
      });
  }, [fetchCheckList]);

  const fetchCheckListChange = () => {
    setFetchCheckList(true);
  };

  return (
    <>
      <UptimeContainer>
        <Typography variant="h4">Check List</Typography>
        <Button
          variant="contained"
          onClick={openModal}
          style={{ marginLeft: "16px" }}
          color="success"
        >
          Add check
        </Button>
      </UptimeContainer>
      <UptimeContainer>
        <UptimeTable checks={checks} />
      </UptimeContainer>
      <AddCheck
        open={isAddCheckOpen}
        onClose={() => setIsAddCheckOpen(false)}
        fetchCheckList={fetchCheckListChange}
      />
    </>
  );
};

export default CheckList;
