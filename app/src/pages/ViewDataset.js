import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography } from "@mui/material";
import { getData, getMetaData } from "../APIClient";
import { useHistory } from "react-router";

export function ViewDataset(props) {
  const history = useHistory();

  // Columns for the data table
  const [columns, setColumns] = useState([]);

  // Rows for the data table
  const [rows, setRows] = useState([]);

  const [dataset, setDataset] = useState({tags: null});

  // Handle the tags
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

  // Get all the data
  useEffect(() => {
    let ref = window.location.pathname;
    ref = ref.substring(6);
    getData(ref).then(response => {
      const tempCol = [];
      const tempRow = [];
      response.data.columns.forEach(columnName => {
        tempCol.push({field: columnName, headerName: columnName, width: 150, editable: false});
      })
      
      let rowIdx = 0
      response.data.data.forEach(row => {
        let tempObj = new Object();
        let index = 0;
        row.forEach(value => {
          tempObj[tempCol[index].field] = value;
          index = index + 1;
        })
        tempObj.id = rowIdx;
        tempRow.push(tempObj);
        rowIdx += 1;
      })
      console.log(tempCol);
      console.log(tempRow);
      setColumns(tempCol);
      setRows(tempRow);
    })

    getMetaData(ref).then(response => {
      setDataset(response.data.item[0])
    })
  }, [])

  return (
    <div>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '50px'}}>
        { dataset.tags !== null &&
        <Typography sx={{fontSize: "h3.fontSize"}}>
          Tags: <b>{handleTags()}</b>
        </Typography>
        }
        { dataset.tags === null &&
          <Typography sx={{fontSize: "h3.fontSize"}}>
            Dataset not curated yet
          </Typography>
        }
        <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center', mt: '50px', mb: '50px', width: '800px', height: '600px'}}>
          <DataGrid
            columnBuffer={columns.length + 1}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick={true}
          />
        </Box>
        <Button variant="contained" sx={{bgcolor: "#dd5757", mb: '10px', "&:hover": {bgcolor: "#8c3737"}}} onClick={() => {history.goBack()}}>Back to previous page</Button>
      </Box>
    </div>
  )
}