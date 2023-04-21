/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useNavigate } from 'react-router-dom';

import { FaUser } from 'react-icons/fa';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { client } from '../client';

const Login = () => {
  const [login, setLogin] = useState({
    name: 'jeereq',
    email: 'minganda@itm.com',
  });

  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { name, email } = login;
    const doc = { _id: uuidv4(), _type: 'user', userName: name, email };
    const response = client.createIfNotExists(doc).then((data) => data);
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full ">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
export default Login;
