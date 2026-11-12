import React from "react";
import { FiLogOut, FiTrash2, FiAlertTriangle } from "react-icons/fi";

const GroupDangerZone = ({ group, setGroup, isAdmin, onLeaveGroup, onDeleteGroup }) => {
  return (
    <div className="w-full space-y-3">

      {/* Leave Group - Only for members */}
      {!isAdmin && (
        <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">
          <button
            onClick={onLeaveGroup}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-amber-50/60 transition group active:bg-amber-50 text-left"
          >
            <div className="h-10 w-10 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition shrink-0">
              <FiLogOut className="text-amber-700 text-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-medium text-amber-700 leading-tight">Leave group</p>
              <p className="text-[13px] text-slate-500 mt-0.5">You will lose access to messages</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center shrink-0 transition">
              <span className="text-amber-700 text-[14px]">›</span>
            </div>
          </button>
        </div>
      )}

      {/* Delete Group - Only for admin */}
      {isAdmin && (
        <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-red-50 flex items-center justify-center">
              <FiAlertTriangle className="text-red-600 text-[14px]" />
            </div>
            <h3 className="text-[13px] font-semibold tracking-wide uppercase text-slate-500">Danger zone</h3>
          </div>

          <button
            onClick={onDeleteGroup}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50/70 transition group active:bg-red-50 text-left"
          >
            <div className="h-10 w-10 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition shrink-0">
              <FiTrash2 className="text-red-600 text-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-medium text-red-600 leading-tight">Delete group</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Permanently delete group and all messages</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition">
              <span className="text-red-500 text-[14px]">›</span>
            </div>
          </button>

          <div className="px-5 py-3 bg-[#F8F9FB] border-t border-slate-100">
            <p className="text-[11px] leading-[14px] text-slate-500 text-center">
              This action cannot be undone. All members will be removed.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default GroupDangerZone;