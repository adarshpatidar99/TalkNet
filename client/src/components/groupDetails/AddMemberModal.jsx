// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { IoClose } from "react-icons/io5";
// import { IoSearch } from "react-icons/io5";

// const AddMemberModal = ({
//   group,
//   setGroup,
//   open,
//   onClose,
// }) => {
//   const [search, setSearch] = useState("");
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [addingUser, setAddingUser] = useState(null);

//   useEffect(() => {
//     if (!open) return;

//     const fetchUsers = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(
//           "http://localhost:5000/api/v1/user/",
//           {
//             withCredentials: true,
//           }
//         );

//         setAllUsers(res.data.users);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [open]);

//   if (!open) return null;

//   const availableUsers = allUsers.filter(
//     (user) =>
//       !group.participants.some(
//         (member) => member._id === user._id
//       )
//   );

//   const filteredUsers = availableUsers.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAddMember = async (userId) => {
//     try {
//       setAddingUser(userId);

//       const res = await axios.put(
//         "http://localhost:5000/api/v1/chat/group/add",
//         {
//           chatId: group._id,
//           userId,
//         },
//         {
//           withCredentials: true,
//         }
//       );

//       setGroup(res.data.group);
//       onClose();
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setAddingUser(null);
//     }
//   };


   
  
// // return (
// //   <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">

// //     <div className="w-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl">

// //       {/* HEADER */}

// //       <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 relative">

// //         <h2 className="text-2xl font-bold">
// //           Add New Members
// //         </h2>

// //         <p className="text-sm text-blue-100 mt-1">
// //           Invite people into your group.
// //         </p>

// //         <button
// //           onClick={onClose}
// //           className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
// //         >
// //           <IoClose size={22} />
// //         </button>

// //       </div>

// //       {/* SEARCH */}

// //       <div className="px-6 py-5">

// //         <div className="flex items-center bg-slate-100 rounded-2xl px-4">

// //           <IoSearch className="text-gray-500 text-xl" />

// //           <input
// //             type="text"
// //             placeholder="Search people..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="w-full bg-transparent py-4 px-3 outline-none"
// //           />

// //         </div>

// //       </div>

// //       {/* USER LIST */}

// //       <div className="px-6 pb-6 max-h-[420px] overflow-y-auto">

// //         {loading ? (

// //           <div className="text-center py-12">
// //             Loading...
// //           </div>

// //         ) : filteredUsers.length === 0 ? (

// //           <div className="text-center py-12 text-gray-500">
// //             No users found
// //           </div>

// //         ) : (

// //           <div className="space-y-4">

// //             {filteredUsers.map((user) => (

// //               <div
// //                 key={user._id}
// //                 className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
// //               >

// //                 <div className="flex items-center gap-4">

// //                   <img
// //                     src={
// //                       user?.avatar?.url ||
// //                       "https://i.pravatar.cc/150"
// //                     }
// //                     className="w-14 h-14 rounded-full object-cover"
// //                   />

// //                   <div>

// //                     <h3 className="font-semibold text-lg">
// //                       {user.name}
// //                     </h3>

// //                     <p className="text-sm text-gray-500">
// //                       {user.email}
// //                     </p>

// //                   </div>

// //                 </div>

// //                 <button
// //                   disabled={addingUser === user._id}
// //                   onClick={() => handleAddMember(user._id)}
// //                   className="
// //                     w-12
// //                     h-12
// //                     rounded-full
// //                     bg-green-500
// //                     hover:bg-green-600
// //                     text-white
// //                     text-2xl
// //                     flex
// //                     items-center
// //                     justify-center
// //                     transition
// //                   "
// //                 >
// //                   {addingUser === user._id ? "..." : "+"}
// //                 </button>

// //               </div>

// //             ))}

// //           </div>

// //         )}

// //       </div>

// //     </div>

// //   </div>
// // );



// return (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//     <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[480px] max-h-[85vh] flex flex-col border border-white/20">

//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-5">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800">Add Members</h2>
//           <p className="text-sm text-slate-500 mt-0.5">
//             {selectedUsers.length} selected
//           </p>
//         </div>
//         <button
//           onClick={onClose}
//           className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
//         >
//           <IoClose className="text-xl text-slate-600" />
//         </button>
//       </div>

//       {/* Selected chips */}
//       {selectedUsers.length > 0 && (
//         <div className="px-4 pb-3 flex flex-wrap gap-2 border-b border-slate-100">
//           {selectedUsers.map((user) => (
//             <div
//               key={user._id}
//               className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm"
//             >
//               <span>{user.name}</span>
//               <button onClick={() => toggleUser(user)}>
//                 <IoClose className="text-xs" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search */}
//       <div className="px-4 py-3">
//         <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-blue-400 transition">
//           <IoSearch className="text-slate-400 text-lg" />
//           <input
//             type="text"
//             placeholder="Search by name or email"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
//           />
//         </div>
//       </div>

//       {/* Users */}
//       <div className="flex-1 overflow-y-auto px-2">
//         {loading? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
//             <p className="text-slate-500 text-sm">Loading users...</p>
//           </div>
//         ) : filteredUsers.length === 0? (
//           <div className="text-center py-16">
//             <p className="text-slate-400">No users found</p>
//           </div>
//         ) : (
//           filteredUsers.map((user) => {
//             const isSelected = selectedUsers.some(u => u._id === user._id);
//             return (
//               <div
//                 key={user._id}
//                 onClick={() => toggleUser(user)}
//                 className={`flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-xl cursor-pointer transition ${
//                   isSelected? 'bg-blue-50' : 'hover:bg-slate-50'
//                 }`}
//               >
//                 <img
//                   src={user?.avatar?.url || "https://i.pravatar.cc/150"}
//                   alt={user.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-slate-800">{user.name}</p>
//                   <p className="text-xs text-slate-500">{user.email}</p>
//                 </div>
//                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
//                   isSelected? 'bg-blue-600 border-blue-600' : 'border-slate-300'
//                 }`}>
//                   {isSelected && <IoCheckmark className="text-white text-sm" />}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Footer */}
//       <div className="p-4 border-t border-slate-100">
//         <button
//           disabled={selectedUsers.length === 0 || addingUser}
//           onClick={handleAddMembers}
//           className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
//         >
//           {addingUser? "Adding..." : `Add ${selectedUsers.length || ''} Member${selectedUsers.length!== 1? 's' : ''}`}
//         </button>
//       </div>
//     </div>
//   </div>
// );



 



// };

// export default AddMemberModal;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { IoClose, IoSearch, IoCheckmark } from "react-icons/io5";

// const AddMemberModal = ({ group, setGroup, open, onClose }) => {
//   const [search, setSearch] = useState("");
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [addingUser, setAddingUser] = useState(false); // changed to boolean
//   const [selectedUsers, setSelectedUsers] = useState([]); // NEW
 
//   useEffect(() => {
//     if (!open) return;
//     setSelectedUsers([]); // reset on open
//     setSearch("");

//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("http://localhost:5000/api/v1/user/", {
//           withCredentials: true,
//         });
//         setAllUsers(res.data.users);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }                                            
//     };

//     fetchUsers();
//   }, [open]);

//   if (!open) return null;

//   const availableUsers = allUsers.filter(
//     (user) =>!group.participants.some((member) => member._id === user._id)
//   );

//   const filteredUsers = availableUsers.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase()) ||
//     user.email.toLowerCase().includes(search.toLowerCase())
//   );

//   // Toggle user selection
//   const toggleUser = (user) => {
//     setSelectedUsers((prev) =>
//       prev.some((u) => u._id === user._id)
//        ? prev.filter((u) => u._id!== user._id)
//         : [...prev, user]
//     );
//   };

//   // Add multiple members at once
//   const handleAddMembers = async () => {
//     if (selectedUsers.length === 0) return;
//     try {
//       setAddingUser(true);

//       // If your backend supports bulk add
//       const promises = selectedUsers.map((user) =>
//         axios.put(
//           "http://localhost:5000/api/v1/chat/group/add",
//           { chatId: group._id, userId: user._id },
//           { withCredentials: true }
//         )
//       );

//       await Promise.all(promises);

//       // Refetch group to get updated members
//       const res = await axios.get(
//         `http://localhost:5000/api/v1/chat/${group._id}`,
//         { withCredentials: true }
//       );
//       setGroup(res.data.chat);

//       onClose();
//     } catch (error) {
//       console.log(error);
//     } finally {                         
//       setAddingUser(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//       <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[480px] max-h-[85vh] flex flex-col border border-white/20">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5">
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800">Add Members</h2>
//             <p className="text-sm text-slate-500 mt-0.5">
//               {selectedUsers.length} selected
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
//           >
//             <IoClose className="text-xl text-slate-600" />
//           </button>
//         </div>

//         {/* Selected chips */}
//         {selectedUsers.length > 0 && (
//           <div className="px-4 pb-3 flex flex-wrap gap-2 border-b border-slate-100">
//             {selectedUsers.map((user) => (
//               <div
//                 key={user._id}
//                 className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm"
//               >
//                 <span>{user.name}</span>
//                 <button onClick={() => toggleUser(user)}>
//                   <IoClose className="text-xs" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Search */}
//         <div className="px-4 py-3">
//           <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-blue-400 transition">
//             <IoSearch className="text-slate-400 text-lg" />
//             <input
//               type="text"
//               placeholder="Search by name or email"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
//             />
//           </div>
//         </div>

//         {/* Users */}
//         <div className="flex-1 overflow-y-auto px-2">
//           {loading? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-slate-500 text-sm">Loading users...</p>
//             </div>
//           ) : filteredUsers.length === 0? (
//             <div className="text-center py-16">
//               <p className="text-slate-400">No users found</p>
//             </div>
//           ) : (
//             filteredUsers.map((user) => {
//               const isSelected = selectedUsers.some((u) => u._id === user._id);
//               return (
//                 <div
//                   key={user._id}
//                   onClick={() => toggleUser(user)}
//                   className={`flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-xl cursor-pointer transition ${
//                     isSelected? "bg-blue-50" : "hover:bg-slate-50"
//                   }`}
//                 >
//                   <img
//                     src={user?.avatar?.url || "https://i.pravatar.cc/150"}
//                     alt={user.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-semibold text-slate-800">{user.name}</p>
//                     <p className="text-xs text-slate-500">{user.email}</p>
//                   </div>
//                   <div
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
//                       isSelected
//                        ? "bg-blue-600 border-blue-600"
//                         : "border-slate-300"
//                     }`}
//                   >
//                     {isSelected && <IoCheckmark className="text-white text-sm" />}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-slate-100">
//           <button
//             disabled={selectedUsers.length === 0 || addingUser}
//             onClick={handleAddMembers}
//             className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
//           >
//             {addingUser
//              ? "Adding..."
//               : `Add ${selectedUsers.length || ""} Member${
//                   selectedUsers.length!== 1? "s" : ""
//                 }`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMemberModal;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose, IoSearch, IoCheckmark } from "react-icons/io5";

const AddMemberModal = ({ group, setGroup, open, onClose }) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!open) return;

    setSelectedUsers([]);
    setSearch("");

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/v1/user/",
          { withCredentials: true }
        );

        setAllUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open]);

  if (!open) return null;

  const availableUsers = allUsers.filter(
    (user) =>
      !group?.participants?.some(
        (member) => member._id === user._id
      )
  );

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  // ✅ OLD SIMPLE STYLE (NO Promise.all)
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setAddingUser(true);

      let updatedGroup = group;

      // OLD STYLE LOOP (ONE BY ONE REQUEST)
      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];

        const res = await axios.put(
          "http://localhost:5000/api/v1/chat/group/add",
          {
            chatId: group._id,
            userId: user._id,
          },
          { withCredentials: true }
        );

        // backend returns updated group
        updatedGroup = res.data.chat || res.data.group;
      }

      setGroup(updatedGroup);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">

      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-[480px] max-h-[85vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Members
            </h2>
            <p className="text-sm text-slate-500">
              {selectedUsers.length} selected
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <IoClose />
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl">
            <IoSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto px-2">

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-10">No users</p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUsers.some(
                (u) => u._id === user._id
              );

              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <img
                      src={user?.avatar?.url}
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {isSelected && <IoCheckmark />}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={handleAddMembers}
            disabled={addingUser}
            className="w-full py-3 bg-blue-600 text-white rounded-xl"
          >
            {addingUser ? "Adding..." : "Add Members"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMemberModal;