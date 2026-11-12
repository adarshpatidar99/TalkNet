import React, { useState } from "react";
import axios from "axios";
import AddMemberModal from "./AddMemberModal";
import {
  FiUserPlus,
  FiUserMinus,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const GroupMember = ({ group, setGroup, isAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const navigate = useNavigate();

  const handleRemoveMember = async (memberId) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/api/v1/chat/group/remove`,
        {
          chatId: group._id,
          userId: memberId,
        },
        { withCredentials: true }
      );

      if (res.data.chat) {
        setGroup(res.data.chat);
      }
    } catch (error) {
      console.error("Remove member error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransferAdmin = async (memberId, memberName) => {
    const confirmed = window.confirm(
      `Are you sure you want to transfer group admin rights to ${memberName}? You will lose admin privileges.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/api/v1/chat/transfer-admin`,
        {
          chatId: group._id,
          newAdminId: memberId,
        },
        { withCredentials: true }
      );

      if (res.data.chat) {
        setGroup(res.data.chat);
      }

      alert("Group admin transferred successfully.");
    } catch (error) {
      console.error("Admin transfer error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to transfer group admin."
      );
    } finally {
      setLoading(false);
    }
  };

  const openProfileDetails = (memberId) => {
    navigate(`/user-profile/${memberId}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">
              Members
            </h3>

            <p className="text-[13px] text-slate-500 mt-0.5">
              {group?.participants?.length || 0} members
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setOpenAddModal(true)}
              disabled={loading}
              className="h-10 w-10 rounded-full bg-[#E7F0FF] hover:bg-[#D6E7FF] border border-blue-200/60 text-blue-600 flex items-center justify-center transition active:scale-95 disabled:opacity-50"
              title="Add Member"
            >
              <FiUserPlus size={20} />
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
          {group?.participants?.map((member) => {
            const isGroupAdmin =
              String(group?.groupAdmin?._id) ===
              String(member._id);

            const avatarUrl =
              member?.avatar?.url ||
              "https://www.w3schools.com/w3images/avatar2.png";

            return (
              <div
                key={member._id || member.email}
                onClick={() => openProfileDetails(member._id)}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/80 transition cursor-pointer group active:bg-slate-100"
              >
                {/* Left */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <img
                    src={avatarUrl}
                    alt={member.name}
                    className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[17px] font-medium text-slate-900 truncate leading-tight">
                        {member.name}
                      </p>

                      {isGroupAdmin && (
                        <span className="shrink-0 text-[11px] font-semibold tracking-wide bg-[#FFF8E1] text-[#B68A00] border border-amber-200/60 px-2.5 py-1 rounded-full">
                          ADMIN
                        </span>
                      )}
                    </div>

                    <p className="text-[14px] text-slate-500 mt-0.5 truncate">
                      {isGroupAdmin
                        ? "Group admin"
                        : "Member"}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                {isAdmin && !isGroupAdmin && (
                  <div className="ml-3 flex items-center gap-2 shrink-0">

                    <button
                      type="button"
                      disabled={loading}
                      title="Transfer Admin"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleTransferAdmin(
                          member._id,
                          member.name
                        );
                      }}
                      className="h-9 w-9 rounded-full flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition active:scale-90 disabled:opacity-50"
                    >
                      <FiShield size={19} />
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      title="Remove Member"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleRemoveMember(member._id);
                      }}
                      className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition active:scale-90 disabled:opacity-50"
                    >
                      <FiUserMinus size={20} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {isAdmin && (
          <div className="px-5 py-3 bg-[#F8F9FB] border-t border-slate-100">
            <p className="text-[12px] text-slate-500 text-center">
              Tap member to view profile • Only admin can manage members
            </p>
          </div>
        )}
      </div>

      {openAddModal && (
        <AddMemberModal
          group={group}
          setGroup={setGroup}
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default GroupMember;