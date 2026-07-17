import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GroupHeader from "../components/groupDetails/GroupHeader";
import GroupDescription from "../components/groupDetails/GroupDescription";
import GroupMember from "../components/groupDetails/GroupMember";
import GroupDangerZone from "../components/groupDetails/GroupDangerZone";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

const GroupDetails = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const { chatId } = useParams();
  const user = useSelector((state) => state.user.user);

  const isAdmin =
    group &&
    user &&
    String(group.groupAdmin?._id) === String(user?._id);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/chat/group/details/${chatId}`,
          { withCredentials: true }
        );

        setGroup(res.data.group);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGroup();
  }, [chatId]);

  const handleLeaveGroup = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/v1/chat/group/leave`,
        {
          data: {
            chatId: group?._id,
          },
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.log(
        "Some error occured while leaving group...",
        error
      );
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/chat/group/delete`,
        {
          data: {
            chatId: group._id,
          },
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.log(
        "Some error occurred while deleting group",
        error
      );
    }
  };

  if (!group) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#EFEAE2] px-2 py-4">
      <div className="mx-auto w-full max-w-3xl rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg">
       
        <div className="h-2 bg-gradient-to-r " />

        {/* Header */}
        <div className="p-6">
          <GroupHeader
            group={group}
            setGroup={setGroup}
            isAdmin={isAdmin}
          />
        </div>

        <div className="border-t border-slate-200" />

        {/* Description */}
        <div className="p-5">
          <GroupDescription
            group={group}
            setGroup={setGroup}
            isAdmin={isAdmin}
          />
        </div>

        <div className="border-t border-slate-200" />

        {/* Members */}
        <div className="p-6">
          <GroupMember
            group={group}
            setGroup={setGroup}
            isAdmin={isAdmin}
          />
        </div>

        {/* Danger Zone */}     
          <GroupDangerZone
            group={group}
            setGroup={setGroup}
            isAdmin={isAdmin}
            onLeaveGroup={handleLeaveGroup}
            onDeleteGroup={handleDeleteGroup}
          />
       
      </div>
    </section>
  );
};

export default GroupDetails;
