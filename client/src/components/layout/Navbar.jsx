import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CiMenuKebab } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";

import logo from "../../assets/TalkNet2.png";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/user/me`,
          {
            withCredentials: true,
          }
        );

        setCurrentUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = async() => {
    try {
      await axios.post(
        `${API_URL}/api/v1/user/logout`, {},
        {
          withCredentials: true,
        }
      );

      toast.success("Logged out successfully!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error(err);

      toast.error("Logout failed!", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <ToastContainer />

      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between h-14 px-4 md:h-11 md:px-6">

          {/* LEFT */}
          <div className="flex items-center">

            <div className="flex items-center justify-center h-10 w-12 md:h-8 md:w-10">
             <img
               src={logo}
               alt="TalkNet"
               className="h-14 w-12 md:h-12 md:w-10"
             />
            </div>

           <h1 className="text-2xl md:text-base font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">TalkNet</h1>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* USER */}
            <div className="flex items-center gap-1 px-0.5 py-0.5 rounded-full border border-slate-300 bg-white/60">

              <img
                onClick={() => navigate("/profile")}
                src={
                  currentUser?.avatar?.url ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="profile"
                className="h-9 w-9 md:h-7 md:w-7 cursor-pointer rounded-full object-cover"
              />

              <span className="hidden md:flex md:px-3 md:py-1 md:rounded-full md:bg-white/70 md:border md:border-slate-200 md:text-sm md:text-slate-700 md:shadow-sm">
                {loading
                  ? "..."
                  : currentUser?.name || "Guest"}
              </span>

            </div>

            {/* MENU */}
            <div className="relative">

              <button
                onClick={() =>
                  setShowMenu(!showMenu)
                }
                className="cursor-pointer p-3 md:p-2 rounded-full hover:bg-slate-100 transition"
              >
                <CiMenuKebab size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">

                  <button
                    onClick={() => {
                      navigate("/create-group");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
                  >
                    <IoPeopleOutline size={18} />
                    New Group
                  </button>

                  <div className="border-t border-slate-200" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <MdOutlineLogout size={18} />
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;