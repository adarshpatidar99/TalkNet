import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addChat } from "../features/chat/chatSlice";
import { FiCamera } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

const CreateGroupDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedUsers = location.state?.selectedUsers || [];

  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupImage, setGroupImage] = useState(null);

  const userIds = selectedUsers.map((user) => user._id);

  const handleGroupCreate = async () => {
    if (!groupName.trim()) {
      setGroupNameError("Group name is required");
      return;
    }
    setGroupNameError("");
    if (selectedUsers.length === 0) {
      toast.error("Please select users");
      return;
    }
    setCreatingGroup(true);
    try {
      const formData = new FormData();
      formData.append("groupName", groupName);
      if (groupImage) formData.append("groupImage", groupImage);
      formData.append("userIds", JSON.stringify(userIds));
      const response = await axios.post(`${API_URL}/api/v1/chat/group`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(addChat(response.data.groupChat));
      toast.success("New Group Created");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#EFEAE2]">
      <div className="mx-auto w-full max-w-[520px] min-h-screen bg-[#EFEAE2] flex flex-col">

        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/60">
          <div className="flex items-center justify-between px-4 h-[64px]">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <IoArrowBack className="text-[24px] text-slate-800" />
              </button>
              <div>
                <h2 className="text-[19px] font-semibold text-slate-900 leading-none">New group</h2>
                <p className="text-[13px] text-slate-500 mt-1">Add group details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-3">

          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 p-7">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 rounded-full blur-[12px] opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative">
                  <img
                    src={groupImage? URL.createObjectURL(groupImage) : "https://cdn-icons-png.flaticon.com/512/681/681494.png"}
                    alt="group"
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-[3px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  />
                  <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
                    <FiCamera className="text-[18px]" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setGroupImage(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <p className="mt-4 text-[14px] font-medium text-slate-500">Tap to add group icon</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 p-6">
            <label className="text-[13px] font-semibold tracking-wide text-slate-400 uppercase">Group Name</label>
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="e.g. Design Team, Family"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (groupNameError) setGroupNameError("");
                }}
                className={`w-full bg-[#F8F9FB] border rounded-xl px-4 py-[14px] text-[17px] text-slate-900 placeholder:text-slate-400 outline-none transition-all
                  ${groupNameError? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
              />
              <div className="mt-2 flex justify-between">
                <div>
                  {groupNameError && <p className="text-[13px] text-red-500 font-medium">{groupNameError}</p>}
                </div>
                <p className="text-[12px] text-slate-400">{groupName.length}/50</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold tracking-wide text-slate-400 uppercase">Participants</h3>
              <span className="bg-slate-900 text-white text-[12px] font-bold px-2.5 py-1 rounded-full">{selectedUsers.length}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {selectedUsers.map((user) => (
                <div key={user._id} className="flex flex-col items-center group">
                  <div className="relative">
                    <img
                      src={user.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"}
                      alt={user.name}
                      className="h-14 w-14 sm:h-[60px] sm:w-[60px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="mt-2 max-w-[64px] truncate text-center text-[12.5px] font-medium text-slate-700 leading-tight">
                    {user.name.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-[#EFEAE2] via-[#EFEAE2] to-transparent pt-4 pb-6 px-4 mt-2">
          <button
            onClick={handleGroupCreate}
            disabled={creatingGroup}
            className="w-full h-[52px] rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white text-[17px] font-semibold shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.45)] hover:scale-[0.98] active:scale-[0.96] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {creatingGroup? <Spinner /> : `Create group • ${selectedUsers.length} members`}
          </button>
          <p className="text-center text-[12px] text-slate-500 mt-3">Members can be added later</p>
        </div>

      </div>
    </section>
  );
};

export default CreateGroupDetails;