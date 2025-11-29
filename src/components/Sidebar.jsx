import { List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar, Tooltip, Divider, IconButton } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SchoolIcon from '@mui/icons-material/School'
import RouteIcon from '@mui/icons-material/AltRoute'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { NavLink, useLocation } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState } from 'react'

const items = [
  { to: '/admin/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/admin/students', icon: <SchoolIcon />, label: 'Danh sách học sinh' },
  { to: '/admin/drivers', icon: <PeopleIcon />, label: 'Danh sách tài xế' },
  { to: '/admin/buses', icon: <DirectionsBusIcon />, label: 'Danh sách xe' },
  { to: '/admin/routes', icon: <RouteIcon />, label: 'Tuyến đường' },
  { to: '/admin/schedules', icon: <CalendarMonthIcon />, label: 'Lịch trình' },
  { to: '/admin/assignments', icon: <CompareArrowsIcon />, label: 'Phân công' },
  { to: '/admin/messages', icon: <NotificationsIcon />, label: 'Thông báo' },
  { to: '/admin/tracking', icon: <MyLocationIcon />, label: 'Live Tracking' },
]

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 72

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  const currentWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <Box 
      sx={{ 
        width: currentWidth, 
        flexShrink: 0, 
        borderRight: '1px solid #e2e8f0', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.2s ease'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <Divider />
      <List sx={{ px: 1, py: 1, flex: 1, overflowY: 'auto' }}>
        {items.map((item) => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
          const button = (
            <ListItemButton
              key={item. to}
              component={NavLink}
              to={item. to}
              selected={active}
              sx={{
                gap: 1,
                borderRadius: 2,
                my: 0.5,
                transition: 'all 0.2s',
                '&. Mui-selected': {
                  bgcolor: '#6366f1',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0. 4)',
                },
                '&. Mui-selected:hover': { 
                  bgcolor: '#4f46e5',
                },
                '&:hover': {
                  bgcolor: '#e0e7ff',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? 'white' : '#6366f1' }}>
                {item.icon}
              </ListItemIcon>
              {! collapsed && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: '0.9rem' }} 
                />
              )}
            </ListItemButton>
          )
          return collapsed ?  (
            <Tooltip key={item. to} title={item.label} placement="right">{button}</Tooltip>
          ) : (
            button
          )
        })}
      </List>
      
      {/* Collapse toggle */}
      <Box sx={{ px: 1, pb: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <IconButton 
          onClick={() => setCollapsed((v) => !v)} 
          sx={{ mx: 'auto', display: 'block', color: '#6366f1' }} 
          size="small"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}