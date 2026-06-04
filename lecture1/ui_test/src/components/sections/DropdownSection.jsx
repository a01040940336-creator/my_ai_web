import React, { useState } from 'react'
import {
  Box, FormControl, InputLabel, Select, MenuItem, Typography, Chip,
} from '@mui/material'
import SectionBlock from './SectionBlock'

const OPTIONS = [
  { value: 'react',      label: 'React' },
  { value: 'vue',        label: 'Vue.js' },
  { value: 'angular',    label: 'Angular' },
  { value: 'svelte',     label: 'Svelte' },
  { value: 'nextjs',     label: 'Next.js' },
  { value: 'nuxt',       label: 'Nuxt.js' },
]

const VARIANTS = [
  { variant: 'outlined', label: 'Outlined' },
  { variant: 'filled',   label: 'Filled' },
  { variant: 'standard', label: 'Standard' },
]

const DropdownSection = () => {
  const [values, setValues] = useState({ outlined: '', filled: '', standard: '' })

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }))
  }

  return (
    <SectionBlock title="04. Dropdown">
      {VARIANTS.map(({ variant, label }) => (
        <Box key={variant} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 220 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {label}
          </Typography>

          <FormControl variant={variant} fullWidth>
            <InputLabel>프레임워크 선택</InputLabel>
            <Select
              value={values[variant]}
              label={variant === 'outlined' ? '프레임워크 선택' : undefined}
              onChange={handleChange(variant)}
            >
              {OPTIONS.map(({ value, label: optLabel }) => (
                <MenuItem key={value} value={value}>
                  {optLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ minHeight: 28 }}>
            {values[variant]
              ? <Chip label={`선택: ${OPTIONS.find(o => o.value === values[variant])?.label}`} color="primary" size="small" />
              : <Typography variant="body2" color="text.disabled">선택 전</Typography>
            }
          </Box>
        </Box>
      ))}
    </SectionBlock>
  )
}

export default DropdownSection
