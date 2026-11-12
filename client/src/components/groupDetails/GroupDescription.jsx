import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit3 } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const GroupDescription = ({ group, setGroup, isAdmin }) => {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescription(group?.description || "");
  }, [group]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/v1/chat/group/description`,
        { chatId: group?._id, description },
        { withCredentials: true }
      );
      setGroup((prev) => ({...prev, description }));
      setEditing(false);
    } catch (err) {
      console.log("Update description error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">

      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">
            Description
          </h3>
          <p className="text-[13px] text-slate-500 mt-0.5">
            About this group
          </p>
        </div>

        {isAdmin &&!editing && (
          <button
            onClick={() => setEditing(true)}
            className="h-9 w-9 rounded-full bg-[#F1F2F5] hover:bg-[#E7F0FF] hover:text-blue-600 border border-transparent hover:border-blue-200/60 flex items-center justify-center text-slate-600 transition active:scale-95"
            title="Edit description"
          >
            <FiEdit3 size={18} />
          </button>
        )}
      </div>

      <div className="px-5 py-4">
        {!editing? (
          <>
            {group?.description? (
              <p className="text-[15px] leading-[22px] text-slate-700 whitespace-pre-wrap break-words">
                {group.description}
              </p>
            ) : (
              <div className="py-2">
                <p className="text-[15px] text-slate-400">
                  No description yet.
                </p>
                {isAdmin && (
                  <p className="text-[13px] text-slate-500 mt-1">
                    Tap edit to add a description for your group.
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Write group description..."
                autoFocus
                className="w-full rounded-[14px] border border-slate-200 bg-[#F8F9FB] p-4 text-[16px] leading-[22px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-slate-200">
                {description.length}/500
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                onClick={() => {
                  setEditing(false);
                  setDescription(group?.description || "");
                }}
                className="h-[42px] px-5 rounded-full text-[15px] font-medium bg-[#F1F2F5] hover:bg-slate-200 text-slate-700 transition active:scale-95"
              >
                Cancel
              </button>

              <button
                disabled={loading || description.trim() === (group?.description || "")}
                onClick={handleSave}
                className="h-[42px] px-6 rounded-full text-[15px] font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:opacity-95 disabled:opacity-50 disabled:shadow-none transition active:scale-95 flex items-center justify-center"
              >
                {loading? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDescription;