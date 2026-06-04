import React, { useState } from 'react'
import { Box, Slider, Typography } from '@mui/material'
import SectionBlock from './SectionBlock'

const MARKS = [
  { value: 0,   label: '0' },
  { value: 25,  label: '25' },
  { value: 50,  label: '50' },
  { value: 75,  label: '75' },
  { value: 100, label: '100' },
]

const SLIDERS = [
  { key: 'basic',    label: '기본 슬라이더',            color: 'primary',   step: 1  },
  { key: 'stepped',  label: '구간 슬라이더 (step 25)', color: 'secondary', step: 25 },
  { key: 'range',    label: '범위 슬라이더',            color: 'primary',   step: 1  },
]

const SliderSection = () => {
  const [values, setValues] = useState({ basic: 40, stepped: 50, range: [20, 70] })

  const handleChange = (key) => (_, newValue) => {
    setValues((prev) => ({ ...prev, [key]: newValue }))
  }

  const formatDisplay = (key) => {
    const v = values[key]
    return Array.isArray(v) ? `${v[0]} ~ ${v[1]}` : `${v}`
  }

  return (
    <SectionBlock title="07. Slider">
      {SLIDERS.map(({ key, label, color, step }) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 280 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {label}
          </Typography>
          <Slider
            value={values[key]}
            onChange={handleChange(key)}
            min={0}
            max={100}
            step={step}
            marks={MARKS}
            color={color}
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" color="text.secondary">
            현재 값: <strong style={{ color: '#1976d2' }}>{formatDisplay(key)}</strong>
          </Typography>
        </Box>
      ))}
    </SectionBlock>
  )
}

export default SliderSection
