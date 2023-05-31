import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";

import { useMemo, useValue, useEffect, useState, useRef } from "react";

import API from "../../API";
import { tokens } from "../../theme";
import { monthsArr } from "../../components/Utils"

import Header from "../../components/Header";
import FullScreenDialog from "../../components/FullScreenDialog";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";
import BarChart from "../../components/BarChart"

import { unique, changer } from "../../components/Utils"

import moment from "moment/min/moment-with-locales";

const Contacts = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    moment.locale("ru")
    const ContactChild = (props) => {
        const [click, setClick] = useState(false);
        const [employeeObj, setEmployeeObj] = useState({});

        const handleWithEmplOpen = (val) => {
            setClick(true);
            API.get(`/GetEmployeeInfo?employeeId=${val.id}`)
                .then(function (response) {
                    console.log(response?.data);
                    setEmployeeObj(response?.data);
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });
        }

        const topCounter = useRef(0);
        useEffect(() => {
            API.get(`/GetEmployeesSellingStats`)
                .then(function (response) {
                    let res = [];
                    response?.data.forEach(item => {
                        res.push({
                            id: topCounter.current += 1,
                            employeeName: `${item?.employee?.surname} ${item?.employee?.name} ${item?.employee?.patronymic}`,
                            addres: item?.pointOfSale?.addres,
                            city: item?.city,
                            sum: item?.sumSold,
                            employeeId: item?.employee?.id
                        })
                    });
                    resultsForEmployees.current = res;
                    setShowValuesEmployees(resultsForEmployees.current);
                    valueUpdaterForEmployees(["Ярославль"], true)
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });

            API.get('/GetEmployeesBarChart')
                .then(function (response) {
                    let res = response?.data.data;
                    let arr = [];
                    res.forEach(x => {
                        let splitedd = changer(x).split(',');
                        let temp = "";
                        for (let i = 1; i < splitedd.length; i++) {
                            if (i === splitedd.length - 1) {
                                temp += splitedd[i];
                                break;
                            }
                            temp += splitedd[i] + ",";
                        }
                        let splited = [splitedd[0] += ',', temp];
                        let ans = splited[0];
                        let iss = res.filter(i => i.includes(splited[0]) !== false && i != x);
                        iss.forEach(o => {
                            ans += ((changer(o).split(',')[1]).slice(0, -1) + ',');
                        });
                        let obj = JSON.parse(ans + splited[1]);
                        obj.id = moment(obj.id, "DD.MM.YYYY").toDate()
                        arr.push(obj);
                    })

                    arr.sort((a, b) => a.id - b.id);


                    arr.forEach(x => {
                        moment.locale('ru');
                        x.id = moment(x.id).format("MMMM");
                    })
                    arr = unique(arr);
                    allBarChartData.current.data = arr;
                    allBarChartData.current.keys = response?.data?.keys;
                    valueUpdaterForBarChart([moment(new Date).format("MMMM")], true)
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });

            API.get(`/GetTopOfEmployeesSellingStats?totime=${moment(new Date()).format("DD-MM-YYYY")}`)
                .then(function (response) {
                    topCounter.current = 0;
                    let res = [];
                    response?.data.forEach(item => {
                        res.push({
                            id: topCounter.current += 1,
                            employeeName: `${item?.employee?.surname} ${item?.employee?.name} ${item?.employee?.patronymic}`,
                            city: item?.city,
                            sum: item?.sumSold,
                            employeeId: item?.employee?.id,
                            dateOfSell: moment(item?.dateOfSell).format("MMMM")
                        })
                    });
                    resultsForTop.current = res;
                    setShowValuesTop(resultsForTop.current);
                    valueUpdaterForTop([moment(new Date).format("MMMM")], true)
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });

        }, []);

        const columnsContactInfo = [
            {
                field: "id",
                headerName: "ID",
                flex: 0.2,
            },
            {
                field: "addres",
                headerName: "Место работы",
                flex: 1,
            },
            {
                field: "employeeName",
                headerName: "ФИО",
                flex: 1,
                cellClassName: "name-column--cell",
                renderCell: ({ row: { employeeName, employeeId } }) => {
                    return (<Box sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen({ id: employeeId })}>
                            {employeeName}
                        </Typography>
                        <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
                            <Box sx={{ m: 5 }}>
                                <h1>{employeeObj && `${employeeObj?.employee?.surname} ${employeeObj.employee?.name} ${employeeObj?.employee?.patronymic}`}</h1>
                                <h1>Продавец</h1>
                                <h1>{employeeObj && employeeObj?.pointOfSale?.addres + ` (${employeeObj?.pointOfSale?.city})`}</h1>
                                <h1>Номер телефона: {employeeObj && employeeObj?.employee?.phone}</h1>
                                <h1>Взят на работу: {new Date(Date.parse(employeeObj && employeeObj?.employee?.dateOfEmployment))
                                    .toLocaleString('ru-RU', {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}</h1>
                                <Button
                                    sx={{
                                        backgroundColor: colors.greenAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                        "&:hover": {
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                    }}
                                >
                                    Перейти в чат
                                </Button>
                            </Box>
                        </FullScreenDialog>
                    </Box>
                    );
                }
            },
            {
                field: "city",
                headerName: "Город",
                flex: 0.8,
            },
            {
                field: "sum",
                headerName: "Выручка",
                flex: 0.8,
            },
        ];

        const [tableDataEmployees, setTableDataEmployees] = useState([])
        const [showValuesEmployees, setShowValuesEmployees] = useState([])
        const resultsForEmployees = useRef([]);
        const valueUpdaterForEmployees = (selection, first = false) => {
            let res = [];
            let counter = 0;
            if (selection.length > 0) {
                if (first) {
                    selection.forEach(x => {
                        let found = resultsForEmployees.current.filter(item => item.city === x)
                        if (found != undefined) {
                            found.forEach(i => {
                                i.id = (counter += 1);
                                res.push(i);
                            })
                        }

                    });
                    res[0] != undefined ? setTableDataEmployees(res) : setTableDataEmployees([]);
                    return;
                }

                selection.forEach(x => {
                    let found = showValuesEmployees.filter(item => item.city === x)
                    if (found != undefined) {
                        found.forEach(i => {
                            res.push(i);
                        })
                    }
                });

                res.sort((a, b) => parseFloat(b.sum) - parseFloat(a.sum));
                res.forEach(i => {
                    i.id = (counter += 1);
                })
            }

            res[0] != undefined ? setTableDataEmployees(res) : setTableDataEmployees([]);
        }

        const setup = (arr, def) => {
            if (arr.length < 1) return [];
            if (arr[0].productName != def)
                arr.unshift({ productName: def });


            arr = arr.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.productName === value.productName
                ))
            )

            return arr;
        }

        const columnsTop = [
            {
                field: "id",
                headerName: "ID",
                flex: 0.4,
            },
            {
                field: "employeeName",
                headerName: "ФИО",
                flex: 1,
                cellClassName: "name-column--cell",
                renderCell: ({ row: { employeeName, employeeId } }) => {
                    return (<Box sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen({ id: employeeId })}>
                            {employeeName}
                        </Typography>
                        <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
                            <Box sx={{ m: 5 }}>
                                <h1>{employeeObj && `${employeeObj?.employee?.surname} ${employeeObj.employee?.name} ${employeeObj?.employee?.patronymic}`}</h1>
                                <h1>Продавец</h1>
                                <h1>{employeeObj && employeeObj?.pointOfSale?.addres + ` (${employeeObj?.pointOfSale?.city})`}</h1>
                                <h1>Номер телефона: {employeeObj && employeeObj?.employee?.phone}</h1>
                                <h1>Взят на работу: {new Date(Date.parse(employeeObj && employeeObj?.employee?.dateOfEmployment))
                                    .toLocaleString('ru-RU', {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}</h1>
                                <Button
                                    sx={{
                                        backgroundColor: colors.greenAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                        "&:hover": {
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                    }}
                                >
                                    Перейти в чат
                                </Button>
                            </Box>
                        </FullScreenDialog>
                    </Box>
                    );
                }
            },
            {
                field: "city",
                headerName: "Город",
                flex: 1,
            },
            {
                field: "sum",
                headerName: "Выручка",
                flex: 0.8,
            },
        ];

        const [tableDataTop, setTableDataTop] = useState([])
        const [showValuesTop, setShowValuesTop] = useState([])
        const resultsForTop = useRef([]);
        const valueUpdaterForTop = (selection, first = false) => {
            let res = [];
            let counter = 0;
            if (selection.length > 0) {
                if (first) {
                    selection.forEach(x => {
                        let found = resultsForTop.current.filter(item => item.dateOfSell === x)
                        if (found != undefined) {
                            found.forEach(i => {
                                i.id = (counter += 1);
                                res.push(i);
                            })
                        }

                    });
                    res[0] != undefined ? setTableDataTop(res) : setTableDataTop([]);
                    return;
                }

                selection.forEach(x => {
                    let found = showValuesTop.filter(item => item.dateOfSell === x)
                    if (found != undefined) {
                        found.forEach(i => {
                            res.push(i);
                        })
                    }
                });

                res.sort((a, b) => parseFloat(b.sum) - parseFloat(a.sum));
                res.forEach(i => {
                    i.id = (counter += 1);
                })
            }

            res[0] != undefined ? setTableDataTop(res) : setTableDataTop([]);
        }

        const allBarChartData = useRef({ data: [], keys: [] })
        const [barChartData, setBarChartData] = useState({ data: [], keys: [] })
        const valueUpdaterForBarChart = (selection, first = false) => {
            let res = [];
            if (selection.length > 0) {
                if (first) {
                    selection.forEach(x => {
                        let found = allBarChartData.current?.data.filter(item => item.id === x)
                        if (found != undefined) {
                            found.forEach(i => {
                                res.push(i);
                            })
                        }
                    });
                    res[0] != undefined ? setBarChartData({ data: res, keys: allBarChartData.current.keys }) : setBarChartData({ data: [], keys: [] });
                    return;
                }

                selection.forEach(x => {
                    let found = allBarChartData.current?.data.filter(item => item.id === x)
                    if (found != undefined) {
                        found.forEach(i => {
                            res.push(i);
                        })
                    }
                });
            }

            res[0] != undefined ? setBarChartData({ data: res, keys: allBarChartData.current.keys }) : setBarChartData({ data: [], keys: [] });
        }

        return (
            <>
                {/* Карточка со столбчатым графиком. */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 3"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Выручка сотрудников
                            </Typography>
                        </Box>
                        <ComboBoxCheckBoxes changed={valueUpdaterForBarChart} title="Фильтр" inner="Месяц" defaultVal={{ productName: moment(new Date).format("MMMM") }} data={setup(monthsArr, moment(new Date).format("MMMM"))} width="43%" />
                    </Box>
                    <Box height="350px">
                        <BarChart keys={barChartData.keys} data={barChartData.data} bottom="Период" left="Рубли" />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 6"
                    gridRow="span 3"
                >
                    <Box
                        height="89%"
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
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h3">Топ сотрудников</Typography>
                            <ComboBoxCheckBoxes changed={valueUpdaterForTop} title="Фильтр" inner="Месяц" defaultVal={{ productName: moment(new Date).format("MMMM") }} data={setup(monthsArr, moment(new Date).format("MMMM"))} width="43%" />
                        </Box>
                        <DataGrid
                            getRowId={(row) => row.id}
                            rows={tableDataTop}
                            columns={columnsTop}
                            components={{ Toolbar: GridToolbar }}
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                    </Box>
                </Box>
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
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h3">Список сотрудников</Typography>
                            <ComboBoxCheckBoxes changed={valueUpdaterForEmployees} title="Фильтр" inner="Город" defaultVal={{ productName: "Ярославль" }} data={setup([{ productName: "Ярославль" }, { productName: "Данилов" }], "Ярославль")} width="43%" />
                        </Box>
                        <DataGrid
                            getRowId={(row) => row.id}
                            rows={tableDataEmployees}
                            columns={columnsContactInfo}
                            components={{ Toolbar: GridToolbar }}
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                    </Box>
                </Box>
            </>
        );
    };

    const firstPage = (<ContactChild />);

    const otherPage = (
        <h1>otherPage</h1>
    );

    const rolesForRights = ["Суперадмин"];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Сотрудники" subtitle="Список ваших сотрудников" />
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(14, 1fr)"
                gridAutoRows="140px"
                gap="40px"
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

export default Contacts;