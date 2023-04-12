import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  EditNotificationsOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material";
import Header from "./Header";
import Notification from "./Notification";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const handleNotifOpen = () => setIsNotifOpen(true);
  const handleNotifClose = () => setIsNotifOpen(false);


  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FlexBetween gap="1.5rem">

          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleNotifOpen}>
            <EditNotificationsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <Notification
            handleOpen={handleNotifOpen}
            handleClose={handleNotifClose}
            open={isNotifOpen}
          />
        </FlexBetween>
        <FlexBetween>
          <Box display="flex" alignItems="center" gap="0.5rem">
            <Header title="SMARTFARM"  />
          </Box>
        </FlexBetween>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
