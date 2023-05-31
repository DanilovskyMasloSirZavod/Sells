import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";

import { useMemo, useValue, useEffect, useState, useRef } from "react";

import API from "../../API";
import { tokens } from "../../theme";

import moment from 'moment/min/moment-with-locales';

import FullScreenDialog from "../../components/FullScreenDialog";
import Header from "../../components/Header";
import ToolTipExtended from "../../components/ToolTipExtended";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';

const Recommendations = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const RecommendsChild = (props) => {
        moment.locale("ru")
        const [tableData, setTableData] = useState([])

        const [points, setPoints] = useState([])
        const pointRef = useRef([]);
        useEffect(() => {
            API.get(`/GetPointsNames`)
                .then(function (response) {
                    let res = [];
                    response?.data.forEach(x=>{
                        res.push({productName: x})
                    });
                    pointRef.current = res;
                    setPoints(pointRef.current);
                    valueUpdater(pointRef.current[0], true)
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
            });

            API.get(`/GetRecommendations`)
                .then(function (response) {
                    let res = [];
                    console.log(response?.data)
                    response?.data.forEach(item => {
                        res.push({
                            id: item?.id,
                            productName: item?.product?.productName,
                            addres: item?.pointOfSale?.addres,
                            city: item?.pointOfSale?.city,
                            date: item?.date,
                            cost: item?.cost,
                            recommendedCost: item?.recommendedCost,
                            statusType: item?.recommedStates?.statusType
                        })
                    });
                    results.current = res;
                    setShowValue(results.current);
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });
        }, []);

        const columnsPoints = [
            {
                field: "id",
                headerName: "ID",
                flex: 0.8,
            },
            {
                field: "productName",
                headerName: "Продукт",
                flex: 0.7,
            },
            {
                field: "addres",
                headerName: "Адрес",
                flex: 0.8,
            },
            {
                field: "city",
                headerName: "Город",
                flex: 0.3,
            },
            {
                field: "date",
                headerName: "Дата изменения",
                type: "dateTime",
                flex: 0.4,
            },
            {
                field: "cost",
                headerName: "Текущая цена",
                flex: 0.5,
                type: "number",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { cost } }) => {
                    return (
                        <ToolTipExtended value={cost} text="В рублях за 1кг" />
                    );
                }
            },
            {
                field: "recommendedCost",
                headerName: "Рекомендованная цена",
                flex: 0.5,
                type: "number",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { recommendedCost, statusType } }) => {
                    return(
                        <>
                        {statusType == "Предложена новая цена" && <Box sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        <ToolTipExtended value={recommendedCost} text="В рублях за 1кг" />
                        </Box>
                }</>);
                }
            },
            {
                field: "statusType",
                headerName: "Статус",
                flex: 0.4,
                type: "string",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { statusType } }) => {
                    return(<Box display="flex" flexDirection="row" justifyContent="space-around" sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        {
                            statusType == "Принято" && <Typography color="info">{statusType}</Typography>
                        }
                        {
                            statusType == "Отклонено" && <Typography color="error">{statusType}</Typography>
                        }
                        {
                            statusType == "Предложена новая цена" 
                                && <Box display="flex" flexDirection="row" justifyContent="space-around">
                                    <IconButton color="success" aria-label="Принять">
                                        <ThumbUpAltOutlinedIcon />
                                    </IconButton>
                                    <IconButton color="warning" aria-label="Отклонить">
                                        <ThumbDownOffAltOutlinedIcon />
                                    </IconButton>
                                   </Box>
                        }
                        </Box>
                    );
                }
            },
        ];

        const [showValue, setShowValue] = useState([])
        const results = useRef([]);

        const valueUpdater = (selection, first = false) => {
            let res = [];
            let counter = 0;
            if (selection.length > 0) {
              if (first) {
                selection.forEach(x => {
                  let found = results.current.filter(item => item.addres === x)
                  if (found != undefined) {
                    found.forEach(i=>{
                        res.push(i);
                    })
                  }
                    
                });
                res[0] != undefined ? setTableData(res) : setTableData([]);
                return;
              }

              selection.forEach(x => {
                let found = showValue.filter(item => item.addres === x)
                  if (found != undefined) {
                    found.forEach(i=>{
                        res.push(i);
                    })
                  }
              });

              res.sort((a,b) => moment(b.date, "YYYY-MM-DD").toDate() - moment(a.date, "YYYY-MM-DD").toDate());
            }

            res[0] != undefined ? setTableData(res) : setTableData([]);
        }

        const setup = (arr, def) => {
            if (arr.length < 1) return [];
            if (arr[0].productName != def)
              arr.unshift({ productName: def });
            return arr;
        }

        return (
            <Box
                gridColumn="span 14"
                gridRow="span 4"
            >
                {
                    points.length > 0 && <ComboBoxCheckBoxes changed={valueUpdater} title="Фильтр" inner="Адрес точки" defaultVal={points[0]} data={setup(points, points[0].productName)} width="33%" />
                }
                <Box
                    height="100%"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: colors.blueAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.greenAccent[700],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.greenAccent[700],
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.blueAccent[200]} !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${colors.grey[100]} !important`,
                        },
                    }}
                >                                     
                    <DataGrid
                        getRowId={(row) => row.id}
                        rows={tableData}
                        columns={columnsPoints}
                        components={{ Toolbar: GridToolbar }}
                        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                </Box>
            </Box>
        );
    };

    const firstPage = (<RecommendsChild />);

    const otherPage = (
        <h1>otherPage</h1>
    );

    const rolesForRights = ["Суперадмин"];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Рекомендации цен" subtitle="Получайте рекомендации по ценам и следите за историей" />
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(14, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                {
                    props?.rolesArr?.length === 0 ? firstPage
                        : props?.rolesArr?.includes(props?.currentRole?.userRole) ? rolesForRights.includes(props?.currentRole?.userRole)
                            ? firstPage
                            : otherPage
                            : <Typography>Ошибка ролей</Typography>
                }
            </Box>
        </Box>
    );
}

export default Recommendations;