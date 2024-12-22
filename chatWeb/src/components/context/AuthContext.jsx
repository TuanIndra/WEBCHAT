import React, { createContext, useState } from 'react';

// Tạo AuthContext
export const AuthContext = createContext();

// AuthProvider để bọc ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userId', userData.id); // Lưu thông tin user vào localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Xóa ID người dùng
    window.location.href = "/login"; // Chuyển hướng về trang login
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
