// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsers, setOnlineUsers } from "../features/user/userSlice";

// const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
//   const dispatch = useDispatch();

//   // Pull data safely from Redux
//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading
//   } = useSelector((state) => state.user || {});

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   // Debug logs (optional)
//   console.log("CURRENT USER ===>", currentUser);
//   console.log("ALL USERS ===>", allUsers);

//   // 🔥 Listen socket online users update
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("updateOnlineUsers", (ids) => dispatch(setOnlineUsers(ids)));

//     return () => socket.off("updateOnlineUsers");
//   }, [socket, dispatch]);

//   // 🔥 Fetch users initially
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);
                                                                               
//   // 🔥 Exclude current user + maintain filtered list
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );
//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser, currentUserId]);

//   // 🔍 Search users
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower = keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) => u.name?.toLowerCase().includes(lower))
//     );
//   };

//   if (loading)
//     return (
//       <p className="text-center text-gray-400 mt-4">Loading users...</p>
//     );

//   return (
//     <div className="w-full h-full flex flex-col">

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search users..."
//         value={searchKeyword}
//         onChange={handleSearch}
//         className="
//           w-full p-[10px_16px] rounded-full bg-[#1f2937]
//           text-[#f9fafb] text-[14px] outline-none border border-transparent
//           shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300
//           focus:bg-[#374151] focus:border-blue-500
//         "
//       />

//       {/* User List */}
//       <div className="flex-1 overflow-y-auto pr-1 small-scrollbar flex flex-col gap-[10px]">

//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => {
//             const isOnline = onlineUsers.includes(user._id);
//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <div
//                 key={user._id}
//                 onClick={() => onSelectUser(user)}
//                 className="
//                   flex items-center gap-[14px] p-[12px_16px] rounded-[20px]
//                   bg-[#111827] cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]
//                   transform transition duration-300 hover:bg-[#1f2937] hover:scale-[1.03]
//                 "
//               >
//                 <div className="relative">
//                   <img
//                     src={avatarUrl}
//                     alt={user.name}
//                     className={`w-[40px] h-[40px] rounded-full object-cover border-2 ${
//                       isOnline ? "border-[#22c55e]" : "border-[#9ca3af]"
//                     }`}
//                   />
//                   {isOnline && (
//                     <span
//                       className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full
//                       border-2 border-[#111827] bg-[#22c55e]"
//                     />
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="text-[15px] font-semibold text-[#f9fafb]">
//                     {user.name}
//                   </h3>
//                   <p
//                     className={`text-[12px] ${
//                       isOnline ? "text-[#22c55e]" : "text-[#9ca3af]"
//                     }`}
//                   >
//                     {isOnline ? "Online" : "Offline"}
//                   </p>
//                 </div>

//                 <div
//                   className={`w-[10px] h-[10px] rounded-full ${
//                     isOnline ? "bg-[#22c55e]" : "bg-[#6b7280]"
//                   }`}
//                 />
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-400 mt-4">No users found...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUserList;













// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";

// // Because this file is located at:
// // src/components/chat/AllUserList.jsx
// // and userSlice is located at:
// // src/features/user/userSlice.js
// // we need to go up two folders (chat -> components -> src)
// // and then into features/user/

// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";

// const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector((state) => state.user || {});

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   // Listen for online users updates from Socket.IO
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("updateOnlineUsers", (ids) => {
//       dispatch(setOnlineUsers(ids));
//     });

//     return () => {
//       socket.off("updateOnlineUsers");
//     };
//   }, [socket, dispatch]);

//   // Fetch all users when component mounts
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user and keep filtered list updated
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser, currentUserId]);

//   // Search users by name
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower = keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) =>
//         u.name?.toLowerCase().includes(lower)
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <p className="mt-4 text-center text-gray-400">
//         Loading users...
//       </p>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col">
//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search users..."
//         value={searchKeyword}
//         onChange={handleSearch}
//         className="w-full rounded-full bg-[#1f2937] p-[10px_16px] text-[14px] text-[#f9fafb] outline-none border border-transparent shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300 focus:bg-[#374151] focus:border-blue-500"
//       />

//       {/* User List */}
//       <div className="small-scrollbar flex flex-1 flex-col gap-[10px] overflow-y-auto pr-1">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => {
//             const isOnline = onlineUsers.includes(user._id);

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <div
//                 key={user._id}
//                 onClick={() => onSelectUser(user)}
//                 className="cursor-pointer rounded-[20px] bg-[#111827] p-[12px_16px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition duration-300 hover:scale-[1.03] hover:bg-[#1f2937]"
//               >
//                 <div className="flex items-center gap-[14px]">
//                   <div className="relative">
//                     <img
//                       src={avatarUrl}
//                       alt={user.name}
//                       className={`h-[40px] w-[40px] rounded-full object-cover border-2 ${
//                         isOnline
//                           ? "border-[#22c55e]"
//                           : "border-[#9ca3af]"
//                       }`}
//                     />

//                     {isOnline && (
//                       <span className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full border-2 border-[#111827] bg-[#22c55e]" />
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-[15px] font-semibold text-[#f9fafb]">
//                       {user.name}
//                     </h3>

//                     <p
//                       className={`text-[12px] ${
//                         isOnline
//                           ? "text-[#22c55e]"
//                           : "text-[#9ca3af]"
//                       }`}
//                     >
//                       {isOnline ? "Online" : "Offline"}
//                     </p>
//                   </div>

//                   <div
//                     className={`h-[10px] w-[10px] rounded-full ${
//                       isOnline
//                         ? "bg-[#22c55e]"
//                         : "bg-[#6b7280]"
//                     }`}
//                   />
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="mt-4 text-center text-gray-400">
//             No users found...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUserList;





// src/components/chat/AllUserList.jsx

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";

// const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector((state) => state.user || {});

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   // Listen for online users updates from Socket.IO
//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineUsersUpdate = (ids) => {
//       dispatch(setOnlineUsers(ids));
//     };

//     socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

//     return () => {
//       socket.off(
//         "updateOnlineUsers",
//         handleOnlineUsersUpdate
//       );
//     };
//   }, [socket, dispatch]);

//   // Fetch all users when component mounts
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user and update filtered list
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser, currentUserId]);

//   // Search users by name
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower = keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) =>
//         u.name?.toLowerCase().includes(lower)
//       )
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center">
//         <p className="text-sm text-slate-400">
//           Loading users...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full w-full flex-col bg-white">
//       {/* Search Input */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchKeyword}
//           onChange={handleSearch}
//           className="
//             w-full rounded-2xl border border-slate-200 bg-slate-50
//             px-4 py-3 text-sm text-slate-700
//             outline-none shadow-sm transition-all duration-200
//             placeholder:text-slate-400
//             focus:border-blue-500 focus:bg-white
//             focus:ring-2 focus:ring-blue-100
//           "
//         />
//       </div>

//       {/* User List */}
//       <div className="small-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => {
//             const isOnline = onlineUsers.includes(user._id);

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <button
//                 key={user._id}
//                 onClick={() => onSelectUser(user)}
//                 className="
//                   w-full rounded-2xl border border-slate-200 bg-white
//                   px-4 py-3 text-left shadow-sm
//                   transition-all duration-200
//                   hover:-translate-y-0.5
//                   hover:border-slate-300
//                   hover:bg-slate-50
//                   hover:shadow-md
//                   active:scale-[0.99]
//                 "
//               >
//                 <div className="flex items-center gap-3">
//                   {/* Avatar */}
//                   <div className="relative shrink-0">
//                     <img
//                       src={avatarUrl}
//                       alt={user.name}
//                       className={`
//                         h-11 w-11 rounded-full object-cover border-2
//                         ${
//                           isOnline
//                             ? "border-green-500"
//                             : "border-slate-300"
//                         }
//                       `}
//                     />

//                     {/* Online Dot */}
//                     {isOnline && (
//                       <span
//                         className="
//                           absolute bottom-0 right-0
//                           h-3 w-3 rounded-full
//                           border-2 border-white bg-green-500
//                         "
//                       />
//                     )}
//                   </div>

//                   {/* User Info */}
//                   <div className="min-w-0 flex-1">
//                     <h3 className="truncate text-sm font-semibold text-slate-900">
//                       {user.name}
//                     </h3>

//                     <p
//                       className={`
//                         mt-0.5 text-xs font-medium
//                         ${
//                           isOnline
//                             ? "text-green-600"
//                             : "text-slate-400"
//                         }
//                       `}
//                     >
//                       {isOnline ? "Online" : "Offline"}
//                     </p>
//                   </div>

//                   {/* Right Status Dot */}
//                   <div
//                     className={`
//                       h-2.5 w-2.5 rounded-full shrink-0
//                       ${
//                         isOnline
//                           ? "bg-green-500"
//                           : "bg-slate-300"
//                       }
//                     `}
//                   />
//                 </div>
//               </button>
//             );
//           })
//         ) : (
//           <div className="flex flex-1 items-center justify-center">
//             <p className="text-sm text-slate-400">
//               No users found...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUserList;





// // src/components/chat/AllUserList.jsx

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";
// // import { Search } from "lucide-react";

// const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector((state) => state.user || {});

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   // Listen for online users updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineUsersUpdate = (ids) => {
//       dispatch(setOnlineUsers(ids));
//     };

//     socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

//     return () => {
//       socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
//     };
//   }, [socket, dispatch]);
   
//   // Fetch users on mount
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser, currentUserId]);

//   // Search users
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower = keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) =>
//         u.name?.toLowerCase().includes(lower)
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center">
//         <p className="text-sm text-slate-400">Loading users...</p>
//       </div>
//     );
//   }

//   // return (
//   //   <div className="flex h-full w-full flex-col bg-gradient-to-b from-slate-50 to-white">
//   //     {/* Search Bar */}
//   //     <div className="mb-4">
//   //       <div className="relative">
//   //         {/* <Search
//   //           size={16}
//   //           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//   //         /> */}
//   //         <input
//   //           type="text"
//   //           placeholder="Search conversations..."
//   //           value={searchKeyword}
//   //           onChange={handleSearch}
//   //           className="
//   //             w-full rounded-2xl border border-slate-200 bg-white
//   //             py-3 pl-11 pr-4
//   //             text-sm text-slate-700
//   //             shadow-sm outline-none transition-all duration-200
//   //             placeholder:text-slate-400
//   //             focus:border-blue-500 focus:ring-2 focus:ring-blue-100
//   //           "
//   //         />
//   //       </div>
//   //     </div>

//   //     {/* User List */}
//   //     <div className="small-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
//   //       {filteredUsers.length > 0 ? (
//   //         filteredUsers.map((user) => {
//   //           const isOnline = onlineUsers.includes(user._id);

//   //           const avatarUrl =
//   //             user.avatar?.url ||
//   //             "https://www.w3schools.com/w3images/avatar2.png";

//   //           return (
//   //             <button
//   //               key={user._id}
//   //               onClick={() => onSelectUser(user)}
//   //               className="
//   //                 group w-full rounded-3xl bg-white
//   //                 px-4 py-3 text-left
//   //                 border border-slate-100
//   //                 shadow-sm
//   //                 transition-all duration-200
//   //                 hover:shadow-lg
//   //                 hover:border-slate-200
//   //                 hover:-translate-y-0.5
//   //                 active:scale-[0.99]
//   //               "
//   //             >
//   //               <div className="flex items-center gap-3">
//   //                 {/* Avatar */}
//   //                 <div className="relative shrink-0">
//   //                   <img
//   //                     src={avatarUrl}
//   //                     alt={user.name}
//   //                     className="
//   //                       h-12 w-12 rounded-2xl object-cover
//   //                       ring-2 ring-slate-100
//   //                     "
//   //                   />

//   //                   {isOnline && (
//   //                     <span
//   //                       className="
//   //                         absolute -bottom-0.5 -right-0.5
//   //                         h-3.5 w-3.5 rounded-full
//   //                         border-2 border-white
//   //                         bg-emerald-500
//   //                       "
//   //                     />
//   //                   )}
//   //                 </div>

//   //                 {/* User Info */}
//   //                 <div className="min-w-0 flex-1">
//   //                   <h3 className="truncate text-sm font-semibold text-slate-900">
//   //                     {user.name}
//   //                   </h3>

//   //                   <p
//   //                     className={`
//   //                       mt-1 text-xs font-medium
//   //                       ${
//   //                         isOnline
//   //                           ? "text-emerald-600"
//   //                           : "text-slate-400"
//   //                       }
//   //                     `}
//   //                   >
//   //                     {isOnline ? "Active now" : "Offline"}
//   //                   </p>
//   //                 </div>

//   //                 {/* Right Dot */}
//   //                 <div
//   //                   className={`
//   //                     h-2.5 w-2.5 rounded-full shrink-0
//   //                     transition-all duration-200
//   //                     ${
//   //                       isOnline
//   //                         ? "bg-emerald-500"
//   //                         : "bg-slate-200"
//   //                     }
//   //                   `}
//   //                 />
//   //               </div>
//   //             </button>
//   //           );
//   //         })
//   //       ) : (
//   //         <div className="flex flex-1 items-center justify-center">
//   //           <p className="text-sm text-slate-400">No users found...</p>
//   //         </div>
//   //       )}
//   //     </div>
//   //   </div>
//   // );

//  // Replace ONLY the return (...) part of AllUserList.jsx with this new design.
// // Clean WhatsApp/iMessage-inspired design with subtle separators and soft selection feel.

// return (

//    <div className="sticky top-0 z-10">

//       <div className="sticky shrink-0 bg-inherit top-0 z-10">
//         <input
//           type="text"
//           placeholder="Search people..."
//           value={searchKeyword}
//           onChange={handleSearch}
//           className="
//             w-full rounded-full border border-slate-200 bg-slate-50
//             px-4 py-2.5 text-sm text-slate-700
//             outline-none transition-all duration-200
//             placeholder:text-slate-400
//             focus:border-slate-300 focus:bg-white
//             focus:ring-2 focus:ring-slate-100
//           "
//         />
//       </div>

//   <div className="flex h-full w-full flex-col  bg-white">

   
//     {/* Top Title */}
//     <div className="">
//       {/* <h2 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">
//         Chats
//       </h2> */}

//       {/* Search Input */}
  

//     </div>

//     {/* User List */}
//     <div className="flex-1 ">
//       {filteredUsers.length > 0 ? (
//         filteredUsers.map((user) => {
//           const isOnline = onlineUsers.includes(user._id);

//           const avatarUrl =
//             user.avatar?.url ||
//             "https://www.w3schools.com/w3images/avatar2.png";

//           return (
//             <button
//               key={user._id}
//               onClick={() => onSelectUser(user)}
//               className="
//                 group flex w-full items-center gap-3
//                 rounded-2xl px-3 py-3 text-left
//                 transition-all duration-200
//                 hover:bg-slate-50
//                 active:scale-[0.99]
//               "
//             >
//               {/* Avatar */}
//               <div className="relative shrink-0">
//                 <img
//                   src={avatarUrl}
//                   alt={user.name}
//                   className="h-12 w-12 rounded-full object-cover"
//                 />

//                 {/* Online Indicator */}
//                 {isOnline && (
//                   <span
//                     className="
//                       absolute bottom-0 right-0
//                       h-3.5 w-3.5 rounded-full
//                       border-2 border-white
//                       bg-emerald-500
//                     "
//                   />
//                 )}
//               </div>

//               {/* User Info */}
//               <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                 <div className="flex items-center justify-between gap-3">
//                   <h3 className="truncate text-sm font-semibold text-slate-900">
//                     {user.name}
//                   </h3>

//                   <span
//                     className={`
//                       text-[11px] font-medium
//                       ${
//                         isOnline
//                           ? "text-emerald-600"
//                           : "text-slate-400"
//                       }
//                     `}
//                   >
//                     {isOnline ? "Online" : "Offline"}
//                   </span>
//                 </div>

//                 <p className="mt-1 truncate text-xs text-slate-400">
//                   Tap to start chatting
//                 </p>
//               </div>
//             </button>
//           );
//         })
//       ) : (
//         <div className="flex h-full items-center justify-center">
//           <p className="text-sm text-slate-400">
//             No users found...
//           </p>
//         </div>
//       )}
//     </div>
//   </div>

//   </div> 

// );

// };

// export default AllUserList;





// src/components/chat/AllUserList.jsx

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";

// const AllUserList = ({ onSelectUser, socket, currentUserId }) => {
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector((state) => state.user || {});

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

  

//   // Add this helper function inside your AllUserList component
//   const formatLastSeen = (dateString) => {

//   const lastSeen = new Date(dateString);
//   const now = new Date();

//   // Start of today
//   const today = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate()
//   );

//   // Start of yesterday
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   // Format time (e.g. 3:45 PM)
//   const time = lastSeen.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });

//   // If last seen today
//   if (lastSeen >= today) {
//     return `${time}`;
//   }

//   // If last seen yesterday
//   if (lastSeen >= yesterday && lastSeen < today) {
//     return `Yesterday`;
//   }

//   // Otherwise show date like 11/05/26
//   const day = String(lastSeen.getDate()).padStart(2, "0");
//   const month = String(lastSeen.getMonth() + 1).padStart(2, "0");
//   const year = String(lastSeen.getFullYear()).slice(-2);

//   return `${day}/${month}/${year}`;
// };


//   // Listen for online users updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineUsersUpdate = (ids) => {
//       dispatch(setOnlineUsers(ids));
//     };
                         
//     socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

//     return () => {
//       socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
//     };
//   }, [socket, dispatch]);

//   // Fetch users on mount
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser, currentUserId]);

//   // Search users
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== (currentUser?._id || currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower = keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) => u.name?.toLowerCase().includes(lower))
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center">
//         <p className="text-sm text-slate-400">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full w-full flex-col bg-white">

//       {/* Search Bar (NEW ADDED) */}
//       {/* Search Bar (Sticky) */}
// <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
//   <input
//     type="text"
//     placeholder="Search people..."
//     value={searchKeyword}
//     onChange={handleSearch}
//     className="
//       w-full rounded-full border  border-slate-200 bg-slate-50
//       px-4 py-2.5 text-sm text-slate-700
//       outline-none transition-all duration-200
//       placeholder:text-slate-400
//       focus:border-slate-300 focus:bg-white
//       focus:ring-2 focus:ring-slate-100
//     "
//   />
// </div>
     

//       {/* User List */}
//       <div className="flex-1">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => {
//             const isOnline = onlineUsers.includes(user._id);

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <button
//                 key={user._id}
//                 onClick={() => onSelectUser(user)}
//                 className="
//                   group flex w-full items-center gap-3
//                   rounded-2xl px-3 py-3 text-left
//                   transition-all duration-200
//                   hover:bg-slate-50
//                   active:scale-[0.99]
//                 "
//               >
//                 {/* Avatar */}
//                 <div className="relative shrink-0">
//                   <img
//                     src={avatarUrl}
//                     alt={user.name}
//                     className="h-12 w-12 rounded-full object-cover"
//                   />

//                   {isOnline && (
//                     <span
//                       className="
//                         absolute bottom-0 right-0
//                         h-2.5 w-2.5 rounded-full
//                         border-1 border-white
//                         bg-emerald-500
//                       "
//                     />
//                   )}
//                 </div>

//                 {/* User Info */}
//                 <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <h3 className="truncate text-sm font-serif   text-slate-900">
//                       {user.name}
//                     </h3>

//                     <span
//                       className={`
//                         text-[11.5px] font-stretch-500%
//                         ${isOnline ? "text-emerald-600" : "text-slate-600"}
//                       `}
//                     >
//                       {isOnline ? "Online" : formatLastSeen(user.lastSeen) }
//                     </span>
//                   </div>

//                   <p className="mt-1 truncate text-xs text-slate-400">
//                     Tap to start chatting
//                   </p>
//                 </div>
//               </button>
//             );
//           })
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-sm text-slate-400">No users found...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUserList;





import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setOnlineUsers,
} from "../../features/user/userSlice";

const AllUserList = ({
  onSelectUser,
  socket,
  currentUserId,
}) => {
  const dispatch = useDispatch();

  const {
    user: currentUser,
    allUsers = [],
    onlineUsers = [],
    loading,
  } = useSelector(
    (state) => state.user || {}
  );

  const [searchKeyword, setSearchKeyword] =
    useState("");
  const [filteredUsers, setFilteredUsers] =
    useState([]);

  // Format Last Seen
  const formatLastSeen = (dateString) => {
    if (!dateString) return "";

    const lastSeen = new Date(dateString);
    const now = new Date();

    // Start of today
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Start of yesterday
    const yesterday = new Date(today);
    yesterday.setDate(
      yesterday.getDate() - 1
    );

    // Format time (e.g. 3:45 PM)
    const time =
      lastSeen.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    // If last seen today
    if (lastSeen >= today) {
      return time;
    }

    // If last seen yesterday
    if (
      lastSeen >= yesterday &&
      lastSeen < today
    ) {
      return "Yesterday";
    }

    // Otherwise show date like 11/05/26
    const day = String(
      lastSeen.getDate()
    ).padStart(2, "0");
    const month = String(
      lastSeen.getMonth() + 1
    ).padStart(2, "0");
    const year = String(
      lastSeen.getFullYear()
    ).slice(-2);

    return `${day}/${month}/${year}`;
  };

  // Listen for online users updates
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsersUpdate = (
      ids
    ) => {
      dispatch(setOnlineUsers(ids));
    };

    socket.on(
      "updateOnlineUsers",
      handleOnlineUsersUpdate
    );

    return () => {
      socket.off(
        "updateOnlineUsers",
        handleOnlineUsersUpdate
      );
    };
  }, [socket, dispatch]);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Exclude current user
  useEffect(() => {
    const baseList = allUsers.filter(
      (u) =>
        u._id !==
        (currentUser?._id ||
          currentUserId)
    );

    setFilteredUsers(baseList);
  }, [
    allUsers,
    currentUser,
    currentUserId,
  ]);

  // Search users
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    const baseList = allUsers.filter(
      (u) =>
        u._id !==
        (currentUser?._id ||
          currentUserId)
    );

    if (!keyword.trim()) {
      setFilteredUsers(baseList);
      return;
    }

    const lower =
      keyword.toLowerCase();

    setFilteredUsers(
      baseList.filter((u) =>
        u.name
          ?.toLowerCase()
          .includes(lower)
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm text-slate-400">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Search Bar (Sticky) */}
      <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search people..."
          value={searchKeyword}
          onChange={handleSearch}
          className="
            w-full rounded-full
            border border-slate-200
            bg-slate-50
            px-4 py-2.5
            text-sm text-slate-700
            outline-none
            transition-all duration-200
            placeholder:text-slate-400
            focus:border-slate-300
            focus:bg-white
            focus:ring-2 focus:ring-slate-100
          "
        />
      </div>

      {/* User List */}
      <div className="flex-1 bg-white">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline =
              onlineUsers.includes(
                user._id
              );

            const avatarUrl =
              user.avatar?.url ||
              "https://www.w3schools.com/w3images/avatar2.png";

            return (
              <button
                key={user._id}
                onClick={() =>
                  onSelectUser(user)
                }
                className="
                  group flex w-full items-center gap-3
                  rounded-2xl px-3 py-3
                  text-left
                  transition-all duration-200
                  hover:bg-slate-50
                  active:scale-[0.99]
                "
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  {isOnline && (
                    <span
                      className="
                        absolute bottom-0 right-0
                        h-2.5 w-2.5 rounded-full
                        border border-white
                        bg-emerald-500
                      "
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </h3>

                    <span
                      className={`
                        text-[11.5px] font-medium
                        ${
                          isOnline
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {isOnline
                        ? "Online"
                        : formatLastSeen(
                            user.lastSeen
                          )}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    Tap to start chatting
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center bg-white">
            <p className="text-sm text-slate-400">
              No users found...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUserList;