import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './RestaurantsList.css'; // Import custom CSS file
import Navbar from './Navbar'; // Import Navbar component
import { useNavigate } from 'react-router-dom';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]); // State cho danh sách categories
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(''); // State cho category được chọn
  const [searchTerm, setSearchTerm] = useState(''); // State cho giá trị tìm kiếm tên nhà hàng
  const navigate = useNavigate();

  // Fetch danh sách nhà hàng và categories khi component mount
  useEffect(() => {
    const fetchRestaurantsAndCategories = async () => {
      try {
        // Gọi API lấy danh sách nhà hàng
        const restaurantsResponse = await axios.get('http://localhost:1337/api/restaurants?populate=*');
        setRestaurants(restaurantsResponse.data.data);

        // Gọi API lấy danh sách categories
        const categoriesResponse = await axios.get('http://localhost:1337/api/categories');
        setCategories(categoriesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    fetchRestaurantsAndCategories();
  }, []);

  const handleRestaurantClick = (id) => {
    navigate(`/restaurants/${id}`); // Chuyển hướng đến trang chi tiết nhà hàng
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Cập nhật category được chọn
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm theo tên nhà hàng
  };

  // Lọc nhà hàng theo category và tên
  const filteredRestaurants = restaurants
    .filter((restaurant) => 
      selectedCategory 
        ? restaurant.attributes.categories.data.some(
            (category) => category.attributes.name === selectedCategory
          ) 
        : true
    )
    .filter((restaurant) => 
      searchTerm
        ? restaurant.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div>
      <Navbar /> {/* Sử dụng component Navbar */}
      <div className="container">
        <h1 className="my-4">Danh sách nhà hàng</h1>

        {/* Tìm kiếm theo tên và loại món ăn */}
        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Tìm kiếm theo tên nhà hàng"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select className="form-control" onChange={handleCategoryChange}>
            <option value="">Tất cả loại món ăn</option>
            {categories.map((category) => (
              <option key={category.id} value={category.attributes.name}>
                {category.attributes.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hiển thị danh sách nhà hàng đã lọc */}
        <div className="row">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div className="col-md-4 mb-4" key={restaurant.id}>
                <div className="card" onClick={() => handleRestaurantClick(restaurant.id)}>
                  {restaurant.attributes.image?.data?.[0]?.attributes?.url && (
                    <img
                      src={`http://localhost:1337${restaurant.attributes.image.data[0].attributes.url}`}
                      className="card-img-top img-fit"
                      alt={restaurant.attributes.name}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.attributes.name}</h5>
                    <p className="card-text"><strong>Địa chỉ:</strong> {restaurant.attributes.address}</p>
                    <p className="card-text"><strong>Mô tả:</strong> {restaurant.attributes.description[0]?.children[0]?.text}</p>
                    <p className="card-text"><strong>Đánh giá:</strong> {restaurant.attributes.rating}/5</p>
                    <p className="card-text"><strong>Loại món ăn:</strong> {restaurant.attributes.categories.data.map(category => category.attributes.name).join(', ')}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy nhà hàng nào cho loại món ăn đã chọn hoặc theo từ khóa tìm kiếm.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsList;
