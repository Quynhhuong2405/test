import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogActions, Button, TextField, Stack, FormControlLabel, Switch, Box, Typography, Avatar } from "@mui/material"
import avatarDriver from '../assets/driver.png'

export default function DriverFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone_number: '', email: '', license_number: '', is_active: true })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ name: '', phone_number: '', email: '', license_number: '', is_active: true })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
      {/* Header với avatar tài xế */}
      <Box sx={{ bgcolor: '#6366f1', pt: 3, pb: 2, px: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            src={avatarDriver}
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
          {initialValue ? '✏️ Sửa thông tin tài xế' : '🚗 Thêm tài xế mới'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Vui lòng điền đầy đủ thông tin bên dưới
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField 
            label="Họ tên tài xế" 
            name="name" 
            value={form. name} 
            onChange={handleChange} 
            fullWidth 
            placeholder="Nhập họ và tên"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <Stack direction="row" spacing={2}>
            <TextField 
              label="Số điện thoại" 
              name="phone_number" 
              value={form.phone_number} 
              onChange={handleChange} 
              fullWidth 
              placeholder="0901234567"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <TextField 
              label="Email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              fullWidth 
              placeholder="email@example.com"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Stack>
          <TextField 
            label="Số bằng lái" 
            name="license_number" 
            value={form.license_number} 
            onChange={handleChange} 
            fullWidth 
            placeholder="Nhập số bằng lái xe"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <FormControlLabel
            control={
              <Switch 
                checked={form.is_active} 
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase. Mui-checked': { color: '#6366f1' },
                  '& .MuiSwitch-switchBase. Mui-checked + .MuiSwitch-track': { bgcolor: '#6366f1' }
                }}
              />
            }
            label="Đang hoạt động"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2, px: 3 }}>Hủy</Button>
        <Button 
          variant="contained" 
          onClick={() => onSubmit(form)}
          sx={{ borderRadius: 2, px: 3, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
        >
          {initialValue ? 'Cập nhật' : 'Thêm tài xế'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}