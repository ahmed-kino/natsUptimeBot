import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import SideDrawer from "./components/SideDrawer";
import CheckList from "./components/CheckList";
import Dashboard from "./components/Dasboard";
import { CssBaseline, ThemeProvider, createTheme, styled } from "@mui/material";
import CheckDetails from "./components/CheckDetails";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const UptimeRoot = styled("div")(({ theme }) => ({
  display: "flex",
}));

const UptimeContent = styled("div")(({ theme }) => ({
  flex: 1,
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UptimeRoot>
        <SideDrawer />
        <UptimeContent>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="checks" element={<CheckList />} />
            <Route path={`checks/:checkId`} element={<CheckDetails />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </UptimeContent>
      </UptimeRoot>
    </ThemeProvider>
  );
};

export default App;
