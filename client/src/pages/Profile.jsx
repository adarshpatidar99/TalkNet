import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { IoArrowBack } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { FiCamera } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { BsInfoCircleFill } from "react-icons/bs";

import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [removingAvatar, setRemovingAvatar] = useState(false);

  // Fetch Current User
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/user/me`,
          { withCredentials: true }
        );

        const user = res.data.user;

        setCurrentUser(user);
        setName(user.name || "");
        setAbout(user.about || "");
        setPhone(user.phone || "");
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);


   const handleRemoveAvatar = async () => {
  try {
    setRemovingAvatar(true);

    await axios.delete(
      `${API_URL}/api/v1/user/remove-avatar`,
      {
        withCredentials: true,
      }
    );

    setAvatar(null);

    setCurrentUser((prev) => ({
      ...prev,
      avatar: {
        public_id: "",
        url: "",
      },
    }));

    toast.success("Profile picture removed successfully.");
  } catch (error) {
    console.log(error);
    toast.error("Failed to remove profile picture.");
  } finally {
    setRemovingAvatar(false);
  }
   };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);
      formData.append("phone", phone);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const { data } = await axios.patch(
      `${API_URL}/api/v1/user/updateprofile`,
       formData,
      {
       withCredentials: true,
      }
    );

      toast.success(data.message || "Profile Updated");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEAE2]">
        <p className="text-sm text-slate-600">Loading...</p>
      </div>
    );
  }

  const avatarUrl = avatar
  ? URL.createObjectURL(avatar)
  : currentUser?.avatar?.url ||
    "https://www.w3schools.com/w3images/avatar2.png";

  return (
    <section className="min-h-screen bg-[#EFEAE2] px-3 py-4">
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <IoArrowBack className="text-xl text-slate-700" />
          </button>

          <h2 className="text-base font-semibold text-slate-800">
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="p-5">

          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="profile"
                className="h-24 w-24 rounded-full object-cover border border-white shadow-md"
              />

              <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white">
                <FiCamera className="text-sm" />

      
              <input
                type="file"
                accept="image/*"
                  onChange={(e) => {
                  if (e.target.files.length > 0) {
                  setAvatar(e.target.files[0]);
                  }
                  }}
                  className="hidden"
              /> 

              </label>
            </div>

            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              {currentUser?.name}
            </h2>

            <p className="text-xs text-slate-500">
              Update your profile
            </p>

            {(currentUser?.avatar?.url || avatar) && (
            <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={removingAvatar}
            className="mt-2 text-sm font-medium text-red-600 hover:underline           disabled:opacity-50 disabled:cursor-not-allowed"
            >

            {removingAvatar ? "Removing..." : "Remove Photo"}
           </button>
           )}

          </div>

          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600">
              <FaUserAlt className="text-blue-600" />
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600">
              <BsInfoCircleFill className="text-blue-600" />
              About
            </label> 

            <textarea
              rows="3"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          <button
             type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? <Spinner /> : "Save Changes"}
          </button>
          
        </form>
      </div>
    </section>
  );
};

export default Profile;
