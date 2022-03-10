import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import {React, useEffect, useState} from "react";
import { Box } from "@mui/system";
import { styled } from "@mui/system";
import { DatasetListItem } from "../components/DatasetListItem";
import {FileInput} from '../components/FileInput.js'
import { getAllData, getMetaData } from "../APIClient";

const MyPaper = styled(Paper)({
    background: '#024F87',
    border: 0,
    borderRadius: 3,
    color: 'white',
    width: 400,
    height: 600,
    boxShadow: 3,
    maxHeight: 550,
  });

export function CurateList(props) {

    // Array that stores the list of datasets of Open Tickets
    const [openDatasets, setMuiDatasets] = useState([]);

    // Array that stores the list of datasets you have active
    const [activeDatasets, setActiveDatasets] = useState([]);

    function fileUploaded(filename) {
        getMetaData(filename.toString()).then(response => {
            setMuiDatasets(openDatasets.concat(response.data.item))
        })
    }

    useEffect(() => {
        const openD = []
        const closedD = []
        getAllData().then((response) => {
            response.data.list.forEach(dataset => {
                if (dataset.tags === null) {
                    openD.push(dataset)
                } else {
                    closedD.push(dataset)
                }
            })
            setMuiDatasets(openD)
            setActiveDatasets(closedD)
        })
    }, [])

    return (
        <>

        {/* Upload dataset button */}
        <Box sx={{display: 'flex', textAlign: 'center', justifyContent: 'center', mt: '25px'}}>
            <FileInput rerenderLists={fileUploaded}/>
        </Box>


        {/* Contains all of the list containters */}
        <Grid container 
        direction="row" 
        justifyContent="space-evenly" 
        alignItems="center"
        sx={{height: '80vh'}}
        wrap="nowrap"
        >
            {/* Open Jobs paper*/}
            <Grid item zeroMinWidth>
                <MyPaper elevation={3}>
                    <Box sx={{display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                        <Typography 
                        className=".headers"
                        sx={{
                        fontSize: "h3.fontSize",
                        fontFamily: "Franklin Gothic Medium",
                        fontWeight: "bold",
                        color: "white",
                        overflowWrap: 'break-word',
                        bgcolor: '#013459'
                        }}>
                            Open Datasets
                        </Typography>

                        {/* Divider line */}
                        <Divider sx={{bgcolor: 'white', height: "2px"}}></Divider>

                        {/* List of datasets in the open ticket list */}
                        <Box sx={{overflow: 'auto', maxHeight: '475px'}}>
                            {openDatasets.map(dataset => <div><DatasetListItem key={dataset.id} currentList='open' id={dataset.id} dataset={dataset} /></div>)}
                        </Box>
                    </Box>
                </MyPaper>
            </Grid>

            {/* Active jobs section */}
            <Grid item zeroMinWidth>
                <MyPaper elevation={3}>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography 
                        className=".headers"
                        sx={{
                        fontSize: "h3.fontSize",
                        fontFamily: "Franklin Gothic Medium",
                        fontWeight: "bold",
                        color: "white",
                        overflowWrap: 'break-word',
                        bgcolor: '#013459'
                        }}>
                            Tagged Datasets
                        </Typography>
                        <Divider sx={{bgcolor: 'white', height: "2px"}}></Divider>
                        
                        {/* Render the active data list */}
                        <Box sx={{overflow: 'auto', maxHeight: '500px'}}>
                            {activeDatasets.map(dataset => <div><DatasetListItem key={dataset.id} currentList='closed' id={dataset.id} dataset={dataset} /></div>)}
                        </Box>
                    </Box>
                </MyPaper>
            </Grid>
        </Grid>
        </>
    );
}