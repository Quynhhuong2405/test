import React from "react"
import { Grid, Paper, Typography, Box, Stack, Button, List, ListItem, ListItemIcon, ListItemText, Divider, LinearProgress, Avatar, Chip } from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import PersonIcon from "@mui/icons-material/Person"
import RouteIcon from "@mui/icons-material/Route"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import ScheduleIcon from "@mui/icons-material/Schedule"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WarningIcon from "@mui/icons-material/Warning"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import { useNavigate } from "react-router-dom"

const stats = [
  { title: "Tổng học sinh", value: "150", icon: <PeopleIcon />, color: "#22c55e", trend: "+12 tuần này" },
  { title: "Tổng tài xế", value: "12", icon: <PersonIcon />, color: "#6366f1", trend: "Đang hoạt động" },
  { title: "Tổng xe buýt", value: "8", icon: <DirectionsBusIcon />, color: "#f59e0b", trend: "6 đang chạy" },
  { title: "Tuyến đường", value: "5", icon: <RouteIcon />, color: "#ef4444", trend: "Hoạt động tốt" },
]

const recentActivities = [
  { time: "08:30", message: "Xe 51B-12345 đã xuất phát tuyến A", type: "success" },
  { time: "08:25", message: "Học sinh Nguyễn Văn A đã lên xe", type: "info" },
  { time: "08:20", message: "Tài xế Trần B đã check-in", type: "info" },
  { time: "08:15", message: "Xe 51B-67890 đang bảo trì", type: "warning" },
  { time: "08:00", message: "Hệ thống khởi động thành công", type: "success" },
]

const quickActions = [
  { label: "Thêm học sinh", path: "/admin/students", icon: <PeopleIcon /> },
  { label: "Thêm tài xế", path: "/admin/drivers", icon: <PersonIcon /> },
  { label: "Quản lý xe", path: "/admin/buses", icon: <DirectionsBusIcon /> },
  { label: "Xem Live Tracking", path: "/admin/tracking", icon: <DirectionsRunIcon /> },
]

const todaySchedule = [
  { route: "Tuyến A", bus: "51B-12345", driver: "Nguyễn Văn A", status: "Đang chạy", progress: 65 },
  { route: "Tuyến B", bus: "51B-67890", driver: "Trần Văn B", status: "Chưa bắt đầu", progress: 0 },
  { route: "Tuyến C", bus: "51B-11111", driver: "Lê Văn C", status: "Hoàn thành", progress: 100 },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Chào mừng trở lại!  Đây là tổng quan hệ thống hôm nay. 
          </Typography>
        </Box>
        <Chip 
          icon={<ScheduleIcon />} 
          label={new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 500 }}
        />
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: '1px solid #e2e8f0',
                transition: 'all 0. 3s',
                '&:hover': {
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: stat.color,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" sx={{ color: stat.color, fontWeight: 500 }}>
                  {stat.trend}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#1e293b' }}>
              ⚡ Thao tác nhanh
            </Typography>
            <Stack spacing={1.5}>
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={() => navigate(action.path)}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#e2e8f0',
                    color: '#475569',
                    '&:hover': {
                      bgcolor: '#6366f1',
                      color: 'white',
                      borderColor: '#6366f1',
                    }
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#1e293b' }}>
              📅 Lịch trình hôm nay
            </Typography>
            <Stack spacing={2}>
              {todaySchedule.map((schedule, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#6366f1', width: 36, height: 36 }}>
                        <DirectionsBusIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography fontWeight="600" sx={{ color: '#1e293b' }}>{schedule.route}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {schedule.bus} • {schedule.driver}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip 
                      size="small"
                      label={schedule.status}
                      color={schedule.progress === 100 ? 'success' : schedule.progress > 0 ? 'primary' : 'default'}
                    />
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={schedule.progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: schedule.progress === 100 ? '#22c55e' : '#6366f1',
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#1e293b' }}>
              🔔 Hoạt động gần đây
            </Typography>
            <List sx={{ py: 0 }}>
              {recentActivities. map((activity, idx) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {activity.type === 'success' && <CheckCircleIcon sx={{ color: '#22c55e' }} />}
                      {activity.type === 'warning' && <WarningIcon sx={{ color: '#f59e0b' }} />}
                      {activity.type === 'info' && <NotificationsActiveIcon sx={{ color: '#6366f1' }} />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontWeight: 500, color: '#1e293b' }}
                      secondaryTypographyProps={{ color: '#64748b' }}
                    />
                  </ListItem>
                  {idx < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}