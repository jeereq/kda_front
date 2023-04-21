/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { MdDownloadForOffline, MdLink } from "react-icons/md";

import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import {
  pinDetailMorePinQuery,
  pinDetailQuery,
  domaines,
  categories,
} from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then(([data]) => {
        setPinDetail(data);
        if (data) {
          const query1 = pinDetailMorePinQuery(data);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  if (!pinDetail) {
    return <Spinner message="Chargement en cours !" />;
  }

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
                <a
                  href={pinDetail.destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdLink />
                </a>
              </div>
              <div className="flex gap-2 items-center">
                {pinDetail?.domain && (
                  <img
                    src={
                      domaines.find(({ name }) => name === pinDetail.domain)
                        ?.image
                    }
                    className="ml-1 w-8 h-8 rounded-full shadow-sm"
                  />
                )}
                {pinDetail?.category && (
                  <img
                    src={
                      categories.find(({ name }) => name === pinDetail.category)
                        ?.image
                    }
                    className="ml-1 w-8 h-8 rounded-full shadow-sm"
                  />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link
              to={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg "
            >
              <img
                src={urlFor(pinDetail?.postedBy.image)}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>

            <h2 className="mt-5 text-2xl">Commentaires</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={urlFor(item.postedBy?.image)}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user?._id}`}>
                <img
                  src={urlFor(user?.image)}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Ajouter un commentaire"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Envoyer..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          Autres poste simulaire(s)
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Chargement des postes similaire en cours !" />
      )}
    </>
  );
};

export default PinDetail;
