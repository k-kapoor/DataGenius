import { Avatar, Divider, Paper, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import { DataGeniusContext } from "../DataGeniusContext"
import { getAllUsers } from "../APIClient"
import { LeaderboardItem } from "../components/LeaderboardItem"


export function Leaderboard(props) {
  const {user} = React.useContext(DataGeniusContext)

  // Leaderboard array
  const [leaderboard, setLeaderboard] = useState([])
  
  // Rank of the currently logged in user
  const [rank, setRank] = useState("Loading...")

  // Curation coins the current user has
  const [curationCoins, setCurationCoins] = useState("Loading...")


  // Sort the users on the leaderboard
  useEffect(() => {
    getAllUsers().then(response => {
      let temp = []
      let rank = 0;
      let prevCoins = 99999999;
      response.data.list.forEach(dude => {
        // If the current users coins is the same as the previous, they should be the same rank so don't inc rank
        if (dude.curCoins < prevCoins) {
          rank += 1
        }
        temp.push(
          {username: dude.name,
           currentRank: rank,
           avatar: dude.avatar,
           curationCoins: dude.curCoins,
           id: dude.id
          })
        
        // user stats at top
        if (user.username === dude.name) {
          setRank(rank)
          setCurationCoins(dude.curCoins)
        }
        prevCoins = dude.curCoins
      })
      setLeaderboard(temp)
    })
  }, [user.username])

  

  return (
    <div>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        {/* Current users stats */}

        <Paper sx={{mt: "50px", mb: "25px", width: '50%', height: '200px', bgcolor: '#013459', justifyContent: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%', width: '95%', ml: 'auto', mr: 'auto'}}>
            <Avatar variant="rounded" alt="avatar" sx={{height: '180px', width: '180px', mr: '20px'}} src={user.avatar} />
            <Typography sx={{color: 'white', fontSize: '32px', maxWidth: '180px', maxHeight: '180px', mr: '80px'}}>
              {user.username}
            </Typography>
            <Typography sx={{color: 'white', fontSize: '32px', mr: '40px'}}>
              Curation Coins: {curationCoins}
            </Typography>
            <Typography sx={{color: 'white', fontSize: '32px',  mr: '20px'}}>
              Rank: {rank}
            </Typography>
          </Box>
        </Paper>

        {/* Leaderboard */}

          <Paper  sx={{width: '50%', bgcolor: '#013459', maxHeight: '500px', mb: '20px', paddingBottom: '10px'}}>
            <Box overflow="auto" sx={{maxHeight: '500px'}}>
              {leaderboard.map(user => <LeaderboardItem key={user.id} user={user} />)}
            </Box>
          </Paper>
      </Box>
    </div>
  )
}