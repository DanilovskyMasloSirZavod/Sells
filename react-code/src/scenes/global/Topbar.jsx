import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useRef, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";

import Badge from '@mui/material/Badge';

const Topbar = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [notifications, setNotifications] = useState(0);

  const notificationsUpdate = (val) => {
    count.current = val;
    setNotifications(val);
  }

  const count = useRef(2);
  /*useEffect(() => {
    const interval = setInterval(() =>{
      count.current = count.current + 1;
      notificationsUpdate(count.current)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);*/



  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => {notificationsUpdate(0); navigate("/notifications", {state: 
          {
            notificationsArr: [
              {
                date: "07.11.2022", 
                where: "Получение товара", 
                message: "Общий вес отправленой продукции 1.2т. Продавец указал, полученный вес 1.19т. Недобор составляет 0.01т. Данные предоставил Кучерова Марина Сергеевна.", 
                who: {fullName: "Кучерова Марина Сергеевна"}
              },
              {
                date: "16.05.2022", 
                where: "Продажа", 
                message: "На торговой точке несоответствие по проданной продукции. Пошехонский сыр текущий вес 3.5кг, но должен составлять 3.6кг, при проданном 0.05кг. Данные предоставил Содаткина Кристина Русланова.", 
                who: {fullName: "Содаткина Кристина Русланова"}
              },
              {
                date: "29.05.2021", 
                where: "Рекомендация цены", 
                message: 'Система создала новую рекомендацию по "Творог 5%". Текущая цена которого составляет: 670.56 за 1кг. Рекомендованная цена: 500 за 1кг.', 
                who: {fullName: "46fd16ea-1bec-4c76-9e0c-29583a6b703f"}
              },
            ], 
            pageHeight: document.body.scrollHeight * 0.7
            }});
          }}>
          <Badge badgeContent={count.current} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/profile", {state: {pageHeight: document.body.scrollHeight * 0.7}})}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
