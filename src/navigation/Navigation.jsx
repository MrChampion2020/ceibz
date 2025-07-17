// Navigation.jsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  LiveStream,
} from "../screens/index";
import AdminPanel from "../admin/AdminPanel";
import AdminLogin from "../admin/AdminLogin";
import Events from '../screens/home/Events';

const Navigation = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLoginSuccess = (loginData) => {
    // Redirect to admin panel after successful login
    window.location.href = '/admin';
  };

  return (
    <Routes>
      <Route path="/" element={<LiveStream />} />
      <Route path="/events" element={<Events />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
};

export default Navigation;
