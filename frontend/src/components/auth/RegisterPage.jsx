import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const registerResponse = await axios.post('http://localhost:1337/api/auth/local/register', userData);

      if (registerResponse.data) {
        setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');

        // // Gọi API gửi email xác nhận
        // const emailData = { email: email };
        // await axios.post('http://localhost:1337/api/auth/send-email-confirmation', emailData);

        setSuccess('Đăng ký thành công! Email xác nhận đã được gửi.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng ký hoặc gửi email xác nhận.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card w-50 shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label>Tên người dùng:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Mật khẩu:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
