import React from 'react'
import { Box, Typography, Divider } from '@mui/material'

const SectionBlock = ({ title, children }) => {
  return (
    <Box className="section-wrapper">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {children}
      </Box>
    </Box>
  )
}

export default SectionBlock
