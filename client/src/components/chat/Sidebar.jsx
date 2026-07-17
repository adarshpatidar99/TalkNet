import React, { useEffect, useState } from "react";
import axios from "axios";

import AllUserList from "./AllUserList";
import ChatBox from "./Chat/ChatBox";
import socket from "../socket/socket";

const API_URL = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState({});

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(true);    

  // Select user
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    if (window.innerWidth < 768) {
      setIsMobileChatOpen(true);
    }
  };

  // Back button
  const handleBackToUsers = () => {
    setIsMobileChatOpen(false);
  };

  // Fetch user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/user/me`,    
          { withCredentials: true }
        );
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Socket connect
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("userOnline", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileChatOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden font-sans">

      <div
        className={`
          flex flex-col
          transition-all duration-300
          bg-slate-100
          md:w-[340px]

          ${isMobileChatOpen ? "hidden" : "flex w-full"}
        `}
      >

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">
          <AllUserList
            onSelectUser={handleSelectUser}
            currentUserId={currentUser._id}
            socket={socket}
          />
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div
        className={`
          flex-1
          bg-slate-100
          md:flex
          ${isMobileChatOpen ? "flex" : "hidden"}
        `}
      >
        {currentUser && selectedUser ? (
          <ChatBox
            socket={socket}
            currentUserId={currentUser._id}
            currentUser={currentUser} 
            selectedUser={selectedUser}
            chats={chats}
            setChats={setChats}
            onBack={handleBackToUsers}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <p className="text-gray-400 text-lg">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;