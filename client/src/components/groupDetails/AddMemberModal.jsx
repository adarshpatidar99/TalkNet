import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose, IoSearch, IoCheckmark } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

const AddMemberModal = ({ group, setGroup, open, onClose }) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!open) return;

    setSelectedUsers([]);
    setSearch("");

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/v1/user/`,
          { withCredentials: true }
        );

        setAllUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open]);

  if (!open) return null;

  const availableUsers = allUsers.filter(
    (user) =>
      !group?.participants?.some(
        (member) => member._id === user._id
      )
  );

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setAddingUser(true);

      let updatedGroup = group;

      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];

        const res = await axios.put(
          `${API_URL}/api/v1/chat/group/add`,
          {
            chatId: group._id,
            userId: user._id,
          },
          { withCredentials: true }
        );

        updatedGroup = res.data.chat || res.data.group;
      }

      setGroup(updatedGroup);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">

      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-[480px] max-h-[85vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Members
            </h2>
            <p className="text-sm text-slate-500">
              {selectedUsers.length} selected
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <IoClose />
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl">
            <IoSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto px-2">

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-10">No users</p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUsers.some(
                (u) => u._id === user._id
              );

              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <img
                      src={user?.avatar?.url}
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {isSelected && <IoCheckmark />}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={handleAddMembers}
            disabled={addingUser}
            className="w-full py-3 bg-blue-600 text-white rounded-xl"
          >
            {addingUser ? "Adding..." : "Add Members"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMemberModal;