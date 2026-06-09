import React, { useEffect, useState } from 'react'
import { Fab, Zoom } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <Zoom in={visible}>
      <Fab
        onClick={handleClick}
        size="medium"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1200,
          boxShadow: 4,
        }}
        aria-label="맨 위로"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  )
}

export default ScrollToTop
