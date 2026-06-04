import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import SectionBlock from './SectionBlock'

const VARIANTS = ['contained', 'outlined', 'text']
const COLORS = ['primary', 'secondary', 'error']

const ButtonSection = () => {
  const handleClick = (variant, color) => {
    alert(`variant: ${variant} / color: ${color}`)
  }

  return (
    <SectionBlock title="01. Button">
      {VARIANTS.map((variant) => (
        <Box key={variant} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {variant}
          </Typography>
          {COLORS.map((color) => (
            <Button
              key={color}
              variant={variant}
              color={color}
              onClick={() => handleClick(variant, color)}
            >
              {color}
            </Button>
          ))}
        </Box>
      ))}
    </SectionBlock>
  )
}

export default ButtonSection
