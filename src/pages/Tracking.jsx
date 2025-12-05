import React from "react";
import { Box, Typography, Paper, Stack, Chip, Alert } from "@mui/material";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function Tracking() {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Theo dõi GPS
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Theo dõi vị trí xe buýt theo thời gian thực
          </Typography>
        </Box>
        <Chip icon={<MyLocationIcon />} label="Real-time" color="success" />
      </Stack>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Tính năng theo dõi GPS cần kết nối WebSocket với backend.  Hãy đảm bảo backend đang chạy và có xe đang hoạt động. 
      </Alert>

      <Paper 
        elevation={0} 
        sx={{ 
          height: 500, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8fafc'
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <DirectionsBusIcon sx={{ fontSize: 80, color: '#cbd5e1' }} />
          <Typography variant="h6" color="text.secondary">
            Bản đồ theo dõi xe
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Tích hợp Google Maps hoặc Leaflet để hiển thị vị trí xe. <br/>
            Cần cài đặt thêm thư viện bản đồ. 
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}