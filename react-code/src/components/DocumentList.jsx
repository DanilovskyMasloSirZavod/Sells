import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';

import { FixedSizeList } from "react-window";

//mui import
import { Box, Typography, useTheme, ListItem } from "@mui/material";
//!mui import

import React from "react";
import { useState, useEffect, useRef } from "react";

//theme and colors import
import { tokens } from "../theme";
//!theme and colors import

import { typesTyples } from "../components/Utils"

const DocumentList = ({userDocs, height, width, itemSize}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const renderRow = (props) => {
        let { index, style } = props;
        let found = typesTyples.find(x =>
            x.fileExtension === userDocs[index]?.fileName?.split('.').at(-1));
        return (
            <ListItem button style={style} key={index} component="a" href={`data:${found?.mimeType
                || "application/octet-stream"};base64,${userDocs[index]?.file}`}
                target="_blank" download={userDocs[index]?.fileName}>
                <ListItemIcon>
                    {found ? found?.image : <AttachmentOutlinedIcon/>}
                </ListItemIcon>
                <ListItemText primary={userDocs[index]?.fileName} />
            </ListItem>);
    }

    return (
        <>
            {userDocs?.length < 1 || userDocs?.length == undefined 
                ? <Typography variant="h5" marginTop={2}
                    align="center"
                    fontWeight="600"
                    color="error">
                        Документы не прикреплены.
                    </Typography> :
                        <>
                        <Typography variant="h5"
                                marginTop={2}
                                align="center"
                                fontWeight="600"
                                color={colors.grey[100]}>Документы</Typography>
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemSize={itemSize}
                                itemCount={userDocs?.length}
                                overscanCount={5}
                            >
                                {renderRow}
                            </FixedSizeList>
                        </>
                    }
        </>
    );
}

export default DocumentList;