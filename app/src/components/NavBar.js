import React, {useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Avatar, Box, Typography, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, Fade, Divider, TextField, InputAdornment  } from "@mui/material";
import {Logout, Delete} from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout, deleteUser} from "../APIClient.js";
import {Link, useHistory, Redirect} from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { getUser } from "../APIClient.js";

import { DataGeniusContext } from "../DataGeniusContext";
import { Profile } from "../pages/Profile.js";

export function NavBar(props) {
  
  const history = useHistory();

  // Current user that is logged in
  const {user, setUser} = React.useContext(DataGeniusContext);

  // Curator search bar text
  const [searchCurator, setSearchCurator] = useState("");

  // Anchor for the profile dropdown menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Bool for if the menu is open
  const open = Boolean(anchorEl);

  // Handles the profile dropdown menu event
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Logs users out
  function logoutNow() {
    logout();
    setUser({exists: false, username: ""})
  }

  // Deletes users account
  function deleteNow() {
      deleteUser(user.username);
      setUser({exists: false, username: ""})
  }

  // Goes to users profile that is typed
  function searchSubmit(e) {
    e.preventDefault();
    setSearchCurator("");
    history.push('/profile/'+searchCurator)
    window.location.reload(false)
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#013459" }}>
      <Toolbar>
        <img
          alt="sas logo"
          src="https://www.sas.com/en_us/navigation/header/global-header/_jcr_content/par/styledcontainer_3b8d/par/image_baf8.img.png/1632490987209.png"
          style={{ maxWidth: 100 }}
        />
        { user.exists &&
        [
          // Container for Curate, Leaderboards, and FAQ
          <Box key="item1" sx={{flexGrow: 1, flexDirection: "row", display: "flex"}}>
            <Button 
              variant="text" 
              sx={{
              fontSize: "32px",
              textTransform: 'none',
              color: "white",
              maxHeight: '50px',
              ml: '5%',
              mr: '5%'
              }}
              component={Link}
              to="/curate"
              >
                Curate
            </Button>
            <Divider sx={{bgcolor: "white", width: '2px'}} orientation="vertical" flexItem/>
            <Button 
              component={Link}
              to={"/leaderboard"}
              variant="text" 
              sx={{
              fontSize: "32px",
              textTransform: 'none',
              color: "white",
              maxHeight: '50px',
              ml: '5%',
              mr: '5%'
              }}>
                Leaderboards
            </Button>
            <Divider sx={{bgcolor: "white", width: '2px'}} orientation="vertical" flexItem/>
            <Button variant="text"
              component={Link}
              to={"/faq"}
              sx={{
              fontSize: "32px",
              textTransform: 'none',
              color: "white",
              maxHeight: '50px',
              ml: '5%',
              mr: '5%'
              }}>
                FAQ
            </Button>
            <Divider sx={{bgcolor: "white", width: '2px'}} orientation="vertical" flexItem/>
            <TextField 
            variant="outlined" 
            size="small" 
            placeholder="Search for curators" 
            value={searchCurator}
            onChange={(e) => setSearchCurator(e.target.value)}
            sx={{
              ml: '5%',
              mr: '5%',
              background: 'white',
              height: '40px',
              borderRadius: 1,
              mt: '5px'
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" onClick={searchSubmit}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              > 
            </TextField>
          </Box>, 

          // Tooltip for menu
          
        <Tooltip key="item2" title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
            <Avatar src={user.avatar} sx={{border: 1, borderWidth: "2px", borderColor: "white"}}></Avatar>
          </IconButton>
        </Tooltip>,

        // Account menu

        <Menu
          key="item3"
          TransitionComponent={Fade}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{"& .MuiPaper-root": {
                backgroundColor: "#013459"
              }
          }}
        >
          {/* PROFILE */}
          <MenuItem sx={{
          ml: "10px", 
          mr: "10px",
          mb: "10px",
          backgroundColor: "white",
          "&:hover": {
            bgcolor: "#013459", 
            color: "white",
            "& .ListIcon": {
               color: "white"
            }
          }
          }}
          component={Link} to={"/profile"}
          >
            <ListItemIcon className="ListIcon">
              <AccountCircleIcon fontSize="medium" />
            </ListItemIcon>
            Profile
          </MenuItem>

          {/* LOGOUT */}
          <MenuItem sx={{
          mb: "10px", 
          ml: "10px", 
          mr: "10px", 
          backgroundColor: "white", 
          "&:hover": {
            bgcolor: "#013459", 
            color: "white",
            "& .ListIcon": {
               color: "white"
            }
          },
          }} 
          onClick={logoutNow} 
          component={Link} 
          to={"/login"}
          >
            <ListItemIcon className="ListIcon">
              <Logout fontSize="medium" />
            </ListItemIcon>
            Logout
          </MenuItem>
          
          {/* DELETE */}
          <MenuItem sx={{
          ml: "10px", 
          mr: "10px",
          backgroundColor: "white",
          "&:hover": {
            bgcolor: "#013459", 
            color: "white",
            "& .ListIcon": {
               color: "white"
            }
          }
          }}
          onClick={deleteNow} 
          component={Link} to={"/login"}
          >
            <ListItemIcon className="ListIcon">
              <Delete fontSize="medium" />
            </ListItemIcon>
            Delete Account
          </MenuItem>
          
        </Menu>,
          <Typography key="item4" sx={{ml: "10px"}}>{user.username}</Typography>
        ]
        }
      </Toolbar>
    </AppBar>
);
}