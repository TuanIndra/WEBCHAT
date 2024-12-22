import axios from 'axios';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: 'http://26.11.109.188:8083', // URL của backend
  timeout: 10000, // Thời gian timeout cho request (10s)
});

// Interceptor để thêm Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi từ backend
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung ở đây (ví dụ: 401 Unauthorized)
    if (error.response?.status === 401) {
      window.location.href = '/login'; // Điều hướng về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
