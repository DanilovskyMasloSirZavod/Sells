import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";

import { useMemo, useValue, useEffect, useState, useRef } from "react";

import API from "../../API";
import { tokens } from "../../theme";

import FullScreenDialog from "../../components/FullScreenDialog";
import Header from "../../components/Header";
import ToolTipExtended from "../../components/ToolTipExtended";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

import axios from "axios";

const Points = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const PointsChild = (props) => {
        const [tableData, setTableData] = useState([])

        const addresRef = useRef([]);
        const topCounter = useRef(0);

        const [addresState, setAddresState] = useState([]);
        useEffect(() => {
            API.get(`/GetPointsNames`)
                .then(function (response) {
                    response?.data.forEach(x=>{
                        axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.REACT_APP_YANDEX_API_KEY}&geocode=${x}`)
                        .then(function (response) {
                            addresRef.current.push({
                                city: response?.data?.response?.GeoObjectCollection
                                    ?.featureMember[0].GeoObject?.description.split(', ')[0],
                                point: response?.data?.response?.GeoObjectCollection
                                    ?.featureMember[0].GeoObject?.Point?.pos.split(' ').reverse()}
                            );
                          
                        })
                        .catch(function (error) {
                          console.log(error?.response?.data ? error?.response?.data : error?.message);
                        })
                        .finally(()=>{
                            valueUpdater(["Ярославль"], false, true);
                            console.log(addresRef.current)
                        });
                    });
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });


            API.get(`/GetTopPoints`)
                .then(function (response) {
                    let res = [];
                    console.log(response?.data)
                    response?.data.forEach(item => {
                        res.push({
                            id: topCounter.current += 1,
                            addres: item?.pointOfSale?.addres,
                            sumSold: item?.sumSold,      
                            city: item?.pointOfSale?.city,
                            pointOfSale: item?.pointOfSale
                        })
                    });
                    results.current = res;
                    setShowValue(results.current);
                    valueUpdater(["Ярославль"], true)
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
                field: "addres",
                headerName: "Адрес",
                flex: 0.8,
            },
            {
                field: "sumSold",
                headerName: "Выручка",
                flex: 0.8,
                cellClassName: "name-column--cell",
                type: "number",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { sumSold } }) => {
                    return (
                        <ToolTipExtended value={sumSold} text="В рублях" />
                    );
                }
            },
            {
                field: "city",
                headerName: "Город",
                flex: 0.8,
            },         
        ];

        const [showValue, setShowValue] = useState([])
        const results = useRef([]);

        const valueUpdater = (selection, first = false, map = false) => {
            let res = [];
            let res1 = []
            let counter = 0;
            if (selection.length > 0) {
              if (first) {
                selection.forEach(x => {
                  let found = results.current.filter(item => item.city === x)
                  if (found != undefined) {
                    found.forEach(i=>{
                        i.id = (counter += 1);
                        res.push(i);
                    })
                  }
                    
                });
                res[0] != undefined ? setTableData(res) : setTableData([]);
                return;
              }
              if (map) {
                selection.forEach(x => {
                    let found = addresRef.current.filter(item => item.city === x)
                    if (found != undefined) {
                        found.forEach(i=>{
                            res1.push(i.point);
                        })
                      }             
                });
                res1[0] != undefined ? setAddresState(res1) : setAddresState([]);
                return;
              }

              selection.forEach(x => {
                let found = showValue.filter(item => item.city === x)
                  if (found != undefined) {
                    found.forEach(i=>{
                        res.push(i);
                    })
                  }
              });

              selection.forEach(x => {
                let found = addresRef.current.filter(item => item.city === x)
                  if (found != undefined) {
                    found.forEach(i=>{
                        res1.push(i.point);
                    })
                  }
              });

              res.sort((a,b) => parseFloat(b.sumSold) - parseFloat(a.sumSold));
              res.forEach(i=>{
                i.id = (counter += 1);
              })
            }


            res1[0] != undefined ? setAddresState(res1) : setAddresState([]);       
            res[0] != undefined ? setTableData(res) : setTableData([]);
        }

        const setup = (arr, def) => {
            if (arr.length < 1) return [];
            if (arr[0].productName != def)
              arr.unshift({ productName: "Ярославль" });
            return arr;
        }

        return (
            <>
            <Box
                gridColumn="span 3"
                gridRow="span 1"
            >
                 <ComboBoxCheckBoxes changed={valueUpdater} title="Фильтр" inner="Город" defaultVal={{ productName: "Ярославль" }} data={setup([{ productName: "Ярославль" }, { productName: "Данилов" }], "Ярославль")} width="100%" />
            </Box>    
            <YMaps>   
            <Box
                gridColumn="span 14"
                gridRow="span 3"
            >
                {
                         addresState.length > 0 && <Map
                            width="100%"
                            height="100%"
                            defaultState={{
                              center: addresState[0],
                              zoom: 10,
                            }}
                          >
                            {
                                addresState.length > 0 && addresState.map( x => 
                                    <Placemark geometry={x}/>)
                            }
                          </Map>
                }
            </Box>
            </YMaps> 
            <Box
                gridColumn="span 14"
                gridRow="span 3"
            >
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
            </>
        );
    };

    const firstPage = (<PointsChild />);

    const otherPage = (
        <h1>otherPage</h1>
    );

    const rolesForRights = ["Суперадмин"];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Точки" subtitle="Список ваших торговых точек" />
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

export default Points;