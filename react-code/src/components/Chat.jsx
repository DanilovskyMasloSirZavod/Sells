import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';

import { Paper, Box, Divider, Typography, List, ListItem, ListItemIcon, ListItemText, Fab, useTheme } from '@mui/material';

//theme and colors import
import { tokens } from "../theme";
//!theme and colors import

const Chat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
      <div>
        <Grid container component={Paper} sx={{ width: '100%', height: '85vh'}}>
            <Grid item xs={3} sx={{borderRight: '1px solid #e0e0e0'}}>
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Поиск" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                    <ListItem button key="КучероваМаринаСергеевна">
                        <ListItemIcon>
                            <Avatar alt="Кучерова Марина Сергеевна" src="https://mui.com/static/images/avatar/4.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Кучерова Марина Сергеевна">Кучерова Марина Сергеевна</ListItemText>
                        <ListItemText secondary="В сети" align="right"></ListItemText>
                    </ListItem>
                    <ListItem button key="ЦемрюкДанилаМихайлович">
                        <ListItemIcon>
                            <Avatar alt="Цемрюк Данила Михайлович" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Цемрюк Данила Михайлович">Цемрюк Данила Михайлович</ListItemText>
                    </ListItem>
                    <ListItem button key="ГришанинСлаваНиколаевич">
                        <ListItemIcon>
                            <Avatar alt="Гришанин Слава Николаевич" src="https://mui.com/static/images/avatar/6.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Гришанин Слава Николаевич">Гришанин Слава Николаевич</ListItemText>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={9}>
                <List sx={{ height: '77vh', overflowY: 'auto'}}>
                    <ListItem key="1">
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText align="right" primary="Привет как дела?"></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText align="right" secondary="09:30"></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem key="2">
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText align="left" primary="Нормально, а у тебя?"></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText align="left" secondary="09:31"></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem key="3">
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText align="right" primary="Да тоже самое"></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText align="right" secondary="10:30"></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email" label="Напишите текст" fullWidth />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="secondary" aria-label="add"><SendIcon htmlColor='#fff' /></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;