import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export const SkeletonCard = () => (
  <Box>
    <Skeleton variant="rectangular" sx={{ paddingTop: '120%', borderRadius: 1.5 }} animation="wave" />
    <Box sx={{ mt: 0.75, px: 0.25 }}>
      <Skeleton variant="text" width="50%" height={12} animation="wave" />
      <Skeleton variant="text" width="90%" height={16} animation="wave" />
      <Skeleton variant="text" width="70%" height={12} animation="wave" />
    </Box>
  </Box>
)

export const SkeletonGrid = ({ count = 6 }) => (
  <Box sx={{
    px: { xs: 2, md: 3 },
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
    gap: { xs: 2, md: 2.5 },
  }}>
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </Box>
)

export const SkeletonCalendarCard = () => (
  <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, mb: 1, bgcolor: '#FAFAFA', borderRadius: 2 }}>
    <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1.5, flexShrink: 0 }} animation="wave" />
    <Box sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="80%" height={18} animation="wave" />
      <Skeleton variant="text" width="50%" height={14} animation="wave" />
      <Skeleton variant="text" width="70%" height={12} animation="wave" sx={{ mt: 0.5 }} />
      <Skeleton variant="rectangular" width="100%" height={3} sx={{ borderRadius: 2, mt: 1 }} animation="wave" />
    </Box>
  </Box>
)
