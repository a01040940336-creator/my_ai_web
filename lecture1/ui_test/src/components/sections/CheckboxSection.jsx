import React, { useState } from 'react'
import {
  Box, Checkbox, FormControlLabel, FormGroup,
  Typography, Divider, Chip,
} from '@mui/material'
import SectionBlock from './SectionBlock'

const ITEMS = [
  { value: 'html',       label: 'HTML' },
  { value: 'css',        label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react',      label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
]

const CheckboxSection = () => {
  const [checked, setChecked] = useState([])

  const isAllChecked = checked.length === ITEMS.length
  const isIndeterminate = checked.length > 0 && !isAllChecked

  const handleAll = () => {
    setChecked(isAllChecked ? [] : ITEMS.map((i) => i.value))
  }

  const handleItem = (value) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  return (
    <SectionBlock title="05. Checkbox">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 260 }}>
        <FormControlLabel
          label={<Typography fontWeight={700}>전체 선택</Typography>}
          control={
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleAll}
              color="primary"
            />
          }
        />
        <Divider />
        <FormGroup sx={{ pl: 2 }}>
          {ITEMS.map(({ value, label }) => (
            <FormControlLabel
              key={value}
              label={label}
              control={
                <Checkbox
                  checked={checked.includes(value)}
                  onChange={() => handleItem(value)}
                  color="primary"
                />
              }
            />
          ))}
        </FormGroup>
        <Divider />
        <Box sx={{ pt: 0.5 }}>
          <Chip
            label={`${checked.length} / ${ITEMS.length}개 선택됨`}
            color={checked.length > 0 ? 'primary' : 'default'}
            size="small"
          />
        </Box>
      </Box>
    </SectionBlock>
  )
}

export default CheckboxSection
