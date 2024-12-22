import axiosInstance from '../utils/axiosConfig';

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    return [];
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};