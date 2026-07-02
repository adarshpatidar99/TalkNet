
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";

// const AllUserList = ({
//   onSelectUser,
//   socket,
//   currentUserId,
// }) => {
  
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector(
//     (state) => state.user || {}
//   );                        


//   const {chats = []} = useSelector(
//     (state) => state.chat || {}
//   );


//   const [searchKeyword, setSearchKeyword] =
//     useState("");
//   const [filteredUsers, setFilteredUsers] =
//     useState([]);

//   // Format Last Seen
//   const formatLastSeen = (dateString) => {
//     if (!dateString) return "";

//     const lastSeen = new Date(dateString);
//     const now = new Date();

//     // Start of today
//     const today = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate()
//     );

//     // Start of yesterday
//     const yesterday = new Date(today);
//     yesterday.setDate(
//       yesterday.getDate() - 1
//     );

//     // Format time (e.g. 3:45 PM)
//     const time =
//       lastSeen.toLocaleTimeString([], {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       });

//     // If last seen today
//     if (lastSeen >= today) {
//       return time;
//     }

//     // If last seen yesterday
//     if (
//       lastSeen >= yesterday &&
//       lastSeen < today
//     ) {
//       return "Yesterday";
//     }

//     // Otherwise show date like 11/05/26
//     const day = String(
//       lastSeen.getDate()
//     ).padStart(2, "0");
//     const month = String(
//       lastSeen.getMonth() + 1
//     ).padStart(2, "0");
//     const year = String(
//       lastSeen.getFullYear()
//     ).slice(-2);

//     return `${day}/${month}/${year}`;
//   };

//   // Listen for online users updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineUsersUpdate = (
//       ids
//     ) => {
//       dispatch(setOnlineUsers(ids));
//     };

//     socket.on(
//       "updateOnlineUsers",
//       handleOnlineUsersUpdate
//     );

//     return () => {
//       socket.off(
//         "updateOnlineUsers",
//         handleOnlineUsersUpdate
//       );
//     };
//   }, [socket, dispatch]);

//   // Fetch users on mount
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) =>
//         u._id !==
//         (currentUser?._id ||
//           currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [
//     allUsers,
//     currentUser,
//     currentUserId,
//   ]);



//   const allItems = [
//      ...chats,
//      ...filteredUsers,
//   ];



//   // Search users
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) =>
//         u._id !==
//         (currentUser?._id ||
//           currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower =
//       keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) =>
//         u.name
//           ?.toLowerCase()
//           .includes(lower)
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center bg-white">
//         <p className="text-sm text-slate-400">
//           Loading users...
//         </p>
//       </div>
//     );
//   }

           
//   return (
//     <div className="flex h-full w-full flex-col bg-white">
//       {/* Search Bar (Sticky) */}
//       <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
//         <input
//           type="text"
//           placeholder="Search people..."
//           value={searchKeyword}
//           onChange={handleSearch}
//           className="
//             w-full rounded-full
//             border border-slate-200
//             bg-slate-50
//             px-4 py-2.5
//             text-sm text-slate-700
//             outline-none
//             transition-all duration-200
//             placeholder:text-slate-400
//             focus:border-slate-300
//             focus:bg-white
//             focus:ring-2 focus:ring-slate-100
//           "
//         />
//       </div>

//       {/* User List */}
//       <div className="flex-1 bg-white">
//         {filteredUsers.length > 0 ? (

          
//           allItems.map((item) => {

//             const isGroup = item.isGroupChat === true;

//             const displayName = isGroup ? item.chatName : item.name

//             const isOnline = !isGroup && 
//               onlineUsers.includes(
//                 user._id
//               );


//             const avatarUrl =
//               isGroup ? item.groupImage || "https://www.w3schools.com/w3images/avatar2.png" :
//               item.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"
//               ;

//             return (
//               <button
//                 key={user._id}
//                 onClick={() =>
//                   onSelectUser(user)
//                 }
//                 className="
//                   group flex w-full items-center gap-3
//                   rounded-2xl px-3 py-3
//                   text-left
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
//                         border border-white
//                         bg-emerald-500
//                       "
//                     />
//                   )}
//                 </div>

//                 {/* User Info */}
//                 <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <h3 className="truncate text-sm font-semibold text-slate-900">
//                       {displayName}
//                     </h3>

//                     <span
//                       className={`
//                         text-[11.5px] font-medium
//                         ${
//                           isOnline
//                             ? "text-emerald-600"
//                             : "text-slate-500"
//                         }
//                       `}
//                     >
//                       {isOnline
//                         ? "Online"
//                         : formatLastSeen(
//                             user.lastSeen
//                           )}
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
//           <div className="flex h-full items-center justify-center bg-white">
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








// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../../features/user/userSlice";

// const AllUserList = ({
//   onSelectUser,
//   socket,
//   currentUserId,
// }) => {
//   const dispatch = useDispatch();

//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector(
//     (state) => state.user || {}
//   );

//   const chats = useSelector(
//     (state) => state.chat?.chats) || [] ;

//   const [searchKeyword, setSearchKeyword] =
//     useState("");

//   const [filteredUsers, setFilteredUsers] =
//     useState([]);

//   // Format Last Seen
//   const formatLastSeen = (
//     dateString
//   ) => {
//     if (!dateString) return "";

//     const lastSeen = new Date(
//       dateString
//     );
//     const now = new Date();

//     const today = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate()
//     );

//     const yesterday = new Date(
//       today
//     );

//     yesterday.setDate(
//       yesterday.getDate() - 1
//     );

//     const time =
//       lastSeen.toLocaleTimeString(
//         [],
//         {
//           hour: "numeric",
//           minute: "2-digit",
//           hour12: true,
//         }
//       );

//     if (lastSeen >= today) {
//       return time;
//     }

//     if (
//       lastSeen >= yesterday &&
//       lastSeen < today
//     ) {
//       return "Yesterday";
//     }

//     const day = String(
//       lastSeen.getDate()
//     ).padStart(2, "0");

//     const month = String(
//       lastSeen.getMonth() + 1
//     ).padStart(2, "0");

//     const year = String(
//       lastSeen.getFullYear()
//     ).slice(-2);

//     return `${day}/${month}/${year}`;
//   };

//   // Listen for online users updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineUsersUpdate = (
//       ids
//     ) => {
//       dispatch(setOnlineUsers(ids));
//     };

//     socket.on(
//       "updateOnlineUsers",
//       handleOnlineUsersUpdate
//     );

//     return () => {
//       socket.off(
//         "updateOnlineUsers",
//         handleOnlineUsersUpdate
//       );
//     };
//   }, [socket, dispatch]);

//   // Fetch users
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Exclude current user
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) =>
//         u._id !==
//         (currentUser?._id ||
//           currentUserId)
//     );

//     setFilteredUsers(baseList);
//   }, [
//     allUsers,
//     currentUser,
//     currentUserId,
//   ]);

//   // Combine groups + users
//   const allItems = [
//     ...chats,
//     ...filteredUsers,
//   ];

//   // Search users
//   const handleSearch = (e) => {
//     const keyword =
//       e.target.value;

//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) =>
//         u._id !==
//         (currentUser?._id ||
//           currentUserId)
//     );

//     if (!keyword.trim()) {
//       setFilteredUsers(baseList);
//       return;
//     }

//     const lower =
//       keyword.toLowerCase();

//     setFilteredUsers(
//       baseList.filter((u) =>
//         u.name
//           ?.toLowerCase()
//           .includes(lower)
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center bg-white">
//         <p className="text-sm text-slate-400">
//           Loading users...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full w-full flex-col bg-white">
//       {/* Search */}
//       <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
//         <input
//           type="text"
//           placeholder="Search people..."
//           value={searchKeyword}
//           onChange={handleSearch}
//           className="
//             w-full rounded-full
//             border border-slate-200
//             bg-slate-50
//             px-4 py-2.5
//             text-sm text-slate-700
//             outline-none
//             transition-all duration-200
//             placeholder:text-slate-400
//             focus:border-slate-300
//             focus:bg-white
//             focus:ring-2 focus:ring-slate-100
//           "
//         />
//       </div>

//       {/* User List */}
//       <div className="flex-1 bg-white">
//         {allItems.length > 0 ? (
//           allItems.map((item) => {
//             const isGroup =
//               item.isGroupChat === true;

//             const displayName =
//               isGroup
//                 ? item.chatName
//                 : item.name;

//             const isOnline =
//               !isGroup &&
//               onlineUsers.includes(
//                 item._id
//               );

//             const avatarUrl =
//               isGroup
//                 ? item.groupImage ||
//                   "https://cdn-icons-png.flaticon.com/512/681/681494.png"
//                 : item.avatar?.url ||
//                   "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <button
//                 key={item._id}
//                 onClick={() =>
//                   onSelectUser(item)
//                 }
//                 className="
//                   group flex w-full items-center gap-3
//                   rounded-2xl px-3 py-3
//                   text-left
//                   transition-all duration-200
//                   hover:bg-slate-50
//                   active:scale-[0.99]
//                 "
//               >
//                 {/* Avatar */}
//                 <div className="relative shrink-0">
//                   <img
//                     src={avatarUrl}
//                     alt={
//                       displayName
//                     }
//                     className="h-12 w-12 rounded-full object-cover"
//                   />

//                   {isOnline && (
//                     <span
//                       className="
//                         absolute bottom-0 right-0
//                         h-2.5 w-2.5 rounded-full
//                         border border-white
//                         bg-emerald-500
//                       "
//                     />
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <h3 className="truncate text-sm font-semibold text-slate-900">
//                       {
//                         displayName
//                       }
//                     </h3>

//                     <span
//                       className={`
//                         text-[11.5px] font-medium
//                         ${
//                           isOnline
//                             ? "text-emerald-600"
//                             : "text-slate-500"
//                         }
//                       `}
//                     >
//                       {isOnline
//                         ? "Online"
//                         : isGroup
//                         ? "Group"
//                         : formatLastSeen(
//                             item.lastSeen
//                           )}
//                     </span>
//                   </div>

//                   <p className="mt-1 truncate text-xs text-slate-400">
//                     {isGroup
//                       ? "Group Chat"
//                       : "Tap to start chatting"}
//                   </p>
//                 </div>
//               </button>
//             );
//           })
//         ) : (
//           <div className="flex h-full items-center justify-center bg-white">
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
















import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";
import {
  fetchUsers,
  setOnlineUsers,
} from "../../features/user/userSlice";

import axios from 'axios';

import {setChats} from "../../features/chat/chatSlice"




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

  const chats = useSelector(
    (state) => state.chat?.chats ?? []
  );

  const [
    searchKeyword,
    setSearchKeyword,
  ] = useState("");

  const [
    filteredUsers,
    setFilteredUsers,
  ] = useState([]);





  useEffect(() => {
     
     const getChats = async() => {
       try {
        
         const res = await axios.get("http://localhost:5000/api/v1/chat/", 
          {withCredentials: true}, 
        )

        console.log('fetched chats', res.data);
        


        dispatch(setChats(res.data.chats ?? res.data ));

       } catch (error) {
          console.error(
            "Error Fetching chats:",
             error.response?.data || error.message
          );
       }
     }

     getChats();
     
  }, [dispatch]);




  // ==========================
  // DEBUG LOGS
  // ==========================
  useEffect(() => {
    console.log(
      "Current User:",
      currentUser
    );
    console.log(
      "All Users:",
      allUsers
    );
    console.log(
      "Chats:",
      chats
    );
  }, [
    currentUser,
    allUsers,
    chats,
  ]);

  // ==========================
  // Format Last Seen
  // ==========================
  const formatLastSeen = (
    dateString
  ) => {
    if (!dateString) return "";

    const lastSeen =
      new Date(dateString);

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const yesterday =
      new Date(today);

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const time =
      lastSeen.toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );

    if (lastSeen >= today) {
      return time;
    }

    if (
      lastSeen >= yesterday &&
      lastSeen < today
    ) {
      return "Yesterday";
    }

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

  // ==========================
  // Online Users
  // ==========================
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsersUpdate =
      (ids) => {
        dispatch(
          setOnlineUsers(ids)
        );
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

  // ==========================
  // Fetch Users
  // ==========================
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ==========================
  // Filter Users
  // ==========================
  useEffect(() => {
    const baseList =
      allUsers.filter(
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






  // ==========================
  // Combine Groups + Users
  // ==========================
  const allItems = useMemo(() => {
    const items = [
      ...chats,
      ...filteredUsers,
    ];

    console.log(
      "Combined Items:",
      items
    );

    return items;
  }, [chats, filteredUsers]);

  console.log("Chats after refresh:", chats);

  // ==========================
  // Search
  // ==========================
  const handleSearch = (e) => {
    const keyword =
      e.target.value;

    setSearchKeyword(keyword);

    const baseList =
      allUsers.filter(
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
      {/* Search */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-3">
        <input
          type="text"
          placeholder="Search people..."
          value={searchKeyword}
          onChange={
            handleSearch
          }
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

      {/* List */}
      <div className="flex-1 bg-white">
        {allItems.length > 0 ? (
          allItems.map((item) => {

            console.log("Group Item:", item);
console.log("Group Image:", item.groupImage);

            console.log(
              "Rendering Item:",
              item
            );

            const isGroup =
              item.isGroupChat ===
              true;

            const displayName =
              isGroup
                ? item.chatName
                : item.name;

            const isOnline =
              !isGroup &&
              onlineUsers.includes(
                item._id
              );  

            const avatarUrl = 
              isGroup
                ? item.groupImage ||
                  "https://cdn-icons-png.flaticon.com/512/681/681494.png"
                : item.avatar
                    ?.url ||
                  "https://www.w3schools.com/w3images/avatar2.png";

            return (
              <button
                key={item._id}
                onClick={() =>
                  onSelectUser(
                    item
                  )
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
                    src={
                      avatarUrl
                    }
                    alt={
                      displayName
                    }
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

                {/* Info */}
                <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {
                        displayName
                      }
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
                        : isGroup
                        ? "Group"
                        : formatLastSeen(
                            item.lastSeen
                          )}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {isGroup
                      ? "Group Chat"
                      : "Tap to start chatting"}
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