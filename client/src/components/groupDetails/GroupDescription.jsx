import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupDescription = ({ group, setGroup, isAdmin }) => {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Update local state whenever group changes
  useEffect(() => {
    setDescription(group?.description || "");
  }, [group]);

  console.log("isAdmin:", isAdmin);
console.log("groupAdmin:", group.groupAdmin);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/v1/chat/group/description",
        {
          chatId: group._id,
          description,
        },
        {
          withCredentials: true,
        }
      );

      // setGroup(res.data.group);

      setEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-3 mt-3">

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold">
          Group Description
        </h3>

        {isAdmin && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}

      </div>

      {!editing ? (
        <p className="mt-3 text-slate-600">
          {group.description || "No description added."}
        </p>
      ) : (
        <>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="
              mt-3
              w-full
              rounded-lg
              border
              p-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <div className="mt-4 flex gap-3">

            <button
              onClick={() => {
                setEditing(false);
                setDescription(group.description || "");
              }}
              className="
                px-4
                py-2
                rounded-lg
                bg-gray-200
              "
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="
                px-4
                py-2
                rounded-lg
                bg-blue-600
                text-white
              "
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        </>
      )}

    </div>
  );
};

export default GroupDescription;