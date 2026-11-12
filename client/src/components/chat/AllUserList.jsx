import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, setOnlineUsers } from "../../features/user/userSlice";
import axios from 'axios';
import { setChats } from "../../features/chat/chatSlice";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL;

const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
  const dispatch = useDispatch();
  const { user: currentUser, allUsers = [], onlineUsers = [], loading } = useSelector((s) => s.user || {});
  const chats = useSelector((s) => s.chat?.chats ?? []);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/chat/`, { withCredentials: true });
        dispatch(setChats(res.data.chats ?? res.data));
      } catch (e) { console.error(e); }
    };
    getChats();
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    const h = (ids) => dispatch(setOnlineUsers(ids));
    socket.on("updateOnlineUsers", h);
    return () => socket.off("updateOnlineUsers", h);
  }, [socket, dispatch]);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(allUsers.filter((u) => u._id !== (currentUser?._id || currentUserId)));
  }, [allUsers, currentUser, currentUserId]);

  const allItems = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    const chatUserIds = new Set(chats.filter(c => !c.isGroupChat).map(c => c.participants?.find(p => p._id !== currentUserId)?._id).filter(Boolean));
    const uniqueUsers = filteredUsers.filter(u => !chatUserIds.has(u._id));
    const items = [...chats, ...uniqueUsers];
    if (!kw) return items;
    return items.filter(i => (i.isGroupChat ? i.chatName : i.name)?.toLowerCase().includes(kw));
  }, [chats, filteredUsers, searchKeyword, currentUserId]);

  const getPreview = (item, isGroup, isOnline) => {
    if (isGroup) {
      if (item.latestMessage?.content) return item.latestMessage.content;
      return `${item.participants?.length || 0} members • Group`;
    }
    if (item.latestMessage?.content) {
      const you = item.latestMessage.sender === currentUserId || item.latestMessage.sender?._id === currentUserId;
      return `${you ? "You: " : ""}${item.latestMessage.content}`;
    }
    if (isOnline) return "Online • Tap to chat";
    return "Tap to start conversation";
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F8F9FB]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#F8F9FB]">
   
      <div className="p-2.5 md:p-3">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] md:text-[16px]" />
          <input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full h-[46px] md:h-[42px] rounded-[12px] md:rounded-[10px] bg-white border border-slate-200 pl-10 md:pl-9 pr-4 text-[16px] md:text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-0 pb-3">
        {allItems.length > 0 ? (
          allItems.map((item) => {
            const isGroup = item.isGroupChat === true;
            const displayName = isGroup ? item.chatName : item.name;
            const isOnline = !isGroup && onlineUsers.includes(item._id);
            const avatarUrl = isGroup
              ? item.groupImage || "https://cdn-icons-png.flaticon.com/512/681/681494.png"
              : item.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png";
            const isOwnLastMessage = item.latestMessage && (item.latestMessage.sender === currentUserId || item.latestMessage.sender?._id === currentUserId);

            return (
              <button
                key={item._id}
                onClick={() => onSelectUser(item)}
                className="group flex w-full items-center gap-3 md:gap-2.5 px-3.5 md:px-3 py-[12px] md:py-[8px] bg-white border-b border-slate-100 hover:bg-slate-50 text-left transition-all active:bg-slate-100"
              >
                <div className="relative shrink-0">
                  <img src={avatarUrl} alt={displayName} className="h-[54px] w-[54px] md:h-[46px] md:w-[46px] rounded-full object-cover" />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-[13px] w-[13px] md:h-[11px] md:w-[11px] rounded-full bg-emerald-500 border-[2.5px] border-white shadow-sm" />
                  )}
                  {isGroup && (
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 md:h-4 md:w-4 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                      <FaUsers className="text-[9px] md:text-[7px] text-white" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-[17px] md:text-[15px] font-semibold md:font-[550] leading-[22px] md:leading-[20px] text-[#111B21]">
                      {displayName}
                    </h3>
                    <span className="shrink-0 text-[12.5px] md:text-[11.5px] text-[#667781] font-normal">
                      {isGroup ? "" : item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-[2px] md:mt-[1px]">
                    {!isGroup && isOwnLastMessage && (
                      <BsCheck2All className="text-[15px] md:text-[13px] text-[#53BDEB] shrink-0" />
                    )}
                    <p className="truncate text-[14.5px] md:text-[13px] leading-[20px] md:leading-[18px] text-[#667781] font-normal">
                      {getPreview(item, isGroup, isOnline)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center px-8">
            <div className="h-[72px] w-[72px] rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4">
              <FiMessageSquare className="text-[28px] text-slate-300" />
            </div>
            <h3 className="text-[16px] font-semibold text-slate-900">No chats yet</h3>
            <p className="text-[14px] text-slate-500 mt-1 max-w-[200px]">Search for people to start your first conversation</p>
          </div>      
        )}                                  
      </div>
    </div>
  );
};

export default AllUserList;
