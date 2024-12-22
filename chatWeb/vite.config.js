import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép lắng nghe trên tất cả các địa chỉ IP
    port: 5173, // (Không bắt buộc) Nếu muốn đổi cổng
  },
})
