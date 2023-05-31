//mui import
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
//!mui import

//theme and colors import
import { tokens } from "../../theme";
//!theme and colors import

//icons import
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
//!icons import

//react import
import React from "react";
import { useEffect, useState, createContext } from "react";
//!react import

//api import
import API from "../../API";
//!api import

//table import
import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";
//!table import

//custom items import
import FullScreenDialog from "../../components/FullScreenDialog";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";
import EditDialog from "../../components/EditDialog";
import ToolTipExtended from "../../components/ToolTipExtended";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import NavigateButton from "../../components/NavigateButton";
import BarChart from "../../components/BarChart"
import DocumentList from "../../components/DocumentList";
import SimpleDialog from "../../components/SimpleDialog";
import { monthsArr } from "../../components/Utils"
//!custom items import

import moment from 'moment/min/moment-with-locales';

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

import axios from "axios";

import { unique, changer } from "../../components/Utils"

const Dashboard = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentVal, setCurrentVal] = useState("Товары");
  const DashboardContext = createContext({ value: currentVal });

  const DashboardProvider = ({ children }) => {
    const [state, setState] = useState(currentVal);

    const onClick = (selVal) => {
      setState(selVal);
      setCurrentVal(selVal);
    };

    const value = React.useMemo(
      () => ({
        value: state
      }),
      [state]
    );
    return (
      <DashboardContext.Provider value={value}>
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavigateButton title="Товары"
            icon={<PointOfSaleIcon />}
            enabled={"Товары" === currentVal}
            newFuncSelection={() => onClick("Товары")} />
        </Box>
        <Box
          gridColumn="span 4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavigateButton title="Точки"
            icon={<PointOfSaleIcon />}
            enabled={"Точки" === currentVal}
            newFuncSelection={() => onClick("Точки")} />
        </Box>
        {children}
      </DashboardContext.Provider>
    );
  };

  const useValue = () => React.useContext(DashboardContext);

  const ProductsChild = (props) => {
    moment.locale("ru")
    const { value } = useValue();
    const [tableData, setTableData] = useState([])

    const columnsTop = [
      { field: "id", headerName: "ID", flex: 0.4, type: "number" },
      {
        field: "productName",
        headerName: "Продукт",
        flex: 1,
        type: "string",
      },   
      {
        field: "weight",
        headerName: "Продано",
        flex: 1,
        cellClassName: "name-column--cell",
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: ({ row: { weight } }) => {
          return (
            <ToolTipExtended value={weight} text="В кг" />
          );
        }
      }
    ];

    const setup = (arr, def) => {
      if (arr.length < 1) return [];
      if (arr[0].productName != def)
          arr.unshift({productName: def});
      

      arr = arr.filter((value, index, self) =>
          index === self.findIndex((t) => (
              t.productName === value.productName
          ))
        )

      return arr;
    }

    const allBarChartData = React.useRef({data: [], keys: []})
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

    useEffect(() => {
      if (props.title === value) {
        API.get('/GetAmmountWeights')
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

        API.get('/GetTopProducts')
          .then(function (response) {
            let res = [];
            let arrFromResp = response?.data;
            let count = 0;
            arrFromResp.forEach(item => {
              res.push({
                id: count += 1,
                productName: item?.productName,
                weight: item?.weight
              });
            });

            setTableData(res);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });
      }
    }, []);

    return (
      <>
        {props.title === value ?
          <>
            {/* ROW 2 */}
            {/* Карточка со столбчатым графиком. */}
            <Box
              gridColumn="span 16"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="45px"
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
                    Вес проданной продукции
                  </Typography>
                </Box>
                <ComboBoxCheckBoxes changed={valueUpdaterForBarChart} title="Фильтр" inner="Месяц" defaultVal={{ productName: moment(new Date).format("MMMM") }} data={setup(monthsArr, moment(new Date).format("MMMM"))} width="43%" />
              </Box>
              <Box height="300px">
                <BarChart keys={barChartData.keys} data={barChartData.data} bottom="Период" left="Вес (кг)" />
              </Box>
            </Box>
            <Box
              gridColumn="span 16"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                height="400px"
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
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                  rows={tableData}
                  columns={columnsTop}
                  components={{ Toolbar: GridToolbar }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
              </Box>
            </Box>
          </>
          : null}
      </>
    );
  };

  const PointsChild = (props) => {
    const { value } = useValue();
    const [tableData, setTableData] = useState([])
    const [points, setPoints] = useState([])

    const [click, setClick] = useState(false);
    const [pointObj, setPointObj] = useState(null);
    const addresRef = React.useRef(null);
    const [addresState, setAddresState] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);

    const handlePointOpen = (val) => {
      API.get(`/GetPointFullInfoById?id=${val.id}`)
        .then(function (response) {
          addresRef.current = response?.data?.pointOfSale?.addres;

          axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.REACT_APP_YANDEX_API_KEY}&geocode=${addresRef.current}`)
            .then(function (response) {
              addresRef.current = response?.data?.response?.GeoObjectCollection
                ?.featureMember[0].GeoObject?.Point?.pos.split(' ').reverse();
              setAddresState(addresRef.current);
            })
            .catch(function (error) {
              console.log(error?.response?.data ? error?.response?.data : error?.message);
            });
          
          setPointObj(response?.data);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });

      API.get(`/GetPointHistory?pointId=${val.id}`)
        .then(function (response) {
          console.log(response?.data);
          setPointHistory(response?.data);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
      setClick(true);
    }

    const [lineChartData, setLineChartData] = useState([])
    const [showValue, setShowValue] = useState([])
    const results = React.useRef([]);
    const valueUpdater = (selection, first = false) => {
      let res = [];
      if (selection.length > 0) {
        if (first) {
          selection.forEach(x => {
            let found = results.current.find(item => item.id === x)
            if (found != undefined)
              res.push(found);
          });
          res[0] != undefined ? setLineChartData(res) : setLineChartData([]);
          return;
        }

        selection.forEach(x => {
          let found = showValue.find(item => item.id === x)
          if (found != undefined)
            res.push(found);
        });
      }

      res[0] != undefined ? setLineChartData(res) : setLineChartData([]);
    }

    const [barChartData, setBarChartData] = useState({ data: [], keys: [] })
    const count = React.useRef(0);
    useEffect(() => {
      if (props.title === value) {
        API.get('/GetChecks')
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
                let t = changer(o).split(',');
                let e = "";
                for(let k = 1; k < t.length; k++) {
                  e += t[k] + ',';
                }
                let r = e.slice(0, -2)
                ans += (r + ',');
              });
              let obj = JSON.parse(ans + splited[1]);
              obj.id = moment(obj.id, "DD.MM.YYYY").toDate()
              arr.push(obj);
            })

            arr.sort((a, b) => a.id - b.id);


            arr.forEach(x => {
              moment.locale('ru');
              x.id = moment(x.id).format("MMM YYYY");
            })
            arr = unique(arr);
            setBarChartData({ data: arr.slice(0), keys: response?.data.keys });
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetGain')
          .then(function (response) {
            results.current = response?.data?.graph;
            setShowValue(results.current);
            let temp = [];
            response?.data?.keys.forEach(i => {
              temp.push({ productName: i });
            });
            setPoints(temp);
            valueUpdater(["Всего"], true)
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetTopSellingPoints')
          .then(function (response) {
            let res = [];
            let arrFromResp = response?.data;
            arrFromResp.forEach(item => {
              res.push({
                id: count.current += 1,
                addres: item?.pointOfSale?.addres,
                sumSold: item?.sumSold,
                city: item?.pointOfSale?.city,
                pointOfSale: item?.pointOfSale,
              });
            });

            setTableData(res);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });
      }
    }, []);

    const setup = (arr, def) => {
      if (arr.length < 1) return [];
      if (arr[0].productName != def)
        arr.unshift({ productName: "Всего" });
      return arr;
    }

    const columnsEmployees = [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "surname", headerName: "Фамилия", flex: 0.8 },
      { field: "name", headerName: "Имя", flex: 0.8 },
      { field: "patronymic", headerName: "Отчество", flex: 0.8 },
      {
        headerName: "Статус", flex: 0.5,
        renderCell: () => {
          return (
            <Typography color={colors.grey[100]}>
              Работает
            </Typography>
          );
        }
      }
    ];

    const [dialog, setDialog] = useState(false);
    const [dialogObj, setDialogObj] = useState({items: [], sum: null})
    const columnsProduction = [
      { field: "id", headerName: "ID", flex: 0.8 },
      {
        field: "addres",
        headerName: "Точка",
        flex: 1,
        renderCell: ({ row: { addres, pointOfSale } }) => {

          const handleCartClick = (array, sum) => {
            setDialog(true);
            setDialogObj({items: array, sum: sum});
          }

          const columnsPointHistory = [
            { field: "id", headerName: "Номер чека", flex: 0.8, type: "string" },
            {
              field: "isCancel",
              headerName: "Операция",
              flex: 0.4,
              type: "boolean",
              headerAlign: "left",
              align: "left",
              renderCell: ({row: {isCancel}}) => {
                return (
                <Typography color={isCancel ? "error" : colors.blueAccent[500]}>
                  {isCancel ? "Отмена" : "Продажа"}
                </Typography>);
              }
            },
            {
              field: "dateOfSell",
              headerName: "Дата операции",
              flex: 0.6,
              type: "dateTime",
              headerAlign: "left",
              align: "left",
            },
            {
              field: "soldItems",
              headerName: "Товары",
              flex: 0.1,
              headerAlign: "left",
              align: "left",
              type: "number",
              valueGetter: ({row: {soldItems}}) => soldItems.length,
              renderCell: ({row: {soldItems, sumSold}}) => {
                return (
                  <Box sx={{
                    width: "100%",
                    '&:hover': {
                      opacity: [0.9, 0.8, 0.7],
                      cursor: "pointer"
                    },
                  }}>
                    {
                     dialogObj.items.length > 0 && <SimpleDialog onClose={() => setDialog(false)} open={dialog} title="Корзина" items={dialogObj.items} sum={dialogObj.sum}/>
                    }
                    <IconButton color="secondary" aria-label="Корзина" onClick={() => handleCartClick(soldItems, sumSold)}>
                      <ShoppingCartOutlinedIcon />
                    </IconButton>
                  </Box>
                );
              }
            },
            {
              field: "employee",
              headerName: "Продавец",
              flex: 0.6,
              headerAlign: "left",
              align: "left",
              type: "string",
              valueGetter: ({row: {employee}}) => `${employee?.name || ''} ${employee?.surname || ''} ${employee?.patronymic || ''}`,
              onCellClick: (params) => console.log(params)
            }
          ];

          return (
            <Box sx={{
              width: "100%",
              '&:hover': {
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer"
              },
            }}>
              <YMaps>
                <Typography color={colors.grey[100]} onClick={() => handlePointOpen(pointOfSale)}>
                  {addres}
                </Typography>
                <FullScreenDialog size="0 5%" openClick={click} closeFunc={() => { setAddresState(null); setClick(false); }} title="Страница точки">
                  <Box m="20px">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Header title={pointObj?.pointOfSale?.addres} subtitle={pointObj?.pointOfSale?.city} />
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gridAutoRows="120px"
                      gap="20px"
                    >
                      {/* Карта. */}
                      <Box
                        gridColumn="span 6"
                        gridRow="span 5"
                        backgroundColor={colors.primary[400]}
                      >
                        {
                          addresState && <Map
                            width="100%"
                            height="100%"
                            defaultState={{
                              center: addresState || [55.684758, 37.738521],
                              zoom: 17,
                            }}
                          >
                            {addresState && <Placemark geometry={addresState} />}
                          </Map>
                        }

                      </Box>
                      {/* Сотрудники и доки. */}
                      <Box
                        gridColumn="span 6"
                        gridRow="span 5"
                      >
                        <Box
                          display="grid"
                          gridTemplateColumns="repeat(14, 1fr)"
                          gridAutoRows="180px"
                          gap="20px"
                        >
                          {/* Сотрудники. */}
                          <Box

                            gridColumn="span 14"
                            gridRow="span 2"
                            backgroundColor={colors.primary[400]}
                          >
                            <Box
                              height="350px"
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
                              <Typography variant="h5"
                                marginTop={1}
                                align="center"
                                fontWeight="600"
                                color={colors.grey[100]}>
                                Сотрудники
                              </Typography>
                              <DataGrid
                                disableSelectionOnClick
                                getRowId={(row) => row.id}
                                rows={pointObj?.employees || []}
                                columns={columnsEmployees}
                                components={{ Toolbar: GridToolbar }}
                                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                            </Box>
                          </Box>
                          {/* Доки. */}
                          <Box
                            height="73%"
                            gridColumn="span 14"
                            gridRow="span 2"
                            backgroundColor={colors.primary[400]}
                          >
                            <DocumentList userDocs={pointObj?.documnts} height={250} width={500} itemSize={30} />
                          </Box>
                        </Box>
                      </Box>
                      {/*Таблица внизу.*/}
                      <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                      >
                        <Box
                          height="400px"
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
                          <Typography variant="h5"
                            marginTop={1}
                            align="center"
                            fontWeight="600"
                            color={colors.grey[100]}>
                            История операций
                          </Typography>
                          <DataGrid
                            disableSelectionOnClick
                            getRowId={(row) => row.id}
                            rows={pointHistory}
                            columns={columnsPointHistory}
                            components={{ Toolbar: GridToolbar }}
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </FullScreenDialog>
              </YMaps>
            </Box>
          );
        }
      },
      {
        field: "sumSold",
        headerName: "Выручка",
        flex: 0.5,
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
        flex: 1,
        cellClassName: "name-column--cell",
      }
    ];

    return (
      <>
        {props.title === value ?
          <>
            {/* ROW 2, ITEM 1 */}
            {/* Карточка с графиком линия. */}
            <Box
              gridColumn="span 8"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="45px"
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
                    Выручка
                  </Typography>
                </Box>
                <ComboBoxCheckBoxes changed={valueUpdater} title="Фильтр" inner="Тип" defaultVal={{ productName: "Всего" }} data={setup(points, "Всего")} width="43%" />
              </Box>
              <Box height="300px" m="-5px 0 0 0">
                <LineChart data={lineChartData} bottom="Период" left="Рубли" minVal={0} />
              </Box>
            </Box>
            {/* ROW 2, ITEM 2 */}
            {/* Карточка со столбчатым графиком. */}
            <Box
              gridColumn="span 6"
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
                    Кол-во чеков
                  </Typography>
                </Box>
                <Box>
                  <IconButton>
                    <DownloadOutlinedIcon
                      sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box height="350px">
                <BarChart keys={barChartData.keys} data={barChartData.data} bottom="Период" left="Штуки" />
              </Box>
            </Box>
            {/* ROW 3, ITEM 1 */}
            {/* Карточка топа точек по прибыли. */}
            <Box
              gridColumn="span 14"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                height="400px"
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
                <Typography variant="h5"
                  marginTop={1}
                  align="center"
                  fontWeight="600"
                  color={colors.grey[100]}>
                  Топ точек по прибыли
                </Typography>
                <DataGrid
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                  rows={tableData}
                  columns={columnsProduction}
                  components={{ Toolbar: GridToolbar }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
              </Box>
            </Box>
          </>
          : null}
      </>
    );
  };

  const firstPage = (
    <DashboardProvider>
      <ProductsChild title="Товары" />
      <PointsChild title="Точки" />
    </DashboardProvider>);

  const otherPage = (
    <h1>otherPage</h1>
  );

  const rolesForRights = ["Суперадмин"];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Cтатистика" subtitle="Отслеживайте статистику" />
        <Box>
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
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Выгрузить
          </Button>
        </Box>
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
};

export default Dashboard;
