import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, Box, Typography, Avatar } from "@mui/material"
import avatarTrai from '../assets/avatar_trai.png'
import avatarGai from '../assets/avatar_gai.png'

const genders = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
]

export default function StudentFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', class: '', gender: '', date_of_birth: '' })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ name: '', class: '', gender: '', date_of_birth: '' })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Chọn avatar theo giới tính
  const getAvatar = () => {
    if (form.gender === 'MALE') return avatarTrai
    if (form.gender === 'FEMALE') return avatarGai
    return avatarTrai // mặc định
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
      {/* Header với avatar thay đổi theo giới tính */}
      <Box sx={{ bgcolor: '#6366f1', pt: 3, pb: 2, px: 3, textAlign: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 2 
          }}
        >
          <Avatar
            src={getAvatar()}
            sx={{ 
              width: 90, 
              height: 90, 
              border: '4px solid white',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              bgcolor: 'white'
            }}
          />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
          {initialValue ? '✏️ Sửa thông tin học sinh' : '🎒 Thêm học sinh mới'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Vui lòng điền đầy đủ thông tin bên dưới
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField 
            label="Họ tên học sinh" 
            name="name" 
            value={form. name} 
            onChange={handleChange} 
            fullWidth 
            placeholder="Nhập họ và tên"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          <Stack direction="row" spacing={2}>
            <TextField 
              label="Lớp" 
              name="class" 
              value={form.class} 
              onChange={handleChange} 
              fullWidth 
              placeholder="VD: 1A, 2B..."
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <TextField 
              select 
              label="Giới tính" 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              fullWidth
              InputProps={{ sx: { borderRadius: 2 } }}
            >
              {genders.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar 
                      src={g.value === 'MALE' ?  avatarTrai : avatarGai} 
                      sx={{ width: 24, height: 24 }} 
                    />
                    <span>{g.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField 
            label="Ngày sinh" 
            name="date_of_birth" 
            type="date" 
            value={form. date_of_birth} 
            onChange={handleChange} 
            fullWidth 
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ borderRadius: 2, px: 3 }}
        >
          Hủy
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onSubmit(form)}
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            bgcolor: '#6366f1',
            '&:hover': { bgcolor: '#4f46e5' }
          }}
        >
          {initialValue ? 'Cập nhật' : 'Thêm học sinh'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}