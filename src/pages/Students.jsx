import React, { useEffect, useMemo, useState } from 'react'
import { Paper, Typography, IconButton, Stack, Box, Avatar, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { AdminService } from '../api/services'
import { useOutletContext } from 'react-router-dom'
import StudentFormDialog from '../components/StudentFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { DataGrid } from '@mui/x-data-grid'
import { useNotify } from '../hooks/useNotify'
import avatarTrai from '../assets/avatar_trai.png'
import avatarGai from '../assets/avatar_gai.png'

export default function Students() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const { q } = useOutletContext()
  const notify = useNotify()

  useEffect(() => {
    setLoading(true)
    AdminService. listStudents(q).then(setRows). finally(() => setLoading(false))
  }, [q])

  const refresh = () => { 
    setLoading(true)
    return AdminService.listStudents(q). then(setRows). finally(() => setLoading(false)) 
  }
  const onAdd = () => { setEditing(null); setOpen(true) }
  const onEdit = (row) => { setEditing(row); setOpen(true) }
  const onDelete = (row) => { setConfirm({ open: true, row }) }

  const confirmDelete = async () => {
    try {
      if (confirm.row) await AdminService.deleteStudent(confirm.row. student_id)
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
        await AdminService.updateStudent(editing.student_id, form)
        notify.success('Cập nhật thành công') 
      } else { 
        await AdminService.createStudent(form)
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
    { field: 'student_id', headerName: 'ID', width: 70 },
    { 
      field: 'name', 
      headerName: 'Họ tên', 
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar 
            src={params.row.gender === 'FEMALE' ? avatarGai : avatarTrai}
            sx={{ width: 36, height: 36 }}
          />
          <Typography fontWeight={500}>{params.value}</Typography>
        </Stack>
      )
    },
    { field: 'class', headerName: 'Lớp', width: 100 },
    { 
      field: 'gender', 
      headerName: 'Giới tính', 
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar 
            src={params.value === 'FEMALE' ? avatarGai : avatarTrai}
            sx={{ width: 24, height: 24 }}
          />
          <span>{params.value === 'FEMALE' ? 'Nữ' : 'Nam'}</span>
        </Stack>
      )
    },
    { field: 'date_of_birth', headerName: 'Ngày sinh', width: 130 },
    {
      field: 'actions', 
      headerName: 'Hành động', 
      width: 150, 
      sortable: false, 
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Thêm học sinh">
            <IconButton 
              size="small" 
              sx={{ 
                color: '#22c55e',
                '&:hover': { bgcolor: '#dcfce7' }
              }} 
              onClick={onAdd}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa">
            <IconButton 
              size="small" 
              sx={{ 
                color: '#f59e0b',
                '&:hover': { bgcolor: '#fef3c7' }
              }} 
              onClick={() => onEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton 
              size="small" 
              sx={{ 
                color: '#ef4444',
                '&:hover': { bgcolor: '#fee2e2' }
              }} 
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
            Danh sách học sinh
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Quản lý thông tin học sinh trong hệ thống
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={avatarTrai} sx={{ width: 32, height: 32 }} />
          <Avatar src={avatarGai} sx={{ width: 32, height: 32 }} />
        </Stack>
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
          getRowId={(r) => r.student_id}
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
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9'
            }
          }}
        />
      </Paper>
      
      <StudentFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm. open}
        title="Xóa học sinh"
        message={`Bạn có chắc muốn xóa học sinh "${confirm.row?.name}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}