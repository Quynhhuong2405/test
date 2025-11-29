import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Stack, Tooltip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'

export default function Topbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#6366f1', 
        color: 'white',
        zIndex: 1100
      }} 
      elevation={2}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* Logo */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box 
            sx={{ 
              height: 44, 
              width: 44, 
              bgcolor: 'white', 
              borderRadius: 2,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img 
              src={logoImg} 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', whiteSpace: 'nowrap' }}>
            Safe To School
          </Typography>
        </Stack>

        {/* Avatar + Logout */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar 
              sx={{ 
                width: 38, 
                height: 38, 
                bgcolor: '#4f46e5',
                border: '2px solid white',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              AD
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight="600" sx={{ color: 'white', lineHeight: 1.2 }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Quản trị viên
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Đăng xuất">
            <IconButton 
              onClick={handleLogout} 
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}