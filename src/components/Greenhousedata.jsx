import React from "react";
import StatBox from "./StatBox";
import { WaterDrop, DeviceThermostat, Grass } from "@mui/icons-material";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";

const Greenhousedata = ({ slavedata }) => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const theme = useTheme();
  return (
    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="160px"
      gap="20px"
      sx={{
        "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
      }}
    >
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
    </Box>
  );
};
export default Greenhousedata;
