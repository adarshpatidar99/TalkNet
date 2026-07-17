import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../components/socket/socket";
import { IoArrowForward } from "react-icons/io5";
import { fetchUsers, setOnlineUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Redux state
  const {
    user: currentUser,
    allUsers = [],
    onlineUsers = [],
    loading,
  } = useSelector((state) => state.user || {});

  // Local state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Initialize list
  useEffect(() => {
    const baseList = allUsers.filter(
      (u) => u._id!== currentUser?._id
    );

    setFilteredUsers(baseList);
  }, [allUsers, currentUser]);

  // Socket connect
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  // Online users
  useEffect(() => {
    const handleOnlineUsersUpdate = (ids) => {
      dispatch(setOnlineUsers(ids));
    };

    socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

    return () => {
      socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
    };
  }, [dispatch]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    const baseList = allUsers.filter(
      (u) => u._id!== currentUser?._id
    );

    if (!keyword.trim()) {
      setFilteredUsers(baseList);
      return;
    }

    const lower = keyword.toLowerCase();

    setFilteredUsers(
      baseList.filter((u) =>
        u.name?.toLowerCase().includes(lower)
      )
    );
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
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-sm text-slate-400">Loading users...</p>
      </div>
    );
  }

  const handleNext = () => {
    if (selectedUsers.length < 2) return;

    navigate('/create-group-details', {
      state: {
        selectedUsers
      }
    });
  }

  return (
    <section className="min-h-screen bg-[#EFEAE2] px-3 py-5">
      <div className="mx-auto w-full max-w-3xl rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg">

        <div className="h-2 bg-gradient-to-r " />

        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">
            Create Group
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Select at least 2 members
          </p>

          <input
            type="text"
            placeholder="Search people..."
            value={searchKeyword}
            onChange={handleSearch}
            className="
              mt-5
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500
              focus:bg-white
            "
          />
        </div>

        {/* Selected Members */}
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Selected Members
            </h2>

            <span className="text-sm text-slate-500">
              {selectedUsers.length} Selected
            </span>
          </div>

          {selectedUsers.length > 0? (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelect(user)}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-blue-100
                    px-3
                    py-2
                    text-sm
                    text-blue-700
                    hover:bg-blue-200
                    transition
                  "
                >
                  <img
                    src={
                      user.avatar?.url ||
                      "https://www.w3schools.com/w3images/avatar2.png"
                    }
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />

                  <span>{user.name}</span>

                  <span className="font-bold">×</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No members selected
            </p>
          )}
        </div>

        {/* Users */}
        <div className="max-h-[65vh] overflow-y-auto p-4">

          {filteredUsers.length > 0? (
            filteredUsers.map((user) => {

              const isOnline = onlineUsers.includes(user._id);

              const isSelected = selectedUsers.some(
                (u) => u._id === user._id
              );

              const avatarUrl =
                user.avatar?.url ||
                "https://www.w3schools.com/w3images/avatar2.png";

              return (
                <button
                  key={user._id}
                  onClick={() => handleSelect(user)}
                  className={`
                    mb-3
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    transition-all
                    duration-200
                    p-4

                    ${
                      isSelected
                       ? "border-slate-200 hover:bg-slate-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">

                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}

                    {isSelected && (
                      <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        ✓
                      </span>
                    )}

                  </div>

                  <div className="flex-1 text-left min-w-0">

                    <h2 className="truncate text-base font-semibold text-slate-900">
                      {user.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {isOnline? "Online" : "Offline"}
                    </p>

                  </div>

                </button>
              );
            })
          ) : (
            <div className="flex h-60 items-center justify-center">
              <p className="text-slate-400">
                No users found
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5 flex justify-end">

          <button
            onClick={handleNext}
            disabled={selectedUsers.length < 2}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white transition ${
              selectedUsers.length < 2
               ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            <IoArrowForward className="text-lg" />
          </button>

        </div>
      </div>
    </section>
  );
};

export default CreateGroup;