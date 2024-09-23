// src/components/AboutUs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Import Navbar
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutUs = () => {
  const [content, setContent] = useState([]);
  const [locale, setLocale] = useState('en'); // Ngôn ngữ mặc định là tiếng Anh
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/about-us?locale=all');
        const data = response.data.data;

        // Lọc nội dung theo ngôn ngữ
        const filteredContent = data.find((item) => item.attributes.locale === locale);
        if (filteredContent) {
          setContent(filteredContent.attributes.content);
        }

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, [locale]); // Khi locale thay đổi, sẽ fetch lại dữ liệu

  const handleLanguageChange = (language) => {
    setLocale(language); // Thay đổi ngôn ngữ
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-end my-3">
          <button
            className={`btn btn-${locale === 'en' ? 'primary' : 'outline-primary'} mx-1`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            className={`btn btn-${locale === 'vi' ? 'primary' : 'outline-primary'} mx-1`}
            onClick={() => handleLanguageChange('vi')}
          >
            Tiếng Việt
          </button>
        </div>

        <div>
          {content.map((paragraph, index) => (
            <p key={index}>
              {paragraph.children.map((child, i) => (
                <span key={i} className="font-weight-bold">
                {/* <span key={i} className={child.bold ? 'font-weight-bold' : ''}> */}
                  {child.text}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
