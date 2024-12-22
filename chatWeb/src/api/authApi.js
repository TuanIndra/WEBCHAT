import axiosInstance from '../utils/axiosConfig';

// Hàm đăng nhập
export const login = (username, password) => {
  return axiosInstance.post('/api/auth/login', { username, password });
};

// Hàm đăng ký
export const register = (fullName, username, email, password ) => {
  return axiosInstance.post('/api/auth/register', {
    fullName,
    username,
    email,
    password,
  });
};

// Gửi yêu cầu quên mật khẩu
export const forgotPassword = (email) => {
  return axiosInstance.post('/api/auth/forgot-password', null, {
    params: { email },
  });
};

// Đặt lại mật khẩu
export const resetPassword = (token, newPassword) => {
  return axiosInstance.post('/api/auth/reset-password', null, {
    params: { token, newPassword },
  });
};

// Cập nhật thông tin người dùng
export const updateUserInfo = (fullName, bio) => {
  return axiosInstance.put('/api/auth/update-info', { fullName, bio });
};

// Cập nhật ảnh đại diện
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.put('/api/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Thay đổi mật khẩu
export const changePassword = (currentPassword, newPassword) => {
  return axiosInstance.put('/api/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

// Lấy thông tin người dùng
export const fetchUserInfo = () => {
  return axiosInstance.get('/api/auth/user-info');
};
  