import React from "react";
import StatBox from "./StatBox";
import { WaterDrop, DeviceThermostat, Grass } from "@mui/icons-material";
import { Typography, Box, useTheme } from "@mui/material";

const Greenhousedata = ({ slavedata }) => {
  const theme = useTheme();
  return (
    <div>
      <StatBox
        title="Temperature"
        value={slavedata.tempAir}
        description={`Greenhouse ${slavedata.slaveid}`}
        icon={
          <DeviceThermostat
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />
        }
      />
      <StatBox
        title="Air Humidity"
        value={slavedata.humidAir}
        description={`Greenhouse ${slavedata.slaveid}`}
        icon={
          <WaterDrop
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />
        }
      />
      <StatBox
        title="Soil Humidity"
        value={slavedata.humidSoil}
        description={`Greenhouse ${slavedata.slaveid}`}
        icon={
          <Grass
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />
        }
      />
    </div>
  );
};
export default Greenhousedata;
