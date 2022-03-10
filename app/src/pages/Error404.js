import React from "react";
import { Typography, Box } from "@mui/material";

export function Error404() {
    return(
        <Box sx={{textAlign: "center"}}>
            <Typography sx={{fontSize: "h1.fontSize", mb: '30px'}}>Error 404: Page not found</Typography>
            <Typography sx={{fontSize: "h2.fontSize"}}>{window.location.href} is not a valid url</Typography>
        </Box>
    );
}