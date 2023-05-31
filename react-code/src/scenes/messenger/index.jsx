import { Box, useTheme } from "@mui/material";

import Header from "../../components/Header";

//theme and colors import
import { tokens } from "../../theme";
import Chat from "../../components/Chat";
//!theme and colors import

const Messenger = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box mt="20px">
            <Box ml="20px" display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Мессенджер" subtitle="Общайтесь с вашими коллегами" />
            </Box>
            <Chat/>
            {/*
            <Box
                display="grid"
                gridTemplateColumns="repeat(14, 1fr)"
                gridAutoRows="140px"
            >
                <Box
                    gridColumn="span 4"
                    gridRow="span 9"
                    backgroundColor={colors.grey[800]}
                >
                    
                </Box>
                <Box
                    gridColumn="span 10"
                    gridRow="span 9"
                    backgroundColor={colors.primary[900]}
                >
                    chat
                </Box>
            </Box>
            */}
        </Box>)
}

export default Messenger;