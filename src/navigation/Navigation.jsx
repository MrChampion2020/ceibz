// Navigation.jsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  
  BootCamp,
  Admin,
} from "../screens/index";

const Navigation = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<BootCamp />} />
      
      <Route path="Admins" element={<Admin />} />


    </Routes>
  );
};

export default Navigation;
