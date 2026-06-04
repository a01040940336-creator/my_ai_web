import React, { useState } from 'react'
import {
  Box, AppBar, Toolbar, Typography, Button,
  IconButton, Drawer, List, ListItemButton, ListItemText,
  useMediaQuery, useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SectionBlock from './SectionBlock'

const MENUS = ['홈', '소개', '서비스', '연락처']

const NavigationSection = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleMenu = (name) => {
    alert(`메뉴 클릭: ${name}`)
    setDrawerOpen(false)
  }

  return (
    <SectionBlock title="03. Navigation">
      <Box sx={{ width: '100%', borderRadius: 1, overflow: 'hidden' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              MyApp
            </Typography>

            {isMobile ? (
              <>
                <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                >
                  <Box sx={{ width: 200, pt: 2 }}>
                    <List>
                      {MENUS.map((name) => (
                        <ListItemButton key={name} onClick={() => handleMenu(name)}>
                          <ListItemText primary={name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                </Drawer>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {MENUS.map((name) => (
                  <Button key={name} color="inherit" onClick={() => handleMenu(name)}>
                    {name}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </SectionBlock>
  )
}

export default NavigationSection
