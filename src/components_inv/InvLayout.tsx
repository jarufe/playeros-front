import React from "react";
import { Box } from "@mui/material";
import { InvHeader } from "./InvHeader.tsx";
import { Outlet } from "react-router-dom";

export const InvLayout = () => {

  return (
    <Box sx={{height: "100vh"}}>
      <InvHeader />
      <Outlet />
    </Box>
  )
}