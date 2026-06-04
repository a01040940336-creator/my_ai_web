import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import SectionBlock from './components/sections/SectionBlock'
import ButtonSection from './components/sections/ButtonSection'
import InputSection from './components/sections/InputSection'
import NavigationSection from './components/sections/NavigationSection'
import DropdownSection from './components/sections/DropdownSection'
import CheckboxSection from './components/sections/CheckboxSection'
import RadioSection from './components/sections/RadioSection'
import SliderSection from './components/sections/SliderSection'
import ModalSection from './components/sections/ModalSection'
import CardSection from './components/sections/CardSection'
import DragDropSection from './components/sections/DragDropSection'
import ScrollSection from './components/sections/ScrollSection'
import AnimationSection from './components/sections/AnimationSection'
import MenuSection from './components/sections/MenuSection'
import SidebarSection from './components/sections/SidebarSection'
import HoverSection from './components/sections/HoverSection'
import SwipeSection from './components/sections/SwipeSection'
import './styles/global.css'

const App = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          UI 컴포넌트 테스트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          MUI 16개 UI 요소 순차 구현
        </Typography>
      </Box>

      <ButtonSection />
      <InputSection />
      <NavigationSection />
      <DropdownSection />
      <CheckboxSection />
      <RadioSection />
      <SliderSection />
      <ModalSection />
      <CardSection />
      <DragDropSection />
      <ScrollSection />
      <AnimationSection />
      <MenuSection />
      <SidebarSection />
      <HoverSection />
      <SwipeSection />

    </Container>
  )
}

export default App
