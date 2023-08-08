import React, { FunctionComponent, useEffect, useState } from "react";

import { Check } from "./types";
import UptimeTable from "./UptimeTable";
import UptimeContainer from "./UptimeContainer";

const CheckList: FunctionComponent = () => {
  const [data, setData] = useState<Check[] | []>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <UptimeContainer>
      <UptimeTable rows={data} />
    </UptimeContainer>
  );
};

export default CheckList;
