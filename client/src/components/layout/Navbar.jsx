import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineLogout } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/user/me`, { withCredentials: true });
        setCurrentUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally { setLoading(false); }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/user/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully!", { position: "top-center" });
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      toast.error("Logout failed!", { position: "top-center" });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-[20px] border-b border-slate-200/70">
        <div className="mx-auto flex h-[60px] md:h-[56px] max-w-[1280px] items-center justify-between px-4 md:px-6">

          <div onClick={() => navigate("/")} className="flex cursor-pointer items-center gap-2.5 md:gap-2.5 group">
            <div className="relative flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-[12px] md:rounded-[11px] bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-600 shadow-[0_4px_16px_rgba(79,70,229,0.35)] group-active:scale-95 transition">
              <span className="text-[16px] md:text-[15px] font-black tracking-tighter text-white drop-shadow-sm">TN</span>
              <span className="absolute -right-1 -top-1 h-[11px] w-[11px] md:h-[10px] md:w-[10px] rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="h-[7px] w-[7px] md:h-[6px] md:w-[6px] rounded-full bg-[#25D366] animate-pulse"></span>
              </span>
            </div>
            
            <h1 className="text-[19px] md:text-[18px] font-bold tracking-tight text-slate-900">TalkNet</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-2.5">
            <div onClick={() => navigate("/profile")} className="hidden md:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#F1F2F5] hover:bg-[#E8EBF0] border border-slate-200/60 cursor-pointer transition h-[36px]">
              <img src={currentUser?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} alt="profile" className="h-7 w-7 rounded-full object-cover ring-1 ring-white" />
              <span className="text-[13.5px] font-medium text-slate-700 max-w-[120px] truncate">
                {loading ? "..." : currentUser?.name || "Guest"}
              </span>
            </div>

            <img onClick={() => navigate("/profile")} src={currentUser?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} alt="profile" className="md:hidden h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200 active:scale-95 transition cursor-pointer" />

            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-full bg-[#F1F2F5] hover:bg-slate-200 text-slate-600 transition active:scale-95">
                <HiDotsVertical className="text-[20px] md:text-[18px]" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2.5 w-[200px] md:w-[192px] bg-white border border-slate-200 rounded-[16px] md:rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50 p-1.5 animate-[scaleIn_0.15s_ease]">
                  <button onClick={() => { navigate("/create-group"); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 md:py-2 text-[14px] md:text-[13.5px] font-medium text-slate-700 hover:bg-[#F1F2F5] rounded-[10px] transition text-left">
                    <div className="h-8 w-8 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white"><IoPeopleOutline className="text-[16px] md:text-[14px]" /></div>
                    New Group
                  </button>
                  <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                  <button onClick={() => { setShowMenu(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 md:py-2 text-[14px] md:text-[13.5px] font-medium text-red-600 hover:bg-red-50 rounded-[10px] transition text-left">
                    <div className="h-8 w-8 md:h-7 md:w-7 rounded-full bg-red-50 flex items-center justify-center text-red-600"><MdOutlineLogout className="text-[16px] md:text-[14px]" /></div>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <style>{`@keyframes scaleIn { from { opacity:0; transform: scale(0.96) translateY(-4px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </>
  );
};

export default Navbar;