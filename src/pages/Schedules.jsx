import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Chip, Stack, Tooltip,
  CircularProgress, Avatar, TablePagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import MapIcon from '@mui/icons-material/Map'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PersonIcon from '@mui/icons-material/Person'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useNavigate } from 'react-router-dom'
import { AdminService } from '../api/services'
import ScheduleFormDialog from '../components/ScheduleFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useNotify } from '../hooks/useNotify'

export default function Schedules() {
  const navigate = useNavigate()
  const notify = useNotify()
  
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  
  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await AdminService.listSchedules()
      setRows(data || [])
    } catch (error) {
      console.error('Error:', error)
      notify.error('Không thể tải danh sách lịch trình')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onAdd = () => { setEditing(null); setOpen(true) }
  const onEdit = (row) => { setEditing(row); setOpen(true) }
  const onDelete = (row) => setConfirm({ open: true, row })
  const onViewMap = (row) => navigate(`/admin/schedules/${row._id || row.schedule_id}`)

  const confirmDelete = async () => {
    try {
      if (confirm.row) {
        await AdminService.deleteSchedule(confirm.row._id || confirm.row.schedule_id)
        notify.success('Xóa lịch trình thành công')
        fetchData()
      }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, row: null })
  }

  const onSubmit = async (form) => {
    try {
      if (editing) {
        await AdminService.updateSchedule(editing._id || editing.schedule_id, form)
        notify.success('Cập nhật thành công')
      } else {
        await AdminService.createSchedule(form)
        notify.success('Tạo lịch trình thành công')
      }
      setOpen(false)
      setEditing(null)
      fetchData()
    } catch (error) {
      notify.error(error.response?.data?.msg || 'Có lỗi xảy ra')
    }
  }

  const getDaysLabel = (days) => {
    if (!days || days.length === 0) return '—'
    const dayNames = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    return days.map(d => dayNames[d] || d).join(', ')
  }

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            📅 Quản lý lịch trình
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Quản lý lịch trình và gán học sinh vào các trạm ({rows.length} lịch trình)
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} sx={{ borderRadius: 2 }}>
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)' }
            }}
          >
            Thêm lịch trình
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Paper sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tuyến đường</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Xe buýt</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tài xế</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Loại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày hoạt động</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((schedule, index) => (
                    <TableRow key={schedule._id || schedule.schedule_id || index} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: '#ec4899', width: 40, height: 40 }}>
                            <CalendarMonthIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{schedule.route_name || schedule.routeId?.name || '—'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {(schedule._id || schedule.schedule_id)?.slice(-6)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<DirectionsBusIcon />}
                          label={schedule.bus_plate || schedule.busId?.licensePlate || '—'}
                          size="small"
                          sx={{ bgcolor: '#fef3c7', color: '#92400e' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                          <Typography variant="body2">{schedule.driver_name || schedule.driverId?.name || '—'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={schedule.direction === 'PICK_UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                          label={schedule.direction === 'PICK_UP' ? 'Đón' : 'Trả'}
                          size="small"
                          sx={{
                            bgcolor: schedule.direction === 'PICK_UP' ? '#dcfce7' : '#dbeafe',
                            color: schedule.direction === 'PICK_UP' ? '#166534' : '#1d4ed8'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={getDaysLabel(schedule.daysOfWeek)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Xem bản đồ & Gán học sinh">
                            <IconButton
                              size="small"
                              onClick={() => onViewMap(schedule)}
                              sx={{ 
                                color: '#6366f1', 
                                bgcolor: '#e0e7ff', 
                                '&:hover': { bgcolor: '#c7d2fe' } 
                              }}
                            >
                              <MapIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sửa">
                            <IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => onEdit(schedule)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => onDelete(schedule)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CalendarMonthIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                      <Typography color="text.secondary">Chưa có lịch trình nào</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Số dòng:"
          />
        </Paper>
      )}

      <ScheduleFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm.open}
        title="Xóa lịch trình"
        message="Bạn có chắc muốn xóa lịch trình này?"
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}