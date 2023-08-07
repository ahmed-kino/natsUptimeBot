import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import SideDrawer from "./components/SideDrawer";
import Checks from "./components/Checks";
import Dashboard from "./components/Dasboard";
import { styled } from "@mui/material";
import CheckDetails from "./components/CheckDetails";

const UptimeRoot = styled("div")(({ theme }) => ({
  display: "flex",
}));

const UptimeContent = styled("div")(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(3),
}));

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <UptimeRoot>
      <SideDrawer />
      <UptimeContent>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="checks" element={<Checks />} />
          <Route path={`checks/:checkId`} element={<CheckDetails />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </UptimeContent>
    </UptimeRoot>
  );
};

export default App;
