import React, { useEffect, useState } from "react";
import {
  IoArrowBack,
} from "react-icons/io5";

import {
  MdLocalPhone,
} from "react-icons/md";

import {
  FiCamera,
} from "react-icons/fi";

import {
  FaUserAlt,
} from "react-icons/fa";

import {
  BsInfoCircleFill,
} from "react-icons/bs";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // Fetch Current User
  // =========================
  useEffect(() => {

    const fetchCurrentUser = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/v1/user/me",
          {
            withCredentials: true,
          }
        );

        const user = res.data.user;

        setCurrentUser(user);

        setName(user.name || "");
        setAbout(user.about || "");
        setPhone(user.phone || "");

      } catch (err) {

        if (
          err.response?.status === 401
        ) {
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

  // =========================
  // Update Profile
  // =========================
  const handleProfileUpdate =
    async (e) => {

      e.preventDefault();

      if (
        phone &&
        !/^\d{10}$/.test(phone)
      ) {
        return toast.error(
          "Phone number must be 10 digits"
        );
      }

      try {

        const formData =
          new FormData();

        formData.append(
          "name",
          name
        );

        formData.append(
          "about",
          about
        );

        formData.append(
          "phone",
          phone
        );

        if (avatar) {
          formData.append(
            "avatar",
            avatar
          );
        }

        const { data } =
          await axios.put(
            "http://localhost:5000/api/v1/user/updateprofile",
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        toast.success(
          data.message ||
            "Profile Updated"
        );

        navigate("/");

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to update profile"
        );
      }
    };

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          flex items-center
          justify-center
          bg-[#EFEAE2]
        "
      >
        <p
          className="
            text-sm text-slate-600
          "
        >
          Loading...
        </p>
      </div>
    );
  }

  return (

    <section
      className="
        min-h-screen
        bg-[#EFEAE2]
        px-3 py-4
      "
    >

      {/* SMALL CARD */}
      <div
        className="
          mx-auto
          w-full max-w-sm
          rounded-3xl
          border border-slate-200
          bg-white
          shadow-md
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            flex items-center
            gap-3
            border-b border-slate-100
            px-4 py-4
            bg-white
          "
        >

          <button
            onClick={() => navigate(-1)}
            type="button"
            className="
              flex h-9 cursor-pointer w-9
              items-center justify-center
              rounded-full
              hover:bg-slate-100
              transition
            "
          >
            <IoArrowBack
              className="
                text-xl
                text-slate-700
              "
            />
          </button>

          <h2
            className="
              text-base
              font-semibold
              text-slate-800
            "
          >
            Edit Profile
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleProfileUpdate
          }
          className="p-5"
        >

          {/* AVATAR */}
          <div
            className="
              mb-6
              flex flex-col
              items-center
            "
          >

            <div className="relative">

              <img
                src={
                  avatar
                    ? URL.createObjectURL(
                        avatar
                      )
                    : currentUser
                        ?.avatar?.url ||
                      "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="profile"
                className="
                  h-24 w-24
                  rounded-full
                  object-cover
                  border-1
                  border-white
                  shadow-md
                "
              />

              <label
                className="
                  absolute
                  bottom-0 right-0
                  flex h-8 w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-r
                  from-slate-900
                  via-blue-600
                  to-indigo-600
                  text-white
                  shadow-md
                "
              >

                <FiCamera
                  className="
                    text-sm
                  "
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAvatar(
                      e.target.files[0]
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>

            <h2
              className="
                mt-3
                text-lg
                font-semibold
                text-slate-800
              "
            >
              {currentUser?.name}
            </h2>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Update your profile
            </p>
          </div>

          {/* NAME */}
          <div className="mb-4">

            <label
              className="
                mb-2
                flex items-center
                gap-2
                text-xs
                font-medium
                text-slate-600
              "
            >
              <FaUserAlt
                className="
                  text-blue-600
                "
              />

              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter name"
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm
                outline-none
                focus:border-blue-400
                focus:bg-white
              "
            />
          </div>

          {/* ABOUT */}
          <div className="mb-4">

            <label
              className="
                mb-2
                flex items-center
                gap-2
                text-xs
                font-medium
                text-slate-600
              "
            >
              <BsInfoCircleFill
                className="
                  text-blue-600
                "
              />

              About
            </label>

            <textarea
              rows="3"
              value={about}
              onChange={(e) =>
                setAbout(
                  e.target.value
                )
              }
              placeholder="Write something..."
              className="
                w-full
                resize-none
                rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm
                outline-none
                focus:border-blue-400
                focus:bg-white
              "
            />
          </div>

          {/* PHONE */}
          <div className="mb-6">

            <label
              className="
                mb-2
                flex items-center
                gap-2
                text-xs
                font-medium
                text-slate-600
              "
            >
              <MdLocalPhone
                className="
                  text-blue-600
                "
              />

              Phone
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(0, 10)
                )
              }
              placeholder="10 digit number"
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm
                outline-none
                focus:border-blue-400
                focus:bg-white
              "
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              rounded-xl
              bg-gradient-to-r
              from-slate-900
              via-blue-600
              to-indigo-600
              py-3 cursor-pointer
              text-sm
              font-semibold
              text-white
              transition
              hover:opacity-90
            "
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;