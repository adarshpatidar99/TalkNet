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
        const res = await axios.get(`${API_URL}/api/v1/user/`, { withCredentials: true });
        setAllUsers(res.data.users || []);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, [open]);

  if (!open) return null;

  const availableUsers = allUsers.filter(
    (user) =>!group?.participants?.some((member) => member._id === user._id)
  );
  const filteredUsers = availableUsers.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)? prev.filter((u) => u._id!== user._id) : [...prev, user]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    try {
      setAddingUser(true);
      let updatedGroup = group;
      for (let i = 0; i < selectedUsers.length; i++) {
        const res = await axios.put(`${API_URL}/api/v1/chat/group/add`,
          { chatId: group._id, userId: selectedUsers[i]._id },
          { withCredentials: true }
        );
        updatedGroup = res.data.chat || res.data.group;
      }
      setGroup(updatedGroup);
      onClose();
    } catch (error) { console.log(error); }
    finally { setAddingUser(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[12px] z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">

      <div className="bg-white w-full sm:max-w-[480px] rounded-t-[28px] sm:rounded-[24px] shadow-[0_-12px_48px_rgba(0,0,0,0.18)] sm:shadow-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease]">

        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-[19px] font-semibold text-slate-900 leading-tight">Add members</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {selectedUsers.length === 0? `${availableUsers.length} contacts` : `${selectedUsers.length} selected`}
            </p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-[#F1F2F5] hover:bg-slate-200 flex items-center justify-center text-slate-600 transition active:scale-95 shrink-0">
            <IoClose className="text-[20px]" />
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="px-4 py-3 border-b border-slate-100 bg-[#F8F9FB] shrink-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {selectedUsers.map((u) => (
                <button key={u._id} onClick={() => toggleUser(u)} className="flex items-center gap-2 bg-[#E7F0FF] border border-blue-200/60 rounded-full pl-1 pr-2.5 py-1 shrink-0 active:scale-95">
                  <img src={u?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} className="h-6 w-6 rounded-full object-cover" />
                  <span className="text-[13px] font-medium text-blue-700 max-w-[80px] truncate">{u.name.split(" ")[0]}</span>
                  <span className="text-blue-600 font-bold text-[14px]">×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-3 shrink-0">
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-[#F1F2F5] border border-transparent rounded-full pl-11 pr-4 py-[12px] text-[16px] text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loading? (
            <div className="flex flex-col items-center py-16">
              <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
              <p className="text-[14px] text-slate-500 mt-3">Loading contacts...</p>
            </div>
          ) : filteredUsers.length === 0? (
            <p className="text-center py-16 text-[15px] text-slate-400">No users found</p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUsers.some((u) => u._id === user._id);
              return (
                <button
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/80 transition text-left active:bg-slate-100 ${isSelected? "bg-[#F0F6FF]" : ""}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <img src={user?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} className="h-[52px] w-[52px] rounded-full object-cover shrink-0" alt={user.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-medium text-slate-900 truncate leading-tight">{user.name}</p>
                      <p className="text-[13px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all ${isSelected? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                    {isSelected && <IoCheckmark className="text-white text-[14px]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0 || addingUser}
            className={`w-full h-[52px] rounded-full text-[17px] font-semibold flex items-center justify-center transition-all active:scale-[0.98]
              ${selectedUsers.length === 0? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]"}`}
          >
            {addingUser? "Adding..." : `Add ${selectedUsers.length>0? `(${selectedUsers.length})` : ""}`}
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default AddMemberModal;