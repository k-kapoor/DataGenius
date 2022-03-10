import React from "react"
import { Paper, Avatar, Typography, Box } from "@mui/material"
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from "react-router-dom";


export function LeaderboardItem(props) {
  return (
    <Paper sx={{
      mr: '20px', 
      ml: '20px', 
      height: '80px', 
      bgcolor: 'white', 
      mt: '10px', 
      border: 1,
      borderColor: 'black',
      borderWidth: '2px'
      }}>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', ml: '10px', height: '100%'}}>
        <Avatar component={Link} to={"/profile/" + props.user.username} alt="avatar" src={props.user.avatar} variant="rounded" sx={{mr: "10px", height: '60px', width: '60px'}} />
        <Box sx={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: '200px', maxWidth: '200px'}}>
          <Typography overflow='auto' sx={{color: 'black', fontSize: '32px', maxHeight: '50px'}}>
            {props.user.username}
          </Typography>
          <Typography sx={{color: 'black', fontSize: '12px'}}>
            {props.user.curationCoins} Curation Coin{props.user.curationCoins !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <Box sx={{display: 'flex', flexDirection:'row', alignItems: 'center', flexGrow: 1}}>
          <Typography sx={{color: 'black', fontSize: '32px'}}>
            Rank: <b>{props.user.currentRank}</b>
          </Typography>
        </Box>
        { props.user.currentRank === 1 &&
        <Box sx={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
          <EmojiEventsIcon sx={{width: '60px', height: '60px', color: 'gold'}}></EmojiEventsIcon>
        </Box>
        }
        { props.user.currentRank === 2 &&
        <Box sx={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
          <EmojiEventsIcon sx={{width: '60px', height: '60px', color: 'silver'}}></EmojiEventsIcon>
        </Box>
        }
        { props.user.currentRank === 3 &&
        <Box sx={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
          <EmojiEventsIcon sx={{width: '60px', height: '60px', color: '#CD7F32'}}></EmojiEventsIcon>
        </Box>
        }
      </Box>
    </Paper>
  )
}