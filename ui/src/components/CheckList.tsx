import React, { FunctionComponent, useEffect, useState } from "react";

import { Check } from "./types";
import UptimeTable from "./UptimeTable";
import UptimeContainer from "./UptimeContainer";
import { Button, Typography } from "@mui/material";
import AddCheck from "./AddCheck";

const CheckList: FunctionComponent = () => {
  const [data, setData] = useState<Check[] | []>([]);
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  const [fetchCheckList, setFetchCheckList] = useState(false);

  const openModal = () => {
    setIsAddCheckOpen(true);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks`)
      .then((response) => response.json())
      .then((data) => setData(data))
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
        <UptimeTable rows={data} />
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
