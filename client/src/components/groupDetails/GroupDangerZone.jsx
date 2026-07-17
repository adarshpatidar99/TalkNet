import React from "react";

const GroupDangerZone = ({
  group,
  setGroup,
  isAdmin,
  onLeaveGroup,
  onDeleteGroup,
}) => {
  return (
    <div className="w-full">

      <div className="space-y-3">

        {/* Leave Group Card */}
        {!isAdmin && (
          <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50 hover:shadow-md transition">
            
            <div className="flex items-center justify-between">
              
              <div>
                <h3 className="font-semibold text-yellow-700">
                  Leave Group
                </h3>
                <p className="text-xs text-yellow-600">
                  You will lose access to messages
                </p>
              </div>

              <button
                onClick={onLeaveGroup}
                className="px-4 py-2 rounded-xl bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition"
              >
                Leave
              </button>

            </div>

          </div>
        )}

        {/* Delete Group Card (Admin Only) */}
        {isAdmin && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-red-700">
                  Delete Group
                </h3>
                <p className="text-xs text-red-600">
                  Permanently delete this group & messages
                </p>
              </div>

              <button
                onClick={onDeleteGroup}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Delete
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default GroupDangerZone;