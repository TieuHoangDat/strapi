// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true); // Người dùng đã đăng nhập
    } else {
      setIsLoggedIn(false); // Người dùng chưa đăng nhập
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin người dùng và token khỏi localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập

    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  const handleLogin = () => {
    // Chuyển hướng đến trang đăng nhập
    navigate('/login');
  };

  const handleHome = () => {
    // Chuyển hướng đến trang chủ
    navigate('/restaurants');
  };

  const handleAboutUs = () => {
    navigate('/about-us');
  };

  const handleChangePass = () => {
    navigate('/change-password');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <div className="container-fluid">
        {/* Logo hoặc tên trang */}
        <a className="navbar-brand" onClick={handleHome} style={{ cursor: 'pointer' }}>
          Trang Chủ
        </a>

        <a className="navbar-brand" onClick={handleAboutUs} style={{ cursor: 'pointer' }}>
          About Us
        </a>

        {/* Toggle button cho mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links và phần đăng nhập */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text text-light me-3">
                    Xin chào, <strong>{username}</strong>!
                  </span>
                </li>
                <li className="nav-item">
                  <a className="navbar-brand" onClick={handleChangePass} style={{ cursor: 'pointer' }}>
                    Change Password
                  </a>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogin}>
                  Đăng nhập
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
