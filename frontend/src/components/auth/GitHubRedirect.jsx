import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GitHubRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Trao đổi access_token từ GitHub để nhận JWT của Strapi
      axios
        .get(`http://localhost:1337/api/auth/github/callback?access_token=${accessToken}`)
        .then((response) => {
          // Lưu JWT vào localStorage hoặc context
          const { jwt, user } = response.data;
          localStorage.setItem('token', jwt);
          localStorage.setItem('username', user.username); // Lưu tên người dùng
          localStorage.setItem('userId', user.id);
          // Chuyển hướng người dùng đến trang chủ hoặc trang khác
          navigate('/restaurants');
        })
        .catch((error) => {
          console.error('Lỗi trong quá trình xác thực GitHub', error);
        });
    }
  }, [location]);

  return <div>Đang xác thực...</div>;
};

export default GitHubRedirect;
