import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUsers, FaCamera } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import axios from "axios";
import { FiCamera } from "react-icons/fi";

import RenameGroupModal from "./RenameGroupModal";
import ImageUpdateGroupModal from "./ImageUpdateGroupModal";

const API_URL = import.meta.env.VITE_API_URL;

const GroupHeader = ({ group, isAdmin, setGroup }) => {
  const navigate = useNavigate();

  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [groupName, setGroupName] = useState(group.chatName);

  const [groupImage, setGroupImage] = useState(group.groupImage);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    setGroupImage(group.groupImage);
  }, [group.groupImage]);

  useEffect(() => {
    setGroupName(group.chatName);
  }, [group.chatName]);

  const handleRenameGroup = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/v1/chat/group/rename`,
        {
          chatId: group._id,
          name: groupName,
        },
        {
          withCredentials: true,
        }
      );

      setGroup(res.data.chat);
      setOpenRenameModal(false);
    } catch (error) {
      console.log("Some error occured", error);
    }
  };

  const handleUpdateGroupImage = async () => {
    try {
      if (!selectedFile) return;

      setIsUploading(true);

      const formData = new FormData();

      formData.append("chatId", group._id);
      formData.append("groupImage", selectedFile);

      const response = await axios.put(
         `${API_URL}/api/v1/chat/group/image`
        ,
        formData,
        {
          withCredentials: true,
        }
      );

      setGroup(response.data.chat);

      setSelectedFile(null);
      setOpenImageModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full">

      <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 h-25 rounded-2xl relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <IoArrowBack className="text-white text-xl" />
        </button>

        <h2 className="absolute top-5 left-16 text-white font-semibold text-lg">
          Group Profile
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg -mt-14 p-6 flex flex-col items-center text-center">
       
          <div className="relative w-28 h-28">

  <img
    src={
      group.groupImage ||
      "https://cdn-icons-png.flaticon.com/512/681/681494.png"
    }
    alt="Group"
    className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
  />

  {isAdmin && (
    <button
      onClick={() => setOpenImageModal(true)}
      className="
        absolute
        -bottom-1
        -right-1
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        bg-gradient-to-r
        from-slate-900
        via-blue-600
        to-indigo-600
        text-white
        shadow-xl
        border-white
        transition-all
        duration-200
        hover:scale-110
      "
    >
      <FiCamera size={18} />
    </button>
  )}


          

          {openImageModal && (
            <ImageUpdateGroupModal
              groupImage={groupImage}
              isUploading={isUploading}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setGroupImage={setGroupImage}
              onClose={() => setOpenImageModal(false)}
              onSave={handleUpdateGroupImage}
            />
          )}
        </div>

        {/* Name */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <h1 className="text-xl font-bold text-slate-900">
            {group.chatName}
          </h1>

          {isAdmin && (
            <button
              onClick={() => setOpenRenameModal(true)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            >
              <FiEdit2 className="text-slate-600 hover:text-blue-600 text-lg" />
            </button>
          )}

          {openRenameModal && (
            <RenameGroupModal
              groupName={groupName}
              setGroupName={setGroupName}
              onClose={() => setOpenRenameModal(false)}
              onSave={handleRenameGroup}
            />
          )}
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mt-2 text-slate-600">
          <FaUsers />

          <span className="text-sm font-medium">
            {group.participants.length} Members
          </span>
        </div>

        <div className="w-full border-t my-4"></div>

        <div className="flex justify-between w-full text-sm text-slate-500">
          <span>Group Chat</span>

          <span>
            {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </section>
  );
};

export default GroupHeader;