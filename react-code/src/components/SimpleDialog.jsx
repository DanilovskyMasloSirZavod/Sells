import { Dialog, DialogTitle, List, 
    ListItem, useTheme, ListItemText, ListItemAvatar, Avatar, Divider, Box } from "@mui/material";

//icons
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
//!icons

//theme and colors import
import { tokens } from "../theme";
//!theme and colors import

//onClose, open, title, items, sum
const SimpleDialog = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleClose = () => {
        props?.onClose();
    }

    return (<Dialog onClose={handleClose} open={props?.open} PaperProps={{ style: { boxShadow: '4px 4px 8px 0px rgba(34, 60, 80, 0.09)' } }} BackdropProps={{ style: { backgroundColor: "rgb(0,0,0,0.03" } }}>
        <DialogTitle>{props?.title}</DialogTitle>
        <List sx={{ pt: 0, width: 500 }}>
            {
                props?.items.map(item => (
                    <ListItem
                        secondaryAction={
                            <ListItemText edge="end" primary={"Цена: " + (item?.price * item?.weight) + " руб"} />       
                        }
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: colors.grey[800] }}>
                                <SellOutlinedIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item?.product?.productName} secondary={"Вес: " + item?.weight + " кг"}/>                         
                    </ListItem>
                ))
            }
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: colors.greenAccent[800], color: colors.greenAccent[500] }}>
                        <AttachMoneyOutlinedIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={"Сумма чека: " + props?.sum + " руб"}/>
            </ListItem>
        </List>
    </Dialog>);
}

export default SimpleDialog;