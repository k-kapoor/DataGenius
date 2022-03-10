import '../index.css'
import React, {useState} from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import {login} from "../APIClient.js";
import { DataGeniusContext } from "../DataGeniusContext";
import { Switch } from "@mui/material";
import { FormControlLabel } from '@mui/material';
import { FormGroup } from "@mui/material";
import DataGeniusLogo from '../assets/images/DataGeniusLogo.png'


export function Login(props) {
  const {setUser} = React.useContext(DataGeniusContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const data = {
    name,
    password,
    rememberMe
  };

//   useEffect(() => {
//     if(user.username ) {
//       console.log("Hi paul");
//       history.push("/profile");
//     }
// }, [])

  function onSubmit() {
    login(data).then(response => {
      setUser({exists: true, username: response.data.name, avatar: response.data.avatar});
      console.log(response.data.avatar)
      history.push("/profile");
    }).catch(err => alert("Invalid username or password!"));
  }

  function handleDisable() {
    if (name && password) {
      return false;
    } else {
      return true;
    }
  }

  return (
    
    <div>
        <Box sx={{display: 'flex', justifyContent: 'center', mt: '50px'}}>
          <img alt="logo" src={DataGeniusLogo} style={{maxWidth: '30%'}} />
        </Box>
      
      <Box sx={{display: 'flex', justifyContent: 'center', mt: '25px'}}>
        <Paper
          elevation={3}
          sx={{
            paddingBottom: "50px",
            paddingLeft: "50px",
            paddingRight: "50px",
            width: "50%",
            maxWidth: "250px"
          }}
        >
          
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{fontSize: '50px', mb: '10px', mt: '10px'}} className="headers">
              <b>Login</b>
            </Typography>
            <Box>
              <TextField
                label="Name"
                value={data.name}
                onChange={e => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                onChange={e => setPassword(e.target.value)}
                value={data.password}
                label="Password"
                type="password"
                fullWidth
                //sx={{ mb: 2 }}
              />

              {/*-- Not an actual form, just styling for the Checkbox */}
              <FormGroup>
                <FormControlLabel control={<Switch/>} label="Remember Me" onChange={e => setRememberMe(e.target.checked)}/>
              </FormGroup>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#024F87",
                    mb: 2,
                    "&:hover": { bgcolor: "#0C97FB" }
                  }}
                  type="button"
                  onClick={onSubmit}
                  fullWidth
                  disabled={handleDisable()}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#024F87",
                    "&:hover": { bgcolor: "#0C97FB" }
                  }}
                  fullWidth
                  component={Link}
                  to="/register"
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
    );
  }