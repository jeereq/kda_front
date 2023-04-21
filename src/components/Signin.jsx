/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useNavigate } from 'react-router-dom';

import { FaUser } from 'react-icons/fa';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import shareVideo from '../assets/share.mp4';
import Spinner from './Spinner';
import logo from '../assets/logowhite.png';

import { client } from '../client';

const Signin = () => {
  const [login, setLogin] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { name, email } = login;
    const doc = {
      _id: uuidv4(),
      _type: 'user',
      userName: name,
      email,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset?._id,
        },
      },
    };
  };

  const uploadImage = (e) => {
    const [selectedFile] = e.target.files;
    // uploading asset to sanity
    if (
      selectedFile.type === 'image/png'
      || selectedFile.type === 'image/svg'
      || selectedFile.type === 'image/jpeg'
      || selectedFile.type === 'image/gif'
      || selectedFile.type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-full">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay ">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <form className="shadow-2x1" onSubmit={onClick}>
            <input
              type="text"
              required
              placeholder="Name"
              className="mb-3 p-2 rounded-lg w-full cursor-pointer outline-none"
              value={login.name}
              onChange={(e) => setLogin({ ...login, name: e.target.value })}
            />
            <input
              type="email"
              required
              placeholder="Email"
              className="mb-3 p-2 rounded-lg w-full cursor-pointer outline-none"
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              value={login.email}
            />
            <input
              type="password"
              required
              placeholder="Mot de passe "
              className="mb-3 p-2 rounded-lg w-2/4 cursor-pointer outline-none"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              value={login.password}
            />
            <input
              type="password"
              required
              placeholder="confirmer mot de passe"
              className="mb-3 p-2 rounded-lg w-2/4 cursor-pointer outline-none"
              onChange={(e) => setLogin({ ...login, newPassword: e.target.value })}
              value={login.newPassword}
            />
            <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
              <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-300">
                {loading && <Spinner />}
                {wrongImageType && <p>It&apos;s wrong file type.</p>}
                {!imageAsset ? (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-2xl">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-lg">Click pour charger l'image</p>
                      </div>

                      <p className="mt-32 text-gray-400">
                        Recommendation: Use high-quality JPG, JPEG, SVG, PNG,
                        GIF or TIFF less than 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                ) : (
                  <div className="relative h-300">
                    <img
                      src={imageAsset?.url}
                      alt="uploaded-pic"
                      className="h-300 w-300"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setImageAsset(null)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 w-full flex justify-center items-center mt-2 p-3 rounded-lg cursor-pointer outline-none text-white"
            >
              <FaUser className="mr-4" /> Sign in
            </button>
            <div
              onClick={() => navigate('/login')}
              className="text-center text-white p-4 w-full cursor-pointer"
            >
              Login
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signin;
