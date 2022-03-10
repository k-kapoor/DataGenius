import { Button, Typography, Box, Input } from "@mui/material";
import React, { useContext } from "react"
import {upload} from "../APIClient.js";
import {DataGeniusContext} from "../DataGeniusContext"

export function FileInput(props) {
    const {user} = useContext(DataGeniusContext)

    // File that was selected
    const [selectedFile, setSelectedFile] = React.useState(null)

    // Name of the file
    const [fileSelected, setFileSelected] = React.useState(false)
    

    function handleSubmit() {
        upload(selectedFile, user.username).then(response => {
          props.rerenderLists(selectedFile.name)
        })
        setSelectedFile(null)
        setFileSelected(false)
    }

    return (

        <div>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography className=".headers" sx={{fontSize: '24px'}} maxWidth align="center">
                        Upload a Dataset (CSV format)
                </Typography>

                {/* Form for uploading a file */}

                <form>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <label htmlFor="choose-file-button">
                        <Input 
                        accept="csv" 
                        id="choose-file-button" 
                        multiple 
                        type="file"
                        onChange={
                            (e) => {
                                setSelectedFile(e.target.files[0])
                                setFileSelected(true)
                            }
                        }
                        sx={{display: 'none'}}
                        />
                        <Button variant='contained' component="span">
                            Choose File
                        </Button>
                    </label>

                    {/* Upload button */}
                    <Button type="button" onClick={handleSubmit} variant='contained' disabled={!fileSelected}>
                        Upload
                    </Button>
                </Box>
                </form>

                {/* File that is currently selected */}
                { fileSelected &&
                    <Typography className=".headers" sx={{fontSize: '18px'}} maxWidth align="center">
                        {selectedFile.name}
                    </Typography>
                }
            </Box>
        </div>
    );
}