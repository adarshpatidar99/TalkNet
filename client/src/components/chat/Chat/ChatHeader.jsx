import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({
  selectedUser,
  isPartnerTyping,           
  groupTypingUsers = [],
  onBack,                     
}) => {
  const isGroupChat = selectedUser?.isGroupChat;
                                
  const navigate = useNavigate();

  const avatarUrl = isGroupChat
    ? selectedUser?.groupImage ||
      "https://cdn-icons-png.flaticon.com/512/681/681494.png"
    : selectedUser?.avatar?.url ||
      "https://www.w3schools.com/w3images/avatar2.png";

  const isOnline = selectedUser?.isOnline;
  const lastSeen = selectedUser?.lastSeen;

  const formatLastSeen = (date) => {
    if (!date) return "";

    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hrs ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";

    return `${days} days ago`;
  };              

  let statusText = "";

  if (isGroupChat) {
    if (groupTypingUsers.length > 0) {
      statusText =
        groupTypingUsers.length === 1
          ? `${groupTypingUsers[0].name} is typing...`             
          : `${groupTypingUsers[0].name} and ${groupTypingUsers.length - 1} others are typing...`;
    } else {
      statusText = `${selectedUser?.participants?.length || 0} members`;
    }
  } else {
    statusText = isPartnerTyping
      ? "typing..."
      : isOnline
      ? "Online"
      : lastSeen
      ? `last seen ${formatLastSeen(lastSeen)}`
      : "Offline";
  }

  const openGroupDetails = () => {

     console.log("selectedUser:", selectedUser);
  console.log("selectedUser._id:", selectedUser?._id);
    if (selectedUser?.isGroupChat) {
      navigate(`/group/${selectedUser._id}`);
    } else {
      navigate(`/user-profile/${selectedUser._id}`)
    }
  }

  return (
  <header className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">

  <button
    onClick={onBack}
    className="md:hidden flex h-9 items-center ml-1"
  >
    <IoMdArrowBack />
  </button>

  <div
    onClick={openGroupDetails}
    className="flex flex-1 items-center gap-3 cursor-pointer"
  >
    <img
      src={avatarUrl}
      className="h-10 w-10 rounded-full object-cover"
      alt="avatar"
    />

    <div className="min-w-0 flex-1">
      <h3 className="truncate text-sm sm:text-base">
        {isGroupChat ? selectedUser?.chatName : selectedUser?.name || "User"}
      </h3>

             <p
          className={`truncate text-xs ${
            isPartnerTyping || groupTypingUsers.length > 0
              ? "text-green-500"
              : isOnline
              ? "text-green-500"
              : "text-slate-500"
          }`}
        >
          {statusText}
        </p>
    </div>
  </div>

</header>


  );
};

export default ChatHeader;
