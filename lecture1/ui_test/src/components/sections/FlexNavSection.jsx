import React from 'react'
import { Box, Typography } from '@mui/material'
import SectionBlock from './SectionBlock'

const MENU_ITEMS = ['홈', '소개', '상품', '연락처', '설정']

const FlexNavSection = () => {
  return (
    <SectionBlock title="17. Flex Navigation">

      {/* 네비게이션 박스 */}
      <Box
        sx={{
          width: '100%',
          height: '60px',
          backgroundColor: '#2d3748',
          borderRadius: 1,
          px: 3,

          /* flexbox 핵심 설정 */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >

        {/* 로고 박스 */}
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: 0.5,
            }}
          >
            MyWebsite
          </Typography>
        </Box>

        {/* 메뉴들 박스 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {MENU_ITEMS.map((item) => (
            <Typography
              key={item}
              sx={{
                color: '#a0aec0',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#ffffff',
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

      </Box>
    </SectionBlock>
  )
}

export default FlexNavSection
