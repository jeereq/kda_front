import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdLink, MdDelete } from 'react-icons/md';
import {
  FaFacebook,
  FaInstagramSquare,
  FaTwitterSquare,
  FaYoutube,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { client, urlFor } from '../client';
import Spinner from './Spinner';

const CreatePin = ({ user, setUser }) => {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [facebook, setFacebook] = useState(user.facebook);
  const [twitter, setTwitter] = useState(user.twitter);
  const [instagram, setInstagram] = useState(user.instagram);
  const [youtube, setYoutube] = useState(user.youtube);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [fields, setFields] = useState();
  const [imageAsset, setImageAsset] = useState(user.image);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem('user')),
  );

  const navigate = useNavigate();

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
          setImageAsset(document.url);
          setUser((dataUser) => ({ ...dataUser, image: document.url }));
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

  const saveUpdate = () => {
    if (userName && email && (imageAsset?._id || imageAsset)) {
      setLoadingUser(true);
      const doc = {
        _type: 'user',
        ...user,
        userName,
        email,
        image: imageAsset,
        facebook,
        twitter,
        instagram,
        youtube,
      };

      client.createOrReplace(doc).then((res) => {
        setLoadingUser(false);
        console.log(res);
        if (user?._id === currentUser._id) {
          localStorage.setItem('user', JSON.stringify(res));
        }
        navigate('/');
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
          Please add all fields.
        </p>
      )}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
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
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
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
              <div className="relative h-full">
                <img
                  src={urlFor(imageAsset)}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                {user?._id === currentUser._id && (
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={userName}
            disabled={user?._id !== currentUser._id}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nom"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />

          <input
            type="email"
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex justify-between p-1">
            <div className="flex items-center border-b-2 border-gray-200 w-2/4">
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <FaFacebook />
                <MdLink />
              </a>
              <input
                type="text"
                value={facebook}
                disabled={user?._id !== currentUser._id}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Facebook"
                className="outline-none text-base sm:text-lg border-b-0 border-gray-200 p-2"
              />
            </div>
            <div className="flex items-center border-b-2 border-gray-200 w-2/4">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <FaInstagramSquare />
                <MdLink />
              </a>
              <input
                type="text"
                value={instagram}
                disabled={user?._id !== currentUser._id}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram"
                className="outline-none text-base sm:text-lg border-b-0 border-gray-200 p-2"
              />
            </div>
          </div>
          <div className="flex justify-between p-1">
            <div className="flex items-center border-b-2 border-gray-200 w-2/4">
              <a
                href={twitter}
                target="_blank"
                rel="noreferrer"
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <FaTwitterSquare />
                <MdLink />
              </a>
              <input
                type="text"
                value={twitter}
                disabled={user?._id !== currentUser._id}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter"
                className="outline-none text-base sm:text-lg border-b-0 border-gray-200 p-2"
              />
            </div>
            <div className="flex items-center border-b-2 border-gray-200 w-2/4">
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <FaYoutube />
                <MdLink />
              </a>
              <input
                type="text"
                disabled={user?._id !== currentUser._id}
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Youtube"
                className="outline-none text-base sm:text-lg border-b-0 border-gray-200 p-2"
              />
            </div>
          </div>
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={urlFor(user.image)}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          {user?._id === currentUser._id && (
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={saveUpdate}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                {loadingUser ? '...Modifier' : 'Modifier'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
