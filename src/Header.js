import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Header({ onOpenModal }) {
  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ background: "rgba(255, 255, 255, 0.8)" }}
    >
      <Toolbar sx={{ justifyContent: "space-around" }}>
        <Button onClick={() => onOpenModal("userDetail")} color="inherit">
          <Typography variant="h6" sx={{ textTransform: "none" }}>
            User Detail
          </Typography>
        </Button>
        <Button onClick={() => onOpenModal("compareUsers")} color="inherit">
          <Typography variant="h6" sx={{ textTransform: "none" }}>
            Compare Users
          </Typography>
        </Button>
        <Button onClick={() => onOpenModal("information")} color="inherit">
          <Typography variant="h6" sx={{ textTransform: "none" }}>
            Information
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
