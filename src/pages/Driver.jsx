import React, { useEffect, useMemo, useState } from 'react'
import { Paper, Chip, Typography, IconButton, Stack, Box, Avatar, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { AdminService } from '../api/services'
import { useOutletContext } from 'react-router-dom'
import DriverFormDialog from '../components/DriverFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { DataGrid } from '@mui/x-data-grid'
import { useNotify } from '../hooks/useNotify'
import avatarDriver from '../assets/driver.png'

export default function Drivers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const { q } = useOutletContext()
  const notify = useNotify()

  useEffect(() => {
    setLoading(true)
    AdminService.listDrivers(q).then(setRows). finally(() => setLoading(false))
  }, [q])

  const refresh = () => { 
    setLoading(true)
    return AdminService.listDrivers(q).then(setRows).finally(() => setLoading(false)) 
  }
  const onAdd = () => { setEditing(null); setOpen(true) }
  const onEdit = (row) => { setEditing(row); setOpen(true) }
  const onDelete = (row) => { setConfirm({ open: true, row }) }

  const confirmDelete = async () => {
    try {
      if (confirm.row) await AdminService.deleteDriver(confirm.row. user_id)
      notify. success('Xóa thành công')
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, row: null })
    refresh()
  }

  const onSubmit = async (form) => {
    try {
      if (editing) { 
        await AdminService.updateDriver(editing.user_id, form)
        notify.success('Cập nhật thành công') 
      } else { 
        await AdminService.createDriver(form)
        notify.success('Tạo thành công') 
      }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setOpen(false)
    setEditing(null)
    refresh()
  }

  const columns = useMemo(() => [
    { field: 'user_id', headerName: 'ID', width: 70 },
    { 
      field: 'name', 
      headerName: 'Họ tên', 
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar 
            src={avatarDriver}
            sx={{ width: 36, height: 36 }}
          />
          <Typography fontWeight={500}>{params. value}</Typography>
        </Stack>
      )
    },
    { field: 'phone_number', headerName: 'Số điện thoại', width: 140 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'license_number', headerName: 'Số bằng lái', width: 130 },
    {
      field: 'is_active', 
      headerName: 'Trạng thái', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          size="small" 
          label={params. value ? 'Hoạt động' : 'Nghỉ'} 
          color={params.value ?  'success' : 'default'}
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: 'actions', 
      headerName: 'Hành động', 
      width: 150, 
      sortable: false, 
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Thêm tài xế">
            <IconButton 
              size="small" 
              sx={{ color: '#22c55e', '&:hover': { bgcolor: '#dcfce7' } }} 
              onClick={onAdd}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa">
            <IconButton 
              size="small" 
              sx={{ color: '#f59e0b', '&:hover': { bgcolor: '#fef3c7' } }} 
              onClick={() => onEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton 
              size="small" 
              sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }} 
              onClick={() => onDelete(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    },
  ], [])

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Danh sách tài xế
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Quản lý thông tin tài xế trong hệ thống
          </Typography>
        </Box>
        <Avatar src={avatarDriver} sx={{ width: 48, height: 48 }} />
      </Stack>
      
      <Paper 
        elevation={0} 
        sx={{ 
          height: 520, 
          width: '100%', 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.user_id}
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: '#f1f5f9'
            },
            '& . MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9'
            }
          }}
        />
      </Paper>
      
      <DriverFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm. open}
        title="Xóa tài xế"
        message={`Bạn có chắc muốn xóa tài xế "${confirm.row?.name}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}