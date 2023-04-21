/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { UserDetails } from "./index";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then(([data]) => {
      console.log(data);
      setUser(data);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "created") {
      setLoading(true);
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else if (text === "saved") {
      setLoading(true);
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <Spinner message="Loading profile" color="red"/>;
  if (loading) return <Spinner message="Loading profile" color="red"/>;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={urlFor(user.image)}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User?._id && (
              <div
                onClick={() => logout()}
                className="text-center text-white p-4 w-full cursor-pointer"
              >
                <button
                  type="button"
                  className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText("created");
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Crée
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText("saved");
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Favoris
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText('details');
              setActiveBtn("details");
            }}
            className={`${
              activeBtn === "details" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Details
          </button>
        </div>

        {text !== "details" ? (
          <>
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
            {pins?.length === 0 && (
              <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                Pas de poste trouvé!
              </div>
            )}
          </>
        ) : (
          <>
            <UserDetails user={user && user} setUser={setUser} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
