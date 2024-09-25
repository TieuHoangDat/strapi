import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link từ react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });

      // Lưu JWT và thông tin người dùng vào localStorage
      const { jwt, user } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('username', user.username); // Lưu tên người dùng
      localStorage.setItem('userId', user.id); // Lưu tên người dùng

      // Kiểm tra thông tin đã lưu trong localStorage
      console.log('JWT:', localStorage.getItem('token'));
      console.log('Username:', localStorage.getItem('username'));

      // Chuyển hướng tới trang danh sách nhà hàng
      navigate('/restaurants');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error); // Log lỗi để kiểm tra
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  const handleLoginGithub = () => {
    window.location.href = 'http://localhost:1337/api/connect/github';
  };

  const handleLoginGoogle = () => {
    window.location.href = 'http://localhost:1337/api/connect/google';
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center">Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên đăng nhập:</label>
                <input
                  type="text"
                  className="form-control"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật khẩu:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
            </form>
            <button type="submit" className="btn btn-primary w-100 mt-3" onClick={handleLoginGithub}>
              Đăng nhập với GitHub
            </button>
            <button type="submit" className="btn btn-primary w-100 mt-3" onClick={handleLoginGoogle}>
              Đăng nhập với Google
            </button>
            <div className="text-center mt-3">
              {/* Thêm đường dẫn đến trang quên mật khẩu */}
              <Link to="/forget-password">Quên mật khẩu?</Link>
            </div>
            <div className="text-center mt-3">
              {/* Thêm đường dẫn đến trang quên mật khẩu */}
              <Link to="/register">Đăng kí tài khoản</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
