import React, { useState } from 'react'
import {
  Box, Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, Typography, Chip,
} from '@mui/material'
import SectionBlock from './SectionBlock'

const GROUPS = [
  {
    label: '개발 직군',
    options: [
      { value: 'frontend', label: '프론트엔드' },
      { value: 'backend',  label: '백엔드' },
      { value: 'fullstack', label: '풀스택' },
      { value: 'devops',   label: 'DevOps' },
    ],
  },
  {
    label: '경력',
    options: [
      { value: 'junior',  label: '주니어 (0~3년)' },
      { value: 'mid',     label: '미드 (3~7년)' },
      { value: 'senior',  label: '시니어 (7년+)' },
    ],
  },
]

const RadioSection = () => {
  const [values, setValues] = useState({})

  const handleChange = (groupLabel) => (e) => {
    setValues((prev) => ({ ...prev, [groupLabel]: e.target.value }))
  }

  return (
    <SectionBlock title="06. Radio">
      {GROUPS.map(({ label, options }) => {
        const selected = options.find((o) => o.value === values[label])
        return (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 200 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 600, mb: 0.5 }}>{label}</FormLabel>
              <RadioGroup value={values[label] ?? ''} onChange={handleChange(label)}>
                {options.map(({ value, label: optLabel }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    label={optLabel}
                    control={<Radio color="primary" />}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Box sx={{ minHeight: 28 }}>
              {selected
                ? <Chip label={`선택: ${selected.label}`} color="primary" size="small" />
                : <Typography variant="body2" color="text.disabled">선택 전</Typography>
              }
            </Box>
          </Box>
        )
      })}
    </SectionBlock>
  )
}

export default RadioSection
