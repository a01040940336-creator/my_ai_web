import React, { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import SectionBlock from './SectionBlock'

const VARIANTS = ['standard', 'outlined', 'filled']

const InputSection = () => {
  const [values, setValues] = useState({ standard: '', outlined: '', filled: '' })

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }))
  }

  return (
    <SectionBlock title="02. Input">
      {VARIANTS.map((variant) => (
        <Box key={variant} sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {variant}
          </Typography>
          <TextField
            variant={variant}
            label={`${variant} label`}
            placeholder={`${variant} 입력...`}
            value={values[variant]}
            onChange={handleChange(variant)}
          />
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 20 }}>
            입력값: <strong>{values[variant] || '—'}</strong>
          </Typography>
        </Box>
      ))}
    </SectionBlock>
  )
}

export default InputSection
