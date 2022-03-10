import { Box } from "@mui/system"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from "react"
import { AccordionDetails, AccordionSummary, Typography, Accordion } from "@mui/material"

export function FAQ() {
  return(
    <div>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '50px'}}>
        <Accordion sx={{width: '50%'}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Example Question</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Example Answer
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  )
}