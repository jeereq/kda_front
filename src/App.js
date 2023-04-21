/* eslint-disable eqeqeq */
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Login, Signin, Image } from './components';
import Home from './container/Home';

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      const User = localStorage.getItem('user') !== 'undefined'
        ? JSON.parse(localStorage.getItem('user'))
        : localStorage.clear();
      console.log(User);
      if (!User) { navigate('/login'); }
    } catch (error) {
      console.log(error);
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/image" element={<Image />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
