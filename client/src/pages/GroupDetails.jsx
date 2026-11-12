import socket from "../components/socket/socket";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GroupHeader from "../components/groupDetails/GroupHeader";
import GroupDescription from "../components/groupDetails/GroupDescription";
import GroupMember from "../components/groupDetails/GroupMember";
import GroupDangerZone from "../components/groupDetails/GroupDangerZone";
import { useSelector } from "react-redux";
import { IoArrowBack } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

const GroupDetails = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const { chatId } = useParams();
  const user = useSelector((state) => state.user.user);
  const isAdmin = group && user && String(group.groupAdmin?._id) === String(user?._id);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/chat/group/details/${chatId}`, { withCredentials: true });
        setGroup(res.data.group);
      } catch (err) { console.log(err); }
    };
    fetchGroup();
  }, [chatId]);


useEffect(() => {
  if (!socket || !chatId) return;

  const handleAdminTransferred = (updatedChat) => {
    if (String(updatedChat?._id) !== String(chatId)) {
      return;
    }

    setGroup(updatedChat);
  };

  socket.on("groupAdminTransferred", handleAdminTransferred);

  return () => {
    socket.off("groupAdminTransferred", handleAdminTransferred);
  };
}, [chatId]);


  const handleLeaveGroup = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/chat/group/leave`, { data: { chatId: group?._id }, withCredentials: true });
      navigate("/");
    } catch (error) { console.log(error); }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/chat/group/delete`, { data: { chatId: group._id }, withCredentials: true });
      navigate("/");
    } catch (error) { console.log(error); }
  };

  if (!group) {
    return <div className="min-h-screen flex justify-center items-center bg-[#F6F7F9]"><p className="text-slate-600">Loading...</p></div>;
  }

  return (
    <section className="min-h-screen bg-[#F6F7F9]">
      <div className="mx-auto w-full max-w-[600px] min-h-screen bg-[#F6F7F9] flex flex-col">

        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3">
            <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition active:scale-95">
              <IoArrowBack className="text-[24px] text-slate-800" />
            </button>
            <h2 className="text-[19px] font-semibold text-slate-900">Group info</h2>
          </div>
        </div>

        <div className="flex-1 p-3 sm:p-4 space-y-3 pb-8">
     
          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 p-6">
            <GroupHeader group={group} setGroup={setGroup} isAdmin={isAdmin} />
          </div>

          <GroupDescription group={group} setGroup={setGroup} isAdmin={isAdmin} />
          <GroupMember group={group} setGroup={setGroup} isAdmin={isAdmin} />
          <GroupDangerZone group={group} setGroup={setGroup} isAdmin={isAdmin} onLeaveGroup={handleLeaveGroup} onDeleteGroup={handleDeleteGroup} />
        </div>
      </div>
    </section>
  );
};

export default GroupDetails;