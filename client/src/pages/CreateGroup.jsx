import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../components/socket/socket";
import { IoArrowForward, IoArrowBack, IoSearch } from "react-icons/io5";
import { fetchUsers, setOnlineUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser, allUsers = [], onlineUsers = [], loading } = useSelector((state) => state.user || {});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);
  useEffect(() => {
    const baseList = allUsers.filter((u) => u._id!== currentUser?._id);
    setFilteredUsers(baseList);
  }, [allUsers, currentUser]);
  useEffect(() => { socket.connect(); return () => socket.disconnect(); }, []);
  useEffect(() => {
    const handleOnlineUsersUpdate = (ids) => dispatch(setOnlineUsers(ids));
    socket.on("updateOnlineUsers", handleOnlineUsersUpdate);
    return () => socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
  }, [dispatch]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    const baseList = allUsers.filter((u) => u._id!== currentUser?._id);
    if (!keyword.trim()) { setFilteredUsers(baseList); return; }
    const lower = keyword.toLowerCase();
    setFilteredUsers(baseList.filter((u) => u.name?.toLowerCase().includes(lower)));
  };

  const handleSelect = (user) => {
    const exists = selectedUsers.some((u) => u._id === user._id);
    if (exists) setSelectedUsers(selectedUsers.filter((u) => u._id!== user._id));
    else setSelectedUsers([...selectedUsers, user]);
  };

  const handleNext = () => {
    if (selectedUsers.length < 2) return;
    navigate('/create-group-details', { state: { selectedUsers } });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#EFEAE2]"><p className="text-[15px] text-slate-500">Loading users...</p></div>;
  }

  return (
    <section className="min-h-screen bg-[#EFEAE2]">
      <div className="mx-auto w-full max-w-[520px] min-h-screen bg-[#EFEAE2] flex flex-col">

        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/70">
          <div className="flex items-center gap-3 px-4 h-[64px]">
            <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
              <IoArrowBack className="text-[24px] text-slate-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-[19px] font-semibold text-slate-900 leading-none">New group</h1>
              <p className="text-[13px] text-slate-500 mt-1">{selectedUsers.length === 0? "Add members" : `${selectedUsers.length} selected`}</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full bg-[#F1F2F5] border border-transparent rounded-full pl-11 pr-4 py-[12px] text-[16px] text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-3 space-y-3">

          {selectedUsers.length > 0 && (
            <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100/80 p-4">
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleSelect(user)}
                    className="flex items-center gap-2.5 bg-[#E7F0FF] hover:bg-[#D6E7FF] border border-blue-200/60 rounded-full pl-1 pr-3 py-1 transition"
                  >
                    <img src={user.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                    <span className="text-[14px] font-medium text-blue-700 max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <span className="text-[16px] font-bold text-blue-600 ml-0.5">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-[13px] font-semibold tracking-wide text-slate-400 uppercase">Contacts on App • {filteredUsers.length}</p>
            </div>

            <div className="divide-y divide-slate-50">
              {filteredUsers.length > 0? (
                filteredUsers.map((user) => {
                  const isOnline = onlineUsers.includes(user._id);
                  const isSelected = selectedUsers.some((u) => u._id === user._id);
                  const avatarUrl = user.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png";
                  return (
                    <button
                      key={user._id}
                      onClick={() => handleSelect(user)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-all text-left ${isSelected? "bg-[#F0F6FF]" : ""}`}
                    >
                      <div className="relative shrink-0">
                        <img src={avatarUrl} alt={user.name} className="h-[52px] w-[52px] rounded-full object-cover" />
                        {isOnline && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />}
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center shadow-md">✓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="truncate text-[17px] font-medium text-slate-900 leading-tight">{user.name}</h2>
                        <p className={`mt-0.5 text-[14px] ${isOnline? "text-emerald-600" : "text-slate-500"}`}>{isOnline? "Online" : "Tap to select"}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-[15px] text-slate-400">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-[#EFEAE2] via-[#EFEAE2] to-transparent pt-3 pb-6 px-4">
          <button
            onClick={handleNext}
            disabled={selectedUsers.length < 2}
            className={`w-full h-[52px] rounded-full text-[17px] font-semibold flex items-center justify-center gap-2 transition-all
              ${selectedUsers.length < 2? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.45)] active:scale-[0.98]"}`}
          >
            Next <IoArrowForward className="text-[20px]" />
          </button>
          {selectedUsers.length < 2 && <p className="text-center text-[12px] text-slate-500 mt-2.5">Select at least 2 members</p>}
        </div>

      </div>
    </section>
  );
};

export default CreateGroup;