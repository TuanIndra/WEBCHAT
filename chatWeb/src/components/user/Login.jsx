import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi'; // Sử dụng Login API function
import logo from "../../assets/logo.jpg";

const Login = () => {
  const [username, setUsername] = useState(''); // Chỉ cần username
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Xử lý đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password); // Gọi API đăng nhập
      localStorage.setItem("userId", response.data.userId); // Lưu userId vào localStorage
      navigate("/Chat"); // Điều hướng đến trang chat
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-16 h-16 rounded-full border-2 border-black" />
        <span className="text-3xl font-bold text-primary ml-3">ᴄᴀᴘʏᴊᴏʏ</span>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Đăng Nhập</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Đăng ký */}
        <p className="mt-6 text-center text-gray-700 dark:text-gray-300">
          Bạn chưa có tài khoản?
          <a href="/register" className="text-primary hover:underline ml-2">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
