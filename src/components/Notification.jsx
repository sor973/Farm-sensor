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
import FlexBetween from "./FlexBetween";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Notification = ({ handleOpen, handleClose, open }) => {
  const theme = useTheme();
  const [apiData, setApiData] = React.useState({});
  const [notify, setNotify] = React.useState(false);
  const [tempAir, setTempAir] = React.useState(0);
  const [humidAir, setHumidAir] = React.useState(0);

  const getdata = (e) => {
    e?.preventDefault();
    axios
      .get("http://localhost:8000/api/getuser")
      .then((res) => {
        setApiData(res.data);
        setNotify(res.data.notify);
        setTempAir(res.data.tempAir);
        setHumidAir(res.data.humidAir);
      })
      .catch((err) => console.log(JSON.stringify(err.response.data)));
  };

  const handleChange = (e) => {
    setNotify(e.target.checked);
  };

  const handleTempChange = (e) => {
    setTempAir(e.target.value);
  };

  const handleHumidChange = (e) => {
    setHumidAir(e.target.value);
  };

  const savedata = (e) => {
    e.preventDefault();
    const data = {
      userid: 1,
      notify: notify,
      tempAir: tempAir,
      humidAir: humidAir,
    };
    axios
      .post("http://localhost:8000/api/setnotify", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(JSON.stringify(err.response.data)));
  };

  useEffect(() => {
    getdata();
  }, [open]);

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
              <Switch checked={notify} onChange={handleChange}/>
            </FlexBetween>
            <Box
              sx={{
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "column",
                gap: 3,
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
                  <Input id="Temp-value" type="number" defaultValue={apiData.tempAir} onChange={handleTempChange}/>
                </FormControl>
              </FlexBetween>

              <FlexBetween>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  Set Humid
                </Typography>
                <FormControl>
                  <Input id="humid-value" type="number" defaultValue={apiData.humidAir} onChange={handleHumidChange}/>
                </FormControl>
              </FlexBetween>
            </Box>
            <FlexBetween sx={{ mt: "1.5rem", width: "100%" }}>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" onClick={savedata}>Save</Button>
            </FlexBetween>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Notification;
