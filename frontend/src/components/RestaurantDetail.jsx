import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useParams } from 'react-router-dom';
import './RestaurantDetail.css';
import Navbar from './Navbar';

const RestaurantDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const [error, setError] = useState('');
  const [userReview, setUserReview] = useState(null); // Track the user's existing review

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/restaurants/${id}?populate=*`);
        setRestaurant(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/reviews?populate=*&filters[restaurant][id][$eq]=${id}`);
        setReviews(response.data.data);

        // Check if the current user has already reviewed this restaurant
        const existingReview = response.data.data.find(review => review.attributes.users_permissions_user.data.id.toString() === userId);
        if (existingReview) {
          setUserReview(existingReview); // Set the user's existing review
          setNewReview({
            content: existingReview.attributes.content,
            rating: existingReview.attributes.rating,
          });
        }
        
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchRestaurant();
    fetchReviews(); // Fetch reviews when the component mounts
  }, [id, userId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage

      if (userReview) {
        // If the user has already reviewed, update the existing review
        await axios.put(
          `http://localhost:1337/api/reviews/${userReview.id}`,
          {
            data: {
              content: newReview.content,
              rating: parseInt(newReview.rating),
              restaurant: id,
              users_permissions_user: parseInt(userId), 
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        );
        // Gửi mail
        // Có thể thêm phần gửi mail vào lifecycles hook, nhưng đang demo controller customization :)
        await axios.post(
          `http://localhost:1337/api/custom`,
          {
            data: {
              restaurant: id,
              users_permissions_user: parseInt(userId), 
            },
          },
        );
      } else {
        // If no review exists, create a new one
        await axios.post(
          'http://localhost:1337/api/reviews',
          {
            data: {
              content: newReview.content,
              rating: parseInt(newReview.rating),
              restaurant: id,
              users_permissions_user: parseInt(userId), // Thay đổi thành ID người dùng hiện tại
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        );
      }

      const response1 = await axios.get(`http://localhost:1337/api/restaurants/${id}?populate=*`);
      setRestaurant(response1.data.data);

      // Cập nhật danh sách đánh giá
      const response = await axios.get(`http://localhost:1337/api/reviews?populate=*&filters[restaurant][id][$eq]=${id}`);
      setReviews(response.data.data);
      // setNewReview({ content: '', rating: '' }); // Reset form
      setError(''); // Clear error message
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      setError('Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (!restaurant) {
    return <p>Nhà hàng không tồn tại.</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h1 className="my-4">{restaurant.attributes.name}</h1>
            {restaurant.attributes.image?.data?.[0]?.attributes?.url && (
              <img
                src={`http://localhost:1337${restaurant.attributes.image.data[0].attributes.url}`}
                className="large-img mb-4"
                alt={restaurant.attributes.name}
              />
            )}
            <p><strong>Địa chỉ:</strong> {restaurant.attributes.address}</p>
            <p><strong>Mô tả:</strong> {restaurant.attributes.description[0]?.children[0]?.text}</p>
            <p><strong>Giá trung bình:</strong> {restaurant.attributes.avgPrice} USD</p>
            <p><strong>Đánh giá:</strong> {restaurant.attributes.rating}/5</p>
            <p><strong>Giờ mở cửa:</strong> {restaurant.attributes.openningHours.hours} ({restaurant.attributes.openningHours.days})</p>
          </div>
          <div className="col-md-6">
            <h2 className="my-4">Các bình luận</h2>
            {reviews.length === 0 ? (
              <p>Chưa có bình luận nào.</p>
            ) : (
              <ul className="list-unstyled">
                {reviews.map((review) => (
                  <li key={review.id} className="mb-3">
                    <div className="card p-3">
                      <p><strong>Nội dung:</strong> {review.attributes.content}</p>
                      <p><strong>Đánh giá:</strong> {review.attributes.rating}</p>
                      <p><strong>Người dùng:</strong> {review.attributes.users_permissions_user.data.attributes.username}</p>
                      <p><small><strong>Ngày tạo:</strong> {new Date(review.attributes.createdAt).toLocaleDateString()}</small></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="my-4">{userReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label">Nội dung:</label>
                <textarea
                  name="content"
                  className="form-control"
                  value={newReview.content}
                  onChange={handleReviewChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đánh giá:</label>
                <select
                  name="rating"
                  className="form-select"
                  value={newReview.rating}
                  onChange={handleReviewChange}
                  required
                >
                  <option value="">Chọn đánh giá</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary">{userReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
