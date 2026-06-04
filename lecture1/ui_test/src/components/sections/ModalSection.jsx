import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, IconButton, Typography, Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SectionBlock from './SectionBlock'

const MODALS = [
  {
    key: 'info',
    trigger: '정보 모달 열기',
    title: '안내',
    content: '이것은 정보 안내 모달입니다. 확인 버튼을 눌러 닫을 수 있어요.',
    color: 'primary',
  },
  {
    key: 'confirm',
    trigger: '확인 모달 열기',
    title: '삭제 확인',
    content: '정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    color: 'error',
  },
]

const ModalSection = () => {
  const [open, setOpen] = useState({})
  const [result, setResult] = useState({})

  const handleOpen = (key) => setOpen((prev) => ({ ...prev, [key]: true }))
  const handleClose = (key, action) => {
    setOpen((prev) => ({ ...prev, [key]: false }))
    if (action) setResult((prev) => ({ ...prev, [key]: action }))
  }

  return (
    <SectionBlock title="08. Modal">
      {MODALS.map(({ key, trigger, title, content, color }) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {title}
          </Typography>

          <Button variant="contained" color={color} onClick={() => handleOpen(key)}>
            {trigger}
          </Button>

          <Box sx={{ minHeight: 28 }}>
            {result[key]
              ? <Chip
                  label={`결과: ${result[key]}`}
                  color={result[key] === '확인' ? 'success' : 'default'}
                  size="small"
                />
              : <Typography variant="body2" color="text.disabled">—</Typography>
            }
          </Box>

          <Dialog
            open={!!open[key]}
            onClose={() => handleClose(key)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ pr: 6 }}>
              {title}
              <IconButton
                onClick={() => handleClose(key, '닫기')}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => handleClose(key, '취소')} color="inherit">
                취소
              </Button>
              <Button onClick={() => handleClose(key, '확인')} variant="contained" color={color}>
                확인
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ))}
    </SectionBlock>
  )
}

export default ModalSection
