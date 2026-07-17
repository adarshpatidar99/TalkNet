import React, { useEffect, useState } from "react";
import axios from "axios";

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

      const res = await axios.put(
        `${API_URL}/api/v1/chat/group/description`,
        {
          chatId: group?._id,
          description,
        },
        { withCredentials: true }
      );

      setGroup((prev) => ({
        ...prev,
        description,
      }));

      setEditing(false);
    } catch (err) {
      console.log("Update description error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-700">
          Group Description
        </h3>

        {isAdmin && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>

      {/* VIEW MODE */}
      {!editing ? (
        <p className="text-sm text-slate-600 leading-relaxed min-h-[40px]">
          {group?.description || "No description added yet."}
        </p>
      ) : (
        <div className="space-y-3">

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="
              w-full
              rounded-xl
              border border-slate-300
              bg-slate-50
              p-3
              text-sm
              outline-none
              focus:border-blue-500
              focus:bg-white
              transition
            "
          />

          <div className="flex justify-end gap-2">

            <button
              onClick={() => {
                setEditing(false);
                setDescription(group?.description || "");
              }}
              className="px-4 py-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDescription;