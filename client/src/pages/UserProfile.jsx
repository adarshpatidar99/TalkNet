import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/user/profile/${id}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const formatLastSeen = (date) => {
    if (!date) return "Offline";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1? "s" : ""} ago`;
  };

  const formatJoinedDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EFEAE2]">
        <p className="text-slate-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#EFEAE2] px-3 py-4"> 

      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">

        <div className="border-b border-slate-100 bg-white px-5 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-slate-100 transition"
          >
            <IoMdArrowBack size={22} className="text-slate-700" />
          </button>
          <h2 className="flex-1 text-center text-lg font-semibold text-slate-800">
          User Info
          </h2>
          <div className="w-10"></div>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                onClick={() => setShowAvatar(true)} 
                src={
                  user?.avatar?.url ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt={user?.name}
                className="h-28 w-28 rounded-full border-2 border-white object-cover shadow-md cursor-pointer"
              />
           
            </div>

            <p className="mt-4 text-xl font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-sm text-slate-500">@{user?.username}</p>

            <p
              className={`mt-2 text-sm ${
                user?.isOnline? "text-green-600" : "text-slate-500"
              }`}
            >
              {user?.isOnline
               ? "Online"
                : `Last seen ${formatLastSeen(user?.lastSeen)}`}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100"></div> 


        <div className="border-t border-slate-100"></div>

        <div className="p-5">
          <p className="text-xs text-slate-400 font-semibold">ABOUT</p>
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
            {user?.about?.trim()? user.about : "No about added"}
          </p>
        </div>

        <div className="border-t border-slate-100"></div>

        <div className="p-5">
          <p className="text-xs text-slate-400 font-semibold">JOINED</p>
          <p className="mt-2 text-sm text-slate-700">
            {formatJoinedDate(user?.createdAt)}
          </p>
        </div>
      </div>

      {showAvatar && (
        <div
          onClick={() => setShowAvatar(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
        >
          <img
            src={
              user?.avatar?.url ||
              "https://www.w3schools.com/w3images/avatar2.png"
            }
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-xl"
          />
        </div>
      )}
    </section>
  );
};

export default UserProfile;