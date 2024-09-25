// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantsList from './components/RestaurantsList';
import RestaurantDetail from './components/RestaurantDetail';
import AboutUs from './components/AboutUs';
import Login from './components/auth/Login';
import RegisterPage from './components/auth/RegisterPage';
import ChangePassword from './components/auth/ChangePassword';
import ResetPassword from './components/auth/ResetPassword';
import ForgetPassword from './components/auth/ForgetPassword';
import GitHubRedirect from './components/auth/GitHubRedirect';
import GoogleRedirect from './components/auth/GoogleRedirect';
import AddRestaurant from './components/AddRestaurant';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/add" element={<AddRestaurant />} />
        <Route path="/connect/github/redirect" element={<GitHubRedirect />} />
        <Route path="/api/auth/google/callback" element={<GoogleRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;
