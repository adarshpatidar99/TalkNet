import React from "react";
import { IoClose } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";

const RenameGroupModal = ({
  groupName,
  setGroupName,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      {/* Modal */}
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiEdit2 className="text-blue-600 text-lg" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Rename Group
              </h2>

              <p className="text-sm text-slate-500">
                Update your group name
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
          >
            <IoClose className="text-2xl text-slate-600" />
          </button>

        </div>

        {/* Body */}
        <div className="px-6 py-6">

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              transition
            "
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">

          <button
            onClick={onClose}
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-slate-300
              text-slate-700
              hover:bg-slate-100
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={!groupName.trim()}
            className="
              px-6
              py-2.5
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
              font-semibold
              hover:shadow-lg
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
};

export default RenameGroupModal;