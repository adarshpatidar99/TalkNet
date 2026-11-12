import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsTrash3, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({
  selectedUser,
  isPartnerTyping,
  groupTypingUsers = [],
  onBack,
  onClearChat,
}) => {
  const isGroupChat = selectedUser?.isGroupChat;
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current &&!menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const avatarUrl = isGroupChat
 ? selectedUser?.groupImage || "https://cdn-icons-png.flaticon.com/512/681/681494.png"
    : selectedUser?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png";

  const formatLastSeen = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return days === 1? "1 day ago" : `${days} days ago`;
  };

  let statusText = "";
  if (isGroupChat) {
    statusText = groupTypingUsers.length > 0
   ? groupTypingUsers.length === 1? `${groupTypingUsers[0].name} is typing...` : `${groupTypingUsers.length} typing...`
      : `${selectedUser?.participants?.length || 0} members`;
  } else {
    statusText = isPartnerTyping? "typing..." : selectedUser?.isOnline? "Online" : selectedUser?.lastSeen? `last seen ${formatLastSeen(selectedUser.lastSeen)}` : "Offline";
  }

  const handleClearChat = async () => {
    setShowClearConfirm(false);
    setShowMenu(false);
    if (onClearChat) await onClearChat(selectedUser._id);
  };

  return (
    <header className="relative flex items-center gap-1 px-2 sm:px-4 py-2.5 bg-white border-b border-[#e9edef] z-40">
      <button onClick={onBack} className="md:hidden flex h-10 w-10 items-center justify-center text-[#54656f] -ml-1">
        <IoMdArrowBack size={24} />
      </button>

      <div onClick={() => navigate(isGroupChat? `/group/${selectedUser._id}` : `/user-profile/${selectedUser._id}`)} className="flex flex-1 items-center gap-3 cursor-pointer min-w-0">
        <img src={avatarUrl} className="h-10 w-10 rounded-full object-cover" alt="avatar" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold text-[#111b21]">{isGroupChat? selectedUser?.chatName : selectedUser?.name || "User"}</h3>
          <p className={`truncate text-[13px] ${isPartnerTyping || groupTypingUsers.length > 0 || selectedUser?.isOnline? "text-[#25D366]" : "text-[#667781]"}`}>{statusText}</p>
        </div>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setShowMenu((p) =>!p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition ${showMenu? "bg-[#f0f2f5]" : "hover:bg-[#f0f2f5]"}`}
        >
          <HiOutlineDotsVertical size={22} className="text-[#54656f]" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-12 w-[200px] rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-black/[0.06] py-1.5 overflow-hidden">
            <button onClick={() => { setShowMenu(false); navigate(isGroupChat? `/group/${selectedUser._id}` : `/user-profile/${selectedUser._id}`)}} className="flex w-full items-center gap-3 px-4 py-3 text-[14px] text-[#111b21] hover:bg-[#f5f6f6]">
              <BsPersonCircle size={18} className="text-[#54656f]" /> View profile
            </button>
            <button onClick={() => { setShowMenu(false); setShowClearConfirm(true);}} className="flex w-full items-center gap-3 px-4 py-3 text-[14px] text-red-600 hover:bg-red-50">
              <BsTrash3 size={18} /> Clear chat
            </button>
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[340px] rounded-[18px] bg-white p-6 shadow-2xl">
            <h2 className="text-[18px] font-bold text-center">Clear this chat?</h2>
          
            <p className="mt-2 text-[14px] text-center text-[#667781]">
  {isGroupChat 
    ? "This will clear this group's messages only for you. Other members will still see their chat history."
    : "This will clear messages only for you. The other person will still see their chat history."}
</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 rounded-full py-3 text-[14px] font-semibold bg-[#f0f2f5]">Cancel</button>
              <button onClick={handleClearChat} className="flex-1 rounded-full py-3 text-[14px] font-semibold bg-red-600 text-white">Clear</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;