import React from "react";
import { IoClose } from "react-icons/io5";

const RenameGroupModal = ({ groupName, setGroupName, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[12px] p-0 sm:p-4">

      <div className="w-full sm:w-[400px] bg-white rounded-t-[28px] sm:rounded-[24px] shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease]">

        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[19px] font-semibold text-slate-900">
            Rename group
          </h2>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-[#F1F2F5] hover:bg-slate-200 flex items-center justify-center text-slate-600 transition active:scale-95">
            <IoClose className="text-[20px]" />
          </button>
        </div>

        <div className="px-5 pb-6">
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              maxLength={40}
              className="w-full bg-[#F1F2F5] focus:bg-white border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-[14px] px-4 py-[14px] text-[17px] text-slate-900 placeholder:text-slate-500 outline-none transition-all"
            />
            <span className="absolute -bottom-6 right-1 text-[11px] text-slate-400">
              {groupName.length}/40
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#F8F9FB] border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-full bg-white border border-slate-200 text-[15px] font-medium text-slate-700 hover:bg-slate-50 transition active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!groupName.trim()}
            className="flex-1 h-[48px] rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white text-[15px] font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98] shadow-[0_6px_18px_rgba(37,99,235,0.35)]"
          >
            Save
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default RenameGroupModal;