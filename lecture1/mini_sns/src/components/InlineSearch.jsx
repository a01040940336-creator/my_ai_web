import { useState, useEffect, useRef, useMemo } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import PostCard from './PostCard'

export default function InlineSearch({ open, onClose, posts = [], savedIds, onToggleSave }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    } else {
      setQuery('')
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return posts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.region?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }, [posts, query])

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      {/* 컨텐츠 래퍼 — 데스크탑 최대 너비 */}
      <Box
        sx={{
          maxWidth: { md: 900, lg: 1200 },
          mx: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* 드래그 핸들 */}
        <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#E0E0E0' }} />
        </Box>

        {/* 검색 헤더 */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pt: 1.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            flexShrink: 0,
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            autoComplete="off"
            placeholder="팝업, 전시, 지역, 키워드"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#CCC', fontSize: 18 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                bgcolor: '#F7F7F7',
                '& fieldset': { border: 'none' },
                fontSize: '0.9rem',
              },
            }}
          />
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="검색 닫기"
            sx={{
              flexShrink: 0,
              color: '#888',
              bgcolor: '#F0F0F0',
              width: 36,
              height: 36,
              '&:hover': { bgcolor: '#E0E0E0', color: '#111' },
              transition: 'all 0.18s ease',
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* 구분선 */}
        <Box sx={{ height: '1px', bgcolor: '#F0F0F0', flexShrink: 0 }} />

        {/* 결과 영역 */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, md: 3 },
            pt: 2,
            pb: 5,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {query.trim() === '' ? (
            /* 초기 상태 */
            <Box sx={{ py: 7, textAlign: 'center' }}>
              <SearchIcon
                sx={{
                  fontSize: 44,
                  color: '#EBEBEB',
                  mb: 1.5,
                  display: 'block',
                  mx: 'auto',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: '#CCC',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                }}
              >
                키워드를 입력해 검색하세요
              </Typography>
            </Box>
          ) : filtered.length === 0 ? (
            /* 결과 없음 */
            <Box sx={{ py: 7, textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#555',
                  mb: 0.75,
                }}
              >
                "{query}"
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#BBB' }}>
                에 대한 검색 결과가 없어요
              </Typography>
            </Box>
          ) : (
            /* 검색 결과 */
            <>
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  color: '#AAA',
                  mb: 1.5,
                  letterSpacing: '0.08em',
                }}
              >
                <Box
                  component="span"
                  sx={{ fontWeight: 800, color: '#111', fontSize: '0.875rem' }}
                >
                  {filtered.length}
                </Box>
                {' '}results
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                  gap: { xs: 2, md: 2.5 },
                }}
              >
                {filtered.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isSaved={savedIds.has(post.id)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
