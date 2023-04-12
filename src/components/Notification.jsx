import {
  Typography,
  Box,
  useTheme,
  Modal,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";

const Notification = ({ handleOpen, handleClose, open }) => {
  const theme = useTheme();

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            maxWidth: "600px",
            height: "auto",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem",
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="0.8rem"
          >
            <Typography
              variant="h4"
              color={theme.palette.secondary[100]}
              fontWeight="bold"
              sx={{ mb: "7px" }}
            >
              Notification Settings
            </Typography>
            
            <FlexBetween gap="1.5rem">
              <Typography
                variant="subtitle1"
                sx={{ color: theme.palette.secondary[100] }}
              >
                Line Notify
              </Typography>
              <Switch />
            </FlexBetween>
            <Box
              sx={{
                justifyContent: "flex-start", 
                display: "flex", 
                flexDirection: "column", 
                gap: 3 
              }}
            >
              <FlexBetween>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  Set Temp
                </Typography>
                <FormControl>
                  <Input id="Temp-value" type="number" />
                </FormControl>
              </FlexBetween>

              <FlexBetween >
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  Set Humid
                </Typography>
                <FormControl>
                  <Input id="humid-value" type="number" />
                </FormControl>
              </FlexBetween>
            </Box>
            <FlexBetween sx={{ mt: "1.5rem", width: "100%" }}>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained">Save</Button>
            </FlexBetween>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Notification;
