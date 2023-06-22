import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { useSelector } from "react-redux";
const App = () => {
  const token = useSelector((state) => state.user.token);
  console.log(token);
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={token ? <AdminLayout /> : <Navigate to="/auth/sign-in" replace />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
