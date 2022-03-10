import React, {useState} from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import {signup} from "../APIClient.js";
import { Link } from "react-router-dom";
import DataGeniusLogo from '../assets/images/DataGeniusLogo.png'
 
// const defaultValues = {
//     username: "",
//     password: "",
//     email: "",

//   };
  
  export function Register(props) {
    // const [formValues, setFormValues] = useState(defaultValues);
    const [email, setEmail] = useState('');
    const [confEmail, setConfEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorMsgDetails, setErrorMsgDetails] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [emailErrorBox, setEmailErrorBox] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState('');

    const data={
      email,
      confEmail,
      name,
      password,
      confPassword
    };

    function onSubmit(e) {
      e.preventDefault();
      setEmail("");
      setConfEmail("")
      setName("")
      setPassword("")
      setConfPassword("")
      //console.log(email)
      signup(data).then(response => {
        if (response.status === 200) {
          setSuccessMsg('Account successfully registered!')
          setErrorMsgDetails('')
          setErrorMsg('')
          setEmailErrorBox(false)
          setEmailHelperText('')
        } else {
          //TODO implement actual error messages
          setErrorMsgDetails(response.response.data.msg)
          if (response.response.data.msg.includes("Email") || response.response.data.msg.includes("email")) {
            setEmailErrorBox(true)
            setEmailHelperText(response.response.data.msg)
          }
          setErrorMsg('Error registering account')
          // Change this so it gets the error message the backend sends out
          setSuccessMsg('')
        }
      });
    }

    const handleDisable = () => {
      if (email && confEmail && name && password && confPassword) {
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
            paddingLeft: "50px",
            paddingRight: "50px",
            paddingBottom: "25px",
            width: "50%",
            maxWidth: "250px",
            mb: '50px'
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box>

              <Typography sx={{fontSize: '50px', mb: '10px', mt: '10px'}} className="headers">
                  <b>Register</b>
              </Typography>

              <form noValidate autoComplete="off" onSubmit={onSubmit}>
                <TextField
                  name="email"
                  label="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  value={email}
                  error={emailErrorBox}
                  helperText={emailHelperText}
                />
                <TextField
                  name="confirmEmail"
                  label="Confirm Email"
                  onChange={(e) => setConfEmail(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  value={confEmail}
                  error={emailErrorBox}
                  helperText={emailHelperText}
                />
                <TextField
                  name="username"
                  label="Username"
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  value={name}
                />
                <TextField
                  name="Password"
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  value={password}
                />
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  onChange={(e) => setConfPassword(e.target.value)}
                  type="password"
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  value={confPassword}
                />
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#024F87",
                      "&:hover": { bgcolor: "#0C97FB" },
                      mb: 2
                    }}
                    type="submit"
                    fullWidth
                    disabled={handleDisable()}
                  >
                    Sign-Up
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#dd5757",
                      "&:hover": { bgcolor: "#9c3d3d" },
                    }}
                    component={Link}
                    to="/login"
                  >
                    Back to login
                  </Button>
                </Box>
                <Typography sx={{color: "green", fontSize: "12px"}}>
                  {successMsg}
                </Typography>
                <Typography sx={{color: "red", fontSize: "12px"}}>
                  {errorMsg}
                </Typography>
                <Typography sx={{color: "red", fontSize: "12px"}}>
                  {errorMsgDetails}
                </Typography>
              </form>
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}