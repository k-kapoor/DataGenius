import { Paper, TextField, Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react"
import { updateTags } from "../APIClient";
import { Link, useHistory } from "react-router-dom";
import { updateUser, getUser } from "../APIClient";
import { DataGeniusContext } from "../DataGeniusContext";
import { getData } from "../APIClient";
import { DataGrid } from '@mui/x-data-grid';

export function Curate(props) {
  const {user} = React.useContext(DataGeniusContext);

  const history = useHistory();

  const [tagText, setTagText] = useState("");

  const [currentTags, setCurrentTags] = useState([]);

  const [disabledButton, setDisabledButton] = useState(false);

  const [columns, setColumns] = useState([]);

  const [rows, setRows] = useState([]);

  const toCurate = () => {
    history.push('/curate')
  }

  useEffect(() => {
    let temp = tagText;
    if (tagText === '' || !tagText || !temp.replace(/\s/g, '').length || currentTags.length >= 5) {
      setDisabledButton(true);
    } else {
      setDisabledButton(false)
    }
  }, [tagText])

  useEffect(() => {
    let ref = window.location.pathname;
    ref = ref.substring(12);
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
  }, [])

  return (
    <div>
    <Grid container direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{mt: '50px'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', mr:'50px'}}>
        <TextField label='Add a Tag' value={tagText} onChange={e => setTagText(e.target.value)} />

        <Button sx={{color: '#33a3ff', borderColor: '#33a3ff', mt: '5px'}} variant="outlined" disabled={disabledButton} onClick={() => {
          setCurrentTags(currentTags.concat(tagText));
          setTagText('')
        }}>
          Add Tag
        </Button>
      </Box>
      
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center"}}>
        <Typography sx={{fontSize: "h4.fontSize", mb: '10px'}}><b>{currentTags.length}/5 Tags</b></Typography>
        <Paper sx={{border: 1, borderColor: 'black', borderWidth: '3px', height: '150px', width: '100%', justifyContent: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', mt: '10px'}}>
              {currentTags.map(string => <div><b>{string}</b><br /></div>)}
          </Box>
        </Paper>
        <Button
        sx={{color: '#15b57b', borderColor: '#15b57b', mb: '5px', mt: '5px'}} 
        variant="outlined"
        fullWidth
        onClick={() => {
          let ref = window.location.pathname
          ref = ref.substring(12)
          ref = ref.replace("%20", " ");
          let tagString = ""
          currentTags.forEach(tag => tagString += tag + ",")
          updateTags(ref, tagString)
          getUser(user.username).then(response => {
            updateUser(user.username, {type: 'Coins', content: response.data.curCoins + 1}).then(toCurate)
          })
        }}>
          Submit
        </Button>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Button variant="outlined" sx={{color: '#dd5757', borderColor: '#dd5757'}} onClick={() => {
            setCurrentTags([]);
          }}> Clear </Button>
          <Button
          variant="outlined"
          sx={{color: '#dd5757', borderColor: '#dd5757', ml: '5px'}} 
          component={Link} 
          to={"/curate"}>
            Back
          </Button>
        </Box>
      </Box>
    </Grid>

    <Box sx={{display: 'block', justifyContent: 'center', alignContent: 'center', mt: '50px', width: '800px', height: '600px', ml: 'auto', mr: 'auto', mb: '50px'}}>
      <DataGrid
        columnBuffer={columns.length + 1}
        rows={rows}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[25]}
        disableSelectionOnClick={true}
      />
    </Box>
    </div>
  );
}