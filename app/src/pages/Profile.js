import React, { useState, useEffect } from "react";
import { Divider, Grid, Switch, TextField, Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { Paper } from "@mui/material";
import { Avatar } from '@mui/material';
import { getUser, updateUser, getAllData} from "../APIClient.js";
import { useParams} from "react-router-dom";
import { DataGeniusContext } from "../DataGeniusContext.js";
import { DatasetListItem } from "../components/DatasetListItem.js";


export function Profile(props) {
  const defaultValues = {
    username: "",
    avatar: "https://www.gannett-cdn.com/-mm-/d1b97fd826b892dff623d334a69c304c29c85161/c=0-184-2998-1878/local/-/media/2017/07/11/USATODAY/USATODAY/636353698425897411-96844SG009-GINN-SUR-MER-22890975.JPG?width=3200&height=1680&fit=crop",
    bio: "Hello, I love you",
    curCoins: "0"
  };
  
  // The currently logged in user
  const {user, setUser} = React.useContext(DataGeniusContext);

  // The url of the new avatar to be uploaded
  const [avatarText, setAvatarText] = useState("");

  // Determines if the bio can be edited or not based on the switch
  const [editBio, setEditBio] = useState(false);

  // The information of the current users profile page
  const [formValues, setFormValues] = useState(defaultValues);

  // The new bio to be uploaded
  const [bioText, setBioText] = useState(formValues.bio);

  // The datasets that the user has uploaded
  const [uploadedDatasets, setUploadedDatasets] = useState([]);

  // Datasets the user has uploaded
  const [curatedDatasets, setCuratedDatasets] = useState([])

  // The current users avatar
  const [currentAvatar, setCurrentAvatar] = useState(formValues.avatar)
  let {username} = useParams();

  // Updates the users avatar
  function updateAvatar() {
    updateUser(user.username, {type: 'Avatar', content: avatarText})
    getUser(username).then(response => {
      setUser({exists: true, username: user.username, avatar: response.data.avatar})
      setFormValues({username: response.data.name, bio: response.data.bio, avatar: response.data.avatar, curCoins: response.data.curCoins});
      setCurrentAvatar(response.data.avatar);
      setAvatarText("")
    })
  }

  //Updates the users bio
  function updateBio() {
    updateUser(user.username, {type: 'Bio', content: bioText});
    setEditBio(false);
  }

  // Gets the data for this user's profile
  useEffect(() => {
    const uploadedD = [];
    const curatedD = [];
    getUser(username).then(response => {
      //console.log(response);
      setFormValues({username: response.data.name, bio: response.data.bio, avatar: response.data.avatar, curCoins: response.data.curCoins});
      setBioText(response.data.bio);
      setCurrentAvatar(response.data.avatar);
      getAllData().then(res => {
        res.data.list.forEach(dataset => {
          if (username === dataset.uploader) {
            uploadedD.push(dataset);
          } 
          if (username === dataset.curatedBy) { 
            curatedD.push(dataset)
          }
        })
        setCuratedDatasets(curatedD);
        setUploadedDatasets(uploadedD);
      })
    }).catch();
  }, []);
  
  return (

    <div>
      <Grid container direction='row' spacing={24} justifyContent="center" alignItems="flex-start">
        {/* Contains the users avatar and bio */}
        <Grid item xs={3}>
          <Paper
            elevation={3}
            sx={{
              mt: '50px',
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "50px",
              borderBottomLeftRadius: 100,
              borderBottomRightRadius: 100,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              bgcolor: "#013459",
              border: 1,
              borderColor: 'black',
              borderWidth: '2px',
              height: '680px',
              width: '350px',
              mb: '50px'
            }}
          >
            {/* Username on left banner */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  className=".headers"
                  sx={{
                    fontSize: "h3.fontSize",
                    fontFamily: "Franklin Gothic Medium",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {formValues.username}
                </Typography>

                {/* Users avatar */}
                <Avatar alt="hi" sx={{width: '100%', height: 250}} src= {currentAvatar} variant="rounded"/>

                {/* Upload Avatar section */}
                { window.location.pathname.substring(9).split("%20").join(" ") === user.username &&
                [
                  <TextField
                  key="updateAvatarField"
                    variant="outlined"
                    size="small" 
                    placeholder="Update avatar"
                    value={avatarText}
                    onChange={(e) => setAvatarText(e.target.value)}
                    sx={{
                      background: 'white',
                      borderRadius: 1,
                      mt: "5px",
                      mb: "5px"
                    }}
                    fullWidth
                  >
                  </TextField>,

                  <Button
                    key="updateAvatarButton"
                    sx={{mb: '5px'}}
                    fullWidth variant="contained" 
                    type="button" 
                    onClick={updateAvatar}
                    disabled={avatarText.length === 0}
                    >
                    Update Avatar
                  </Button>

                ]
                }
                <Divider variant='middle' sx={{bgcolor: 'white', borderBottomWidth: '2px', mt: '20px', mb: '20px'}} />

                {/* Users Bio */}
                <Typography
                  sx={{
                    fontSize: "h5.fontSize",
                    fontFamily: "Franklin Gothic Medium",
                    fontWeight: "bold",
                    color: 'white'
                  }}
                >
                  Bio
                </Typography>
                
                {/* The actual Bio textfield */}
                <TextField 
                variant="outlined" 
                sx=
                {{"& .MuiInputBase-root": {
                  color: "white"
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none"
                },
                }} 
                multiline
                rows={4}
                fullWidth 
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                InputProps={{
                  readOnly: !editBio
                }}>
                </TextField>

                { window.location.pathname.substring(9).split("%20").join(" ") === user.username &&
                [
                  <Box key="updateBioContainer" sx={{display: "flex", flexDirection: "row"}}>
                    <Switch key="updateBioToggle" sx={{mr: '5px'}} checked={editBio} onChange={e => setEditBio(e.target.checked)}>
                    
                    </Switch>

                    <Button key="updateBioButton" sx={{mb: '5px'}} fullWidth variant="contained" type="submit" onClick={updateBio} disabled={!editBio}>
                      Update Bio
                    </Button>
                  </Box>
                ]
                }
              </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          {/* Curation Coins */}
          <Paper
          sx={{
              mt: '50px',
              bgcolor: '#013459', 
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              border: 1,
              borderColor: 'black',
              borderWidth: '2px',
              width: '350px'
          }}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Typography className=".headers" sx={{color: 'white', fontSize: 'h4.fontSize'}}>
                Curation Coins: {formValues.curCoins}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Users Uploads and Curations */}
        <Grid item xs="auto">
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '50px'}}>

            {/* Uploaded Datasets */}
            <Paper
            sx={{
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "50px",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              bgcolor: "#013459",
              border: 1,
              borderColor: 'black',
              borderWidth: '2px',
              width: 400,
              height: 300,
            }}>
            <Box sx={{textAlign: 'center'}}>
                <Typography 
                className=".headers"
                sx={{
                fontSize: "h4.fontSize",
                fontFamily: "Franklin Gothic Medium",
                fontWeight: "bold",
                color: "white",
                overflowWrap: 'break-word',
                bgcolor: '#013459'
                }}>
                    Uploads
                </Typography>
                <Divider sx={{bgcolor: 'white', height: "2px"}}></Divider>
                <Box overflow='auto' sx={{textAlign: 'center', maxHeight: 260, mt: '15px'}}>
                  {uploadedDatasets.map(dataset => <div><DatasetListItem key={dataset.id} id={dataset.id} dataset={dataset} /></div>)}
                </Box>
              </Box>
            </Paper>

            {/* Curations */}
            <Paper
            sx={{
              mt: '25px',
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "50px",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              bgcolor: "#013459",
              border: 1,
              borderColor: 'black',
              borderWidth: '2px',
              width: 400,
              height: 300,
            }}>
            <Box sx={{textAlign: 'center'}}>
                <Typography 
                className=".headers"
                sx={{
                fontSize: "h4.fontSize",
                fontFamily: "Franklin Gothic Medium",
                fontWeight: "bold",
                color: "white",
                overflowWrap: 'break-word',
                bgcolor: '#013459'
                }}>
                    Curations
                </Typography>
                <Divider sx={{bgcolor: 'white', height: "2px"}}></Divider>
                <Box overflow='auto' sx={{textAlign: 'center', maxHeight: 260, mt: '15px'}}>
                  {curatedDatasets.map(dataset => <div><DatasetListItem key={dataset.id} id={dataset.id} dataset={dataset} /></div>)}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      </div>
  );
}
