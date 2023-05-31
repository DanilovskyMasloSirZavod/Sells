import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../../API";

import { Box, List, ListItem, Typography } from "@mui/material";
import { FixedSizeList } from "react-window";

import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

import DocumentList from "../../components/DocumentList";

const Profile = (props) => {
    const location = useLocation();
    const [userDocs, setUserDocs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [stats, setStats] = useState({ data: [], keys: [] });

    useEffect(() => {
        API.get(`GetEmployee?id=${props?.currentRole?.nameid}`)
            .then(function (response) {
                setCurrentUser(response?.data);
            })
            .catch(function (error) {
                console.log(error?.response?.data ? error?.response?.data : error?.message);
            });

        API.get(`GetDocuments?employeeId=${props?.currentRole?.nameid}`)
            .then(function (response) {
                setUserDocs(response?.data);
            })
            .catch(function (error) {
                console.log(error?.response?.data ? error?.response?.data : error?.message);
            });

        API.get(`GetStatsOfEmployee?employeeId=${props?.currentRole?.nameid}`)
            .then(function (response) {
                setStats({ data: response?.data?.data, keys: response?.data.keys });
            })
            .catch(function (error) {
                console.log(error?.response?.data ? error?.response?.data : error?.message);
            });
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Профиль" subtitle="Ваш профиль" />
            </Box>
            <Box display="flex" justifyContent="space-between" flexDirection="row">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h2">
                        {props?.currentRole?.name}
                    </Typography>
                    <Typography variant="h3" marginTop={1}>
                        {currentUser?.phone}
                    </Typography>
                    <Typography variant="h3" marginTop={1}>
                        {`Должность: ${currentUser?.job?.position?.positionName}`}
                    </Typography>
                    <Typography variant="h3" marginTop={1}>
                        {`Место работы: ${currentUser?.job?.exact?.clarification || "ДМСЗ"} (${currentUser?.job?.place?.workPlace})`}
                    </Typography>
                    <Typography variant="h3" marginTop={1}>
                        {`Принят на работу: ${new Date(Date.parse(currentUser && currentUser?.dateOfEmployment))
                            .toLocaleString('ru-RU', {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}`}
                    </Typography>
                    <DocumentList userDocs={userDocs} height={500} width={500} itemSize={30}/>
                </Box>
                <Box m="-20px 0 0 0" height="500px" width="60%">
                    <BarChart keys={stats.keys} data={stats.data} bottom="Период" left="Тонны" />
                </Box>
            </Box>
        </Box>);
}

export default Profile;