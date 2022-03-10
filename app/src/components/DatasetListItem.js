import { Paper, Typography, Box, Button } from "@mui/material"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { styled } from "@mui/system";
import { DataGeniusContext } from "../DataGeniusContext";

const myButton = styled(Button)({
    bgcolor: '#00c21a', 
    color: 'white', 
    border: 1, 
    borderColor: 'black', 
    mb: '2px',
    maxWidth: '20px',
    maxHeight: '25px',
    fontSize: '8px',
    "&:hover": {
        bgcolor: "#17785F"
    }
});


export function DatasetListItem({dataset, ...props}) {

    const {user} = React.useContext(DataGeniusContext)

    function handleTags() {
        let tagArr = dataset.tags.split(',');
        let finalTags = "";
        for (let i = 0; i < tagArr.length - 1; i++) {
            if (i === tagArr.length - 2) {
                finalTags += tagArr[i]
            } else {
                finalTags += tagArr[i] + ", ";
            }
        }
        return finalTags;
    }

    return (
        <Paper sx={{
            mr: '20px', 
            ml: '20px', 
            height: "90px", 
            bgcolor: 'white', 
            mt: '10px', 
            border: 1,
            borderColor: 'black',
            borderWidth: '2px'
            }}>
            <Box sx={{display: 'flex', flexDirection: 'column', mr: '2px', ml: '2px'}}>
                <Typography align='left' sx={{fontSize: '12px'}}>
                    Title: <b><Link to={"/view/".concat(dataset.name)} style={{textDecoration: "none", color: '#0378cd'}}>{dataset.name}</Link></b>
                </Typography>
                <Typography align='left' sx={{fontSize: '12px'}}>
                    Date Uploaded: <b>{dataset.dateUploaded}</b>
                </Typography>
                { dataset.dateCurated !== null &&
                    <Typography align='left' sx={{fontSize: '12px'}}>
                        Date Curated: <b>{dataset.dateCurated}</b>
                    </Typography>
                }
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{fontSize: '12px'}}>
                        Uploaded by: <b>{dataset.uploader}</b>
                    </Typography>
                    {   dataset.curatedBy !== null &&
                        <Typography sx={{fontSize: '12px'}}>
                            Curated by: <b>{dataset.curatedBy}</b>
                        </Typography>
                    }
                    <Typography sx={{fontSize: '12px'}}>
                        Ticket #{dataset.id}
                    </Typography>
                </Box>

                {/* Curate button for if it is in the open tickets list */}
                { props.currentList === 'open' &&
                [
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <Button 
                    key="1"
                    sx={{
                        bgcolor: '#00c21a', 
                        color: 'white', 
                        border: 1, 
                        borderColor: 'black', 
                        mb: '2px',
                        mr: '2px',
                        maxWidth: '20px',
                        maxHeight: '25px',
                        fontSize: '8px',
                        "&:hover": {
                            bgcolor: "#17785F"
                        }
                        }}
                        component={Link}
                        to={'/curateItem/'.concat(dataset.name)}
                        type="button"
                    >
                        Curate
                    </Button>
                </Box>
                ]
                }
                {dataset.tags !== null &&
                <Typography align='left' sx={{fontSize: '12px'}}>
                    Tags: <b>{handleTags()}</b>
                </Typography>
                }
            </Box>
        </Paper>
    )
}