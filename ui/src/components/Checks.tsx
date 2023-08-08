import React, { FunctionComponent, useEffect, useState } from "react";

import { Check } from "./types";
import UptimeTable from "./UptimeTable";

const Checks: FunctionComponent = () => {
  const [data, setData] = useState<Check[] | []>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return <UptimeTable rows={data} />;
};

export default Checks;
