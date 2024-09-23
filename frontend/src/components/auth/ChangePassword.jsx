import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Lấy JWT từ localStorage

      const response = await axios.post(
        'http://localhost:1337/api/auth/change-password',
        {
          currentPassword,
          password,
          passwordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi JWT trong header
          },
        }
      );

      setSuccessMessage('Mật khẩu đã được thay đổi thành công.');
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setErrorMessage('');
      navigate('/restaurants');
    } catch (error) {
      console.error('Thay đổi mật khẩu thất bại:', error); // Log lỗi để kiểm tra
      setErrorMessage('Đã xảy ra lỗi khi thay đổi mật khẩu.');
    }

    
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center">Thay đổi mật khẩu</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}
              <button type="submit" className="btn btn-primary w-100">Thay đổi mật khẩu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
