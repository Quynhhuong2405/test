import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Admin_Layouts() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <Topbar />

        {/* Nội dung trang */}
        <Box component="main" sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet context={{ q: '' }} />
        </Box>
      </Box>
    </Box>
  )
}