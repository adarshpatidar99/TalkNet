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

  const handleSelectUser = (user) => {
    setSelectedUser(user);

    if (window.innerWidth < 768) {
      setIsMobileChatOpen(true);
    }
  };

  const handleBackToUsers = () => {
    setIsMobileChatOpen(false);
  };

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
      <div className="flex h-full min-h-0 items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <p className="text-gray-500">
          Unable to load your account. Please log in again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden font-sans">
    
      <div
        className={`
          flex-col
          min-h-0
          overflow-hidden
          bg-slate-100
          transition-all duration-300
          md:flex md:w-[340px] md:shrink-0
          ${isMobileChatOpen ? "hidden" : "flex w-full"}
        `}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AllUserList
            onSelectUser={handleSelectUser}
            currentUserId={currentUser._id}
            socket={socket}
          />
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className={`
          min-h-0 min-w-0 flex-1 overflow-hidden bg-slate-100
          ${isMobileChatOpen ? "flex" : "hidden md:flex"}
        `}
      >
        {selectedUser ? (
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
          <div className="hidden flex-1 items-center justify-center md:flex">
            <p className="text-lg text-gray-400">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;