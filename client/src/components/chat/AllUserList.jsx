import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";
import {
  fetchUsers,
  setOnlineUsers,
} from "../../features/user/userSlice";

import axios from 'axios';

import {setChats} from "../../features/chat/chatSlice"

const API_URL = import.meta.env.VITE_API_URL;

const AllUserList = ({
  onSelectUser,
  socket,
  currentUserId,
}) => {
  const dispatch = useDispatch();

  const {
    user: currentUser,
    allUsers = [],
    onlineUsers = [],
    loading,
  } = useSelector(
    (state) => state.user || {}
  );

  const chats = useSelector(
    (state) => state.chat?.chats?? []
  );

  const [
    searchKeyword,
    setSearchKeyword,
  ] = useState("");

  const [
    filteredUsers,
    setFilteredUsers,
  ] = useState([]);

  useEffect(() => {
    const getChats = async() => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/chat/`,
          {withCredentials: true},
        )

        dispatch(setChats(res.data.chats?? res.data ));
      } catch (error) {
        console.error(
          "Error Fetching chats:",
          error.response?.data || error.message
        );
      }
    }

    getChats();
  }, [dispatch]);

  // Format Last Seen
  const formatLastSeen = (
    dateString
  ) => {
    if (!dateString) return "";

    const lastSeen =
      new Date(dateString);

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const yesterday =
      new Date(today);

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const time =
      lastSeen.toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );

    if (lastSeen >= today) {
      return time;
    }

    if (
      lastSeen >= yesterday &&
      lastSeen < today
    ) {
      return "Yesterday";
    }

    const day = String(
      lastSeen.getDate()
    ).padStart(2, "0");

    const month = String(
      lastSeen.getMonth() + 1
    ).padStart(2, "0");

    const year = String(
      lastSeen.getFullYear()
    ).slice(-2);

    return `${day}/${month}/${year}`;
  };

  // Online Users
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsersUpdate =
      (ids) => {
        dispatch(
          setOnlineUsers(ids)
        );
      };

    socket.on(
      "updateOnlineUsers",
      handleOnlineUsersUpdate
    );

    return () => {
      socket.off(
        "updateOnlineUsers",
        handleOnlineUsersUpdate
      );
    };
  }, [socket, dispatch]);

  // Fetch Users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter Users
  useEffect(() => {
    const baseList =
      allUsers.filter(
        (u) =>
          u._id!==
          (currentUser?._id ||
            currentUserId)
      );

    setFilteredUsers(baseList);
  }, [
    allUsers,
    currentUser,
    currentUserId,
  ]);

  const allItems = useMemo(() => {
  const keyword = searchKeyword.trim().toLowerCase();

  const items = [...chats, ...filteredUsers];

  if (!keyword) return items;

  return items.filter((item) => {
    const name = item.isGroupChat
      ? item.chatName
      : item.name;

    return name?.toLowerCase().includes(keyword);
  });
}, [chats, filteredUsers, searchKeyword]);

  const handleSearch = (e) => {
  setSearchKeyword(e.target.value);
};

  const handleSelect = (user) => {
    const exists = selectedUsers.some((u) => u._id === user._id);

    if (exists) {
      setSelectedUsers(
        selectedUsers.filter((u) => u._id!== user._id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm text-slate-400">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Search */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-3">
        <input
          type="text"
          placeholder="Search people..."
          value={searchKeyword}
          onChange={
            handleSearch
          }
          className="
            w-full rounded-full
            border border-slate-200
            bg-slate-50
            px-4 py-2.5
            text-sm text-slate-700
            outline-none
            transition-all duration-200
            placeholder:text-slate-400
            focus:border-slate-300
            focus:bg-white
            focus:ring-2 focus:ring-slate-100
          "
        />
      </div>

      {/* List */}
      <div className="flex-1 bg-white">
        {allItems.length > 0? (
          allItems.map((item) => {

            const isGroup =
              item.isGroupChat ===
              true;

            const displayName =
              isGroup
            ? item.chatName
                : item.name;

            const isOnline =
           !isGroup &&
              onlineUsers.includes(
                item._id
              );

            const avatarUrl =
              isGroup
            ? item.groupImage ||
                  "https://cdn-icons-png.flaticon.com/512/681/681494.png"
                : item.avatar
                ?.url ||
                  "https://www.w3schools.com/w3images/avatar2.png";

            return (
              <button
                key={item._id}
                onClick={() =>
                  onSelectUser(
                    item
                  )
                }
                className="
                  group flex w-full items-center gap-4
                  rounded-2xl px-4 py-3
                  text-left
                  transition-all duration-200
                  hover:bg-slate-50
                  active:scale-[0.99]
                "
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={
                      avatarUrl
                    }
                    alt={
                      displayName
                    }
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  {isOnline && (
                    <span
                      className="
                        absolute bottom-0 right-0
                        h-2.5 w-2.5 rounded-full
                        border border-white
                        bg-emerald-500
                      "
                    />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-[15px] font-semibold text-slate-900">
                      {
                        displayName
                      }
                    </h3>

                    <span
                      className={`
                        text-xs font-medium
                        ${
                          isOnline
                        ? "text-emerald-600"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {isOnline
                    ? "Online"
                        : isGroup
                    ? ""
                        : formatLastSeen(
                            item.lastSeen
                          )}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[13px] text-slate-500">
                    {isGroup
                  ? "Group Chat"
                      : "Tap to start chatting"}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center bg-white">
            <p className="text-sm text-slate-400">
              No users found...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUserList;
