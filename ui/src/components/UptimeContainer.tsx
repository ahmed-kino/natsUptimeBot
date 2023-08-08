import React, { ReactNode } from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

interface UptimeContainerProps {
  children: ReactNode;
}

const StyledUptimeContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(1),
  margin: theme.spacing(2),
}));

const UptimeContainer: React.FC<UptimeContainerProps> = ({ children }) => {
  return <StyledUptimeContainer>{children}</StyledUptimeContainer>;
};

export default UptimeContainer;
