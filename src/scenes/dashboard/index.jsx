import React, { useState, useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";

import { Box, useTheme, useMediaQuery } from "@mui/material";

import OverviewChart from "../../components/OverviewChart";
import { useGetDashboardQuery } from "../../state/api";

import Greenhousedata from "../../components/Greenhousedata";
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [apiData, setApiData] = React.useState([]);
  const [apidayData, setApidayData] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/getdata");
        setApiData(res.data);
      } catch (err) {
        console.log(JSON.stringify(err.response.data));
      }
    };

    const getdaydata = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/daydata");
        setApidayData(res.data);
      } catch (err) {
        console.log(JSON.stringify(err.response.data));
      }
    };
    const usefunc = async () => {
      getdaydata();
      fetchData();
    }
    
    const intervalId = setInterval(usefunc, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </FlexBetween>
      {apiData.map((data, index) => (
        <Greenhousedata key={index} slavedata={data} />
      ))}
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
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          style={{ marginBottom: "2rem" }}
        >
          <OverviewChart view="sales" isDashboard={true} daydata={apidayData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
