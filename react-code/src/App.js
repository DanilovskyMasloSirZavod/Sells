import { useRef, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

//import custom modules
import LogIn from "./scenes/login";
import Dashboard from "./scenes/dashboard";
import Messenger from "./scenes/messenger";
import Points from "./scenes/points";
import Recommendations from "./scenes/recommend";

import Contacts from "./scenes/contacts";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Notifications from "./scenes/notifications";
import Profile from "./scenes/profile/Profile";
//!import custom modules

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import { Navigate } from 'react-router-dom';

import React from "react";


import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

function App() {
  const sidebarItemsProiz = [
    {
      type: "Item",
      roles: ["Суперадмин"],
      title: "Статистика",
      to: "/dashboard",
      icon: <HomeOutlinedIcon />
    },
    {
      roles: [],
      type: "Item",
      title: "Мессенджер",
      to: "/messenger",
      icon: <SmsOutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Item",
      title: "Точки",
      to: "/points",
      icon: <PointOfSaleOutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Item",
      title: "Цены",
      to: "/recommend",
      icon: <MonetizationOnOutlinedIcon />
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Typography",
      title: "Инфо",
      marginLeft: 20
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Доступ",
      to: "/team",
      icon: <PeopleOutlinedIcon />,
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Сотрудники",
      to: "/contacts",
      icon: <ContactsOutlinedIcon />
    },
    {
      roles: [],
      type: "Typography",
      title: "Доп",
      marginLeft: 25
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Пользователь",
      to: "/form",
      icon: <PersonOutlinedIcon />
    },
  ];

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const [getSideBarVisibility, setSideBarVisibility] = React.useState(false);
  const [getTopBarVisibility, setTopBarVisibility] = React.useState(false);
  const [userLoggedIn, setLoggedIn] = React.useState({ access: null, state: false });

  let loginPage = <LogIn
    setTopVis={setTopBarVisibility}
    setSideVis={setSideBarVisibility}
    setLogged={setLoggedIn} />

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {getSideBarVisibility && <Sidebar
            isSidebar={isSidebar}
            userInfo={userLoggedIn.access}
            items={sidebarItemsProiz.filter(x => !x?.roles.length || x?.roles.includes(userLoggedIn.access.userRole))} />}
          <main className="content">
            {getTopBarVisibility && <Topbar setIsSidebar={isSidebar} />}
            <Routes>
              <Route path="/" element={userLoggedIn.state ? <Navigate to={sidebarItemsProiz.filter(x => !x?.roles.length
                || x?.roles.includes(userLoggedIn.access.userRole))[0]?.to} /> : loginPage} />
              <Route path="/dashboard" element={userLoggedIn.state ? <Dashboard rolesArr={sidebarItemsProiz.find(x => x.to === "/dashboard").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/messenger" element={userLoggedIn.state ? <Messenger rolesArr={sidebarItemsProiz.find(x => x.to === "/messenger").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/points" element={userLoggedIn.state ? <Points rolesArr={sidebarItemsProiz.find(x => x.to === "/points").roles} currentRole={userLoggedIn.access} /> : loginPage} />            
              <Route path="/recommend" element={userLoggedIn.state ? <Recommendations rolesArr={sidebarItemsProiz.find(x => x.to === "/recommend").roles} currentRole={userLoggedIn.access} /> : loginPage} />            
              
              <Route path="/contacts" element={userLoggedIn.state ? <Contacts rolesArr={sidebarItemsProiz.find(x => x.to === "/messenger").roles} currentRole={userLoggedIn.access} /> : loginPage} />            
              <Route path="/team" element={userLoggedIn.state ? <Team rolesArr={sidebarItemsProiz.find(x => x.to === "/team").roles} currentRole={userLoggedIn.access} /> : loginPage} />            
              <Route path="/form" element={userLoggedIn.state ? <Form rolesArr={sidebarItemsProiz.find(x => x.to === "/form").roles} currentRole={userLoggedIn.access} /> : loginPage} />      
              {/* Other routes */}
              <Route path="/notifications" element={userLoggedIn.state ? <Notifications currentRole={userLoggedIn?.access} /> : loginPage} />
              <Route path="/profile" element={userLoggedIn.state ? <Profile currentRole={userLoggedIn?.access} /> : loginPage} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
