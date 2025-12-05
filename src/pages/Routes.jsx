import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, Collapse } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import RouteIcon from '@mui/icons-material/AltRoute'
import { AdminService } from '../api/services'
import RouteFormDialog from '../components/RouteFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useNotify } from '../hooks/useNotify'

export default function RoutesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const [expandedId, setExpandedId] = useState(null)
  const notify = useNotify()

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await AdminService.listRoutes()
      setRows(data)
    } catch (error) {
      console.error('Error fetching routes:', error)
      notify.error('Không thể tải danh sách tuyến đường')
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

  const confirmDelete = async () => {
    try {
      if (confirm.row) {
        await AdminService.deleteRoute(confirm.row._id || confirm.row.route_id)
        notify.success('Xóa thành công')
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
        await AdminService.updateRoute(editing._id || editing.route_id, form)
        notify.success('Cập nhật thành công') 
      } else { 
        await AdminService.createRoute(form)
        notify.success('Tạo thành công') 
      }
      setOpen(false)
      setEditing(null)
      fetchData()
    } catch (error) {
      notify.error(error.response?.data?.msg || 'Có lỗi xảy ra')
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Tuyến đường
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Quản lý các tuyến đưa đón học sinh ({rows.length} tuyến)
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
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}
          >
            Thêm tuyến
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Tên tuyến</TableCell>
              <TableCell>Điểm đầu</TableCell>
              <TableCell>Điểm cuối</TableCell>
              <TableCell>Số trạm</TableCell>
              <TableCell>Khoảng cách</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((route) => (
              <React.Fragment key={route._id || route.route_id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => setExpandedId(expandedId === route._id ? null : route._id)}
                    >
                      {expandedId === route._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouteIcon sx={{ color: '#06b6d4' }} />
                      <Typography fontWeight={600}>{route.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{route.start || '—'}</TableCell>
                  <TableCell>{route.end || '—'}</TableCell>
                  <TableCell>
                    <Chip size="small" label={`${route.stops?.length || 0} trạm`} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{route.distance || '—'}</TableCell>
                  <TableCell>{route.duration || '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Sửa">
                        <IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => onEdit(route)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => onDelete(route)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 0, border: 0 }}>
                    <Collapse in={expandedId === route._id} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, my: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          📍 Các trạm dừng:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {route.stops?.map((stop, idx) => (
                            <Chip 
                              key={stop._id || stop.stop_id || idx} 
                              label={`${idx + 1}. ${stop.name}`} 
                              size="small" 
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          ))}
                          {(!route.stops || route.stops.length === 0) && (
                            <Typography variant="body2" color="text.secondary">Chưa có trạm nào</Typography>
                          )}
                        </Stack>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {rows.length === 0 && ! loading && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có tuyến đường nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RouteFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm.open}
        title="Xóa tuyến đường"
        message={`Bạn có chắc muốn xóa tuyến "${confirm.row?.name}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}