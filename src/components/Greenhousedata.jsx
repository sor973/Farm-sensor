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
      gridTemplateColumns="repeat(6, 1fr)" // change to 6 columns
      gridAutoRows="160px"
      gap="20px"
      sx={{
        "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 6" },
        // set gridColumn for StatBox components to span 2 columns
        "& .statbox": {
          gridColumn: "span 2",
        },
      }}
    >
      <StatBox
        className="statbox" // add className to apply gridColumn styling
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
        className="statbox" // add className to apply gridColumn styling
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
        className="statbox" // add className to apply gridColumn styling
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
