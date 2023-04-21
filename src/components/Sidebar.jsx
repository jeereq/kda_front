import React, { useState } from 'react';
import {
  NavLink,
  Link,
  useNavigate,
} from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { categories, domaines } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ closeToggle, user }) => {
  const [category, setCategory] = useState(null);
  const [domaine, setDomaine] = useState(null);
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Acceuil
          </NavLink>
          <h3 className="mt-1 px-5 text-base 2xl:text-xl">Domaines</h3>
          <div className="flex items-center ">
            <select
              onChange={(e) => {
                navigate(`/domain/${e.target.value}`);
                setDomaine(
                  domaines.find(({ name }) => name === e.target.value),
                );
                setCategory(null);
              }}
              className="outline-none w-4/5 text-base border-2 border-gray-200 py-3 pl-2 ml-5 rounded-md cursor-pointer"
            >
              <option value="others" className="sm:text-bg bg-white">
                Choisis
              </option>
              {domaines.map((item) => (
                <option
                  key={item.name}
                  className="text-base border-0 outline-none capitalize bg-white text-black "
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
            {domaine && (
              <img
                src={domaine?.image}
                className="ml-1 w-8 h-8 rounded-full shadow-sm"
              />
            )}
          </div>
          <h3 className="mt-1 px-5 text-base 2xl:text-xl">Catégories</h3>
          <div className="flex items-center ">
            <select
              onChange={(e) => {
                navigate(`/category/${e.target.value}`);
                setCategory(
                  categories.find(({ name }) => name === e.target.value),
                );
                setDomaine(null);
              }}
              className="outline-none w-4/5 text-base border-2 border-gray-200 py-3 pl-2 ml-5 rounded-md cursor-pointer"
            >
              <option value="others" className="sm:text-bg bg-white">
                Choisis
              </option>
              {categories.map((item) => (
                <option
                  key={item.name}
                  className="inline-block text-base border-0 outline-none py-2 capitalize bg-white text-black "
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
            {category && (
              <img
                src={category?.image}
                className="ml-1 w-8 h-8 rounded-full shadow-sm"
              />
            )}
          </div>
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
