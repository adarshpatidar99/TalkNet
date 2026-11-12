import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FiEdit2, FiCamera } from "react-icons/fi";
import axios from "axios";
import RenameGroupModal from "./RenameGroupModal";
import ImageUpdateGroupModal from "./ImageUpdateGroupModal";

const API_URL = import.meta.env.VITE_API_URL;

const GroupHeader = ({ group, isAdmin, setGroup }) => {
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [groupName, setGroupName] = useState(group.chatName);
  const [groupImage, setGroupImage] = useState(group.groupImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => { setGroupImage(group.groupImage); }, [group.groupImage]);
  useEffect(() => { setGroupName(group.chatName); }, [group.chatName]);

  const handleRenameGroup = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/v1/chat/group/rename`,
        { chatId: group._id, name: groupName }, { withCredentials: true });
      setGroup(res.data.chat);
      setOpenRenameModal(false);
    } catch (e) { console.log(e); }
  };

  const handleUpdateGroupImage = async () => {
    try {
      if (!selectedFile) return;
      setIsUploading(true);
      const formData = new FormData();
      formData.append("chatId", group._id);
      formData.append("groupImage", selectedFile);
      const res = await axios.put(`${API_URL}/api/v1/chat/group/image`, formData, { withCredentials: true });
      setGroup(res.data.chat);
      setSelectedFile(null);
      setOpenImageModal(false);
    } catch (e) { console.log(e); }
    finally { setIsUploading(false); }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="relative">
        <div className="relative w-[104px] h-[104px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900 via-blue-600 to-indigo-600 blur-[18px] opacity-20" />
          <img
            src={group.groupImage || "https://cdn-icons-png.flaticon.com/512/681/681494.png"}
            alt="Group"
            className="relative w-full h-full rounded-full object-cover border-[4px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          />
          {isAdmin && (
            <button onClick={() => setOpenImageModal(true)} className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-lg border-2 border-white flex items-center justify-center active:scale-95 hover:opacity-95 transition shadow-[0_4px_12px_rgba(37,99,235,0.35)]">
              <FiCamera size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <h1 className="text-[22px] font-bold text-slate-900 leading-tight truncate max-w-[220px]">{group.chatName}</h1>
        {isAdmin && (
          <button onClick={() => setOpenRenameModal(true)} className="h-8 w-8 rounded-full bg-[#F1F2F5] hover:bg-[#E7F0FF] flex items-center justify-center text-slate-500 hover:text-blue-600 transition">
            <FiEdit2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="h-6 w-6 rounded-full bg-[#F1F2F5] flex items-center justify-center">
          <FaUsers className="text-slate-500 text-[12px]" />
        </div>
        <span className="text-[14px] font-medium text-slate-600">{group.participants.length} members</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="text-[13px] text-slate-500">Group • {new Date(group.createdAt).toLocaleDateString()}</span>
      </div>

      {openImageModal && (
        <ImageUpdateGroupModal groupImage={groupImage} isUploading={isUploading} selectedFile={selectedFile} setSelectedFile={setSelectedFile} setGroupImage={setGroupImage} onClose={() => setOpenImageModal(false)} onSave={handleUpdateGroupImage} />
      )}
      {openRenameModal && (
        <RenameGroupModal groupName={groupName} setGroupName={setGroupName} onClose={() => setOpenRenameModal(false)} onSave={handleRenameGroup} />
      )}
    </div>
  );
};

export default GroupHeader;