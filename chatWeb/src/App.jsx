import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Chat from './components/chat/Chat';
import Profile from "./components/user/Profile";
import { AuthProvider } from './components/context/AuthContext';

const App = () => {
  const userId = localStorage.getItem("userId");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={userId ? <Chat userId={userId} /> : <Navigate to="/login" />}
          />
          <Route path="/profile" element={<Profile />} />
          {/* Route 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
