// import React, { useState } from "react";
// import axios from "axios";
// import AddMemberModal from "./AddMemberModal";

// const GroupMember = ({ group, setGroup, isAdmin }) => {
//   const [loading, setLoading] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);


//   console.log("GroupMember isAdmin:", isAdmin);

//   const handleRemoveMember = async (memberId) => {
//     try {
//       setLoading(true);

//       const res = await axios.put(
//         "http://localhost:5000/api/v1/chat/group/remove",
//         {
//           chatId: group._id,
//           userId: memberId,
//         },
//         {
//           withCredentials: true,
//         }
//       );

//       setGroup(res.data.group);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-5 mt-5">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-5">
//         <h3 className="text-lg font-semibold">
//           Group Members ({group?.participants?.length || 0})
//         </h3>

//         {isAdmin && (
//           <button
//             onClick={() => setOpenAddModal(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             + Add
//           </button>
//         )}
//       </div>

//       {/* Members */}
//       <div className="space-y-3">

//         {group?.participants?.map((member) => (
//           <div
//             key={member._id}
//             className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition"
//           >

//             {/* Left */}
//             <div className="flex items-center gap-3">

//               <img
//                 src={
//                   member?.avatar?.url ||
//                   "https://i.pravatar.cc/150"
//                 }
//                 alt={member.name}
//                 className="w-11 h-11 rounded-full object-cover"
//               />

//               <div>
//                 <div className="flex items-center gap-2">

//                   <p className="font-medium">
//                     {member.name}
//                   </p>

//                   {group?.groupAdmin?._id === member._id && (
//                     <span className="text-xs bg-yellow-400 px-2 py-1 rounded-full">
//                       Admin 
//                     </span>
//                   )}

//                 </div>

//                 <p className="text-sm text-gray-500">
//                   {member.email}
//                 </p>
//               </div>

//             </div>

//             {/* Right */}
//             {isAdmin &&
//               group?.groupAdmin?._id !== member._id && (
//                 <button
//                   disabled={loading}
//                   onClick={() =>
//                     handleRemoveMember(member._id)
//                   }
//                   className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
//                 >
//                   {loading ? "Removing..." : "Remove"}
//                 </button>
//               )}

//           </div>
//         ))}

//       </div>

//       {/* Add Member Modal */}
//       {openAddModal && (
//         <AddMemberModal
//           group={group}
//           setGroup={setGroup}
//           open={openAddModal}
//           onClose={() => setOpenAddModal(false)}
//         />
//       )}

//     </div>
//   );
// };

// export default GroupMember;





import React, { useState } from "react";
import axios from "axios";
import AddMemberModal from "./AddMemberModal";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";

const GroupMember = ({ group, setGroup, isAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleRemoveMember = async (memberId) => {
    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/v1/chat/group/remove",
        {
          chatId: group._id,
          userId: memberId,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(res.data);

      // setGroup(res.data.group);

      console.log("See Data...", res.data.chat);

if (res.data.chat) {
  setGroup(res.data.chat);
}

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-lg font-semibold text-slate-800">
          Group Members ({group?.participants?.length || 0})
        </h3>

        {isAdmin && (
          <button
            onClick={() => setOpenAddModal(true)}
            title="Add Member"      
            className="
              w-10
              h-10
              rounded-full
              bg-gradient-to-r
              from-slate-900
              via-blue-600
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shadow-md
              hover:scale-105
              transition
            "
          >
            <FiUserPlus size={18} />
          </button>
        )}

      </div>

      {/* Members */}
      <div className="space-y-3">

        {group?.participants?.map((member) => (
          <div
            // key={member._id}
             key={member._id || member.email}
            className="
              flex
              items-center
              justify-between
              p-3
              rounded-xl                                     
              border
              border-slate-200
              hover:bg-slate-50
              transition
            "
          >

            {/* Left */}
            <div className="flex items-center gap-3">

              <img
                src={
                  member?.avatar?.url ||
                  "https://i.pravatar.cc/150"
                }
                alt={member.name}
                className="w-11 h-11 rounded-full object-cover"
              />

              <div>

                <div className="flex items-center gap-2">

                  <p className="font-medium text-slate-800">
                    {member.name}
                  </p>

                  {group?.groupAdmin?._id === member._id && (
                    <span
                      className="
                        text-xs
                        bg-yellow-100
                        text-yellow-700
                        px-2
                        py-1
                        rounded-full
                      "
                    >
                      Admin
                    </span>
                  )}

                </div>

                <p className="text-sm text-slate-500">
                  {member.email}
                </p>

              </div>

            </div>

            {/* Right */}
            {isAdmin &&     
              group?.groupAdmin?._id !== member._id && (
                <button
                  title="Remove Member"
                  disabled={loading}
                  onClick={() =>
                    handleRemoveMember(member._id)
                  }
                  className="
                    w-9 
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-red-600
                    hover:bg-red-100
                    hover:text-red-700
                    transition
                    disabled:opacity-50
                  "
                >
                  <FiUserMinus size={18} />
                </button>
              )}

          </div>
        ))}

      </div>

      {/* Add Member Modal */}
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