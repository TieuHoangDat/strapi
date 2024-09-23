import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRestaurant = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // Chứa ảnh được tải lên
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Lấy file ảnh từ input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('data', JSON.stringify({ name })); // Thêm tên nhà hàng vào formData
    formData.append('files.image', image); // Thêm ảnh vào formData

    try {
      const response = await axios.post('http://localhost:1337/api/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Chỉ định multipart/form-data cho upload file
        },
      });

      if (response.status === 200) {
        setMessage('Nhà hàng đã được thêm thành công!');
      } else {
        setMessage('Có lỗi xảy ra.');
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      setMessage('Có lỗi xảy ra.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Nhà Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên Nhà Hàng:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh Nhà Hàng:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*" // Chỉ cho phép chọn ảnh
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Thêm Nhà Hàng</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default AddRestaurant;
