import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi'; // Import API đăng ký

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // Quản lý lỗi
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset lỗi trước khi gửi request

    try {
      // Gửi request với formData
      await register(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password
      );

      // Hiển thị thông báo và điều hướng
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error.response?.data || error.message);
      setErrorMessage('Đăng ký thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="flex items-center mb-8">
        <img src="src/assets/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full border-2 border-black" />
        <span className="text-3xl font-bold text-primary ml-3">Register</span>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Đăng Ký</h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300">
              Tên đầy đủ
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đầy đủ"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
