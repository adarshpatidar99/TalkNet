// import React, { useState } from 'react'
// import { useEffect } from 'react';
// import { useSelector, useDispatch } from "react-redux";
// import socket from '../components/socket/socket';
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../features/user/userSlice"

// const CreateGroup = () => {

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const [selectedUsers, setSelectedUsers] = useState([]);

//    const handleSearch = (e) => {
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


//    useEffect(() => {
//     socket.connect();
//     return () => socket.disconnect();
//   }, []);


//    useEffect(() => {
//       if (!socket) return;
  
//       const handleOnlineUsersUpdate = (
//         ids
//       ) => {
//         dispatch(setOnlineUsers(ids));
//       };
  
//       socket.on(
//         "updateOnlineUsers",
//         handleOnlineUsersUpdate
//       );
  
//       return () => {
//         socket.off(
//           "updateOnlineUsers",
//           handleOnlineUsersUpdate
//         );
//       };
//     }, [socket, dispatch]);

//    if (loading) {
//     return (
//       <div className="flex flex-1 items-center justify-center bg-white">
//         <p className="text-sm text-slate-400">
//           Loading users...
//         </p>
//       </div>
//     );
//   }

//   useEffect(() => {
//       dispatch(fetchUsers());
//     }, [dispatch]);

//   useEffect(() => {
//       const baseList = allUsers.filter(
//         (u) =>
//           u._id !==
//           (currentUser?._id ||
//             currentUserId)
//       );
  
//       setFilteredUsers(baseList);
//     }, [
//       allUsers,
//       currentUser,
//       currentUserId,
//     ]);


//   const {
//       user: currentUser,
//       allUsers = [],
//       onlineUsers = [],
//       loading,
//     } = useSelector(
//       (state) => state.user || {}
//     );


  
//   const handleSelect = (user) => {
    
//      const exists = selectedUsers.includes(user._id);

//      if(exists) {
//        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
//      } else {
//        setSelectedUsers([...selectedUsers, user._id]);
//      } 

//   }

   

//   return (
   
//     <>
    
//       <div className="flex h-full w-full flex-col bg-white">
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
//           filteredUsers.map((user) => {
//             const isOnline =
//               onlineUsers.includes(
//                 user._id
//               );

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <button
//                 key={user._id}
//                 onClick={() =>
//                   handleSelect(user)
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
//                       {user.name}
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
    
//     </>

//   )
// }

// export default CreateGroup







// import React, { useState } from 'react'
// import { useEffect } from 'react';
// import { useSelector, useDispatch } from "react-redux";
// import socket from '../components/socket/socket';
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../features/user/userSlice"

// const CreateGroup = () => {  

//   const dispatch = useDispatch();

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const {
//       user: currentUser,
//       allUsers = [],
//       onlineUsers = [],
//       loading,
//     } = useSelector(
//       (state) => state.user || {}
//     );



//   useEffect(() => {
//   const baseList = allUsers.filter(
//     (u) => u._id !== currentUser?._id
//   );

//   setFilteredUsers(baseList);
// }, [allUsers, currentUser]);  

    


//    const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) =>
//         u._id !==
//         currentUser?._id  
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


//    useEffect(() => {
//     socket.connect();
//     return () => socket.disconnect();
//   }, []);


//    useEffect(() => {
//       if (!socket) return;
  
//       const handleOnlineUsersUpdate = (
//         ids
//       ) => {
//         dispatch(setOnlineUsers(ids));
//       };
  
//       socket.on(
//         "updateOnlineUsers",
//         handleOnlineUsersUpdate
//       );
  
//       return () => {
//         socket.off(
//           "updateOnlineUsers",
//           handleOnlineUsersUpdate
//         );
//       };
//     }, [socket, dispatch]);

//   //  if (loading) {
//   //   return (
//   //     <div className="flex flex-1 items-center justify-center bg-white">
//   //       <p className="text-sm text-slate-400">
//   //         Loading users...
//   //       </p>
//   //     </div>
//   //   );
//   // }

//   useEffect(() => {
//       dispatch(fetchUsers());
//     }, [dispatch]);


  
    



//   // useEffect(() => {
//   //     const baseList = allUsers.filter(
//   //       (u) =>
//   //         u._id !==
//   //         (currentUser?._id ||
//   //           currentUserId)
//   //     );
  
//   //     setFilteredUsers(baseList);
//   //   }, [
//   //     allUsers,
//   //     currentUser,
//   //     currentUserId,
//   //   ]);


//   // const {
//   //     user: currentUser,
//   //     allUsers = [],
//   //     onlineUsers = [],
//   //     loading,
//   //   } = useSelector(
//   //     (state) => state.user || {}
//   //   );


  
//   const handleSelect = (user) => {
    
//      const exists = selectedUsers.includes(user._id);

//      if(exists) {
//        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
//      } else {
//        setSelectedUsers([...selectedUsers, user._id]);
//      } 

//   }

   

//   return (
   
//     <>
    
//       <div className="flex h-full w-full flex-col bg-white">
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
//           filteredUsers.map((user) => {
//             const isOnline =
//               onlineUsers.includes(
//                 user._id
//               );

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             return (
//               <button
//                 key={user._id}
//                 onClick={() =>
//                   handleSelect(user)
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

//                   {/* {isOnline && (
//                     <span
//                       className="
//                         absolute bottom-0 right-0
//                         h-2.5 w-2.5 rounded-full
//                         border border-white
//                         bg-emerald-500
//                       "
//                     />
//                   )} */}
//                 </div>

//                 {/* User Info */}
//                 <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <h3 className="truncate text-sm font-semibold text-slate-900">
//                       {user.name}
//                     </h3>

//                     {/* <span
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
//                     </span> */}
//                   </div>

//                   {/* <p className="mt-1 truncate text-xs text-slate-400">
//                     Tap to start chatting
//                   </p> */}
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
    
//     </>

//   )
// }

// export default CreateGroup







// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import socket from "../components/socket/socket";
// import {
//   fetchUsers,
//   setOnlineUsers,
// } from "../features/user/userSlice";

// const CreateGroup = () => {
//   const dispatch = useDispatch();

//   // ✅ Redux state
//   const {
//     user: currentUser,
//     allUsers = [],
//     onlineUsers = [],
//     loading,
//   } = useSelector((state) => state.user || {});

//   // ✅ Local state
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   // ✅ Fetch users
//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // ✅ Initialize filtered users when data loads
//   useEffect(() => {
//     const baseList = allUsers.filter(
//       (u) => u._id !== currentUser?._id
//     );

//     setFilteredUsers(baseList);
//   }, [allUsers, currentUser]);

//   // ✅ Socket connect
//   useEffect(() => {
//     socket.connect();

//     return () => socket.disconnect();
//   }, []);

//   // ✅ Online users listener
//   useEffect(() => {
//     const handleOnlineUsersUpdate = (ids) => {
//       dispatch(setOnlineUsers(ids));
//     };

//     socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

//     return () => {
//       socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
//     };
//   }, [dispatch]);

//   // ✅ Search handler
//   const handleSearch = (e) => {
//     const keyword = e.target.value;
//     setSearchKeyword(keyword);

//     const baseList = allUsers.filter(
//       (u) => u._id !== currentUser?._id
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

//   // ✅ Select users
//   const handleSelect = (user) => {
//     const exists = selectedUsers.includes(user._id);

//     if (exists) {
//       setSelectedUsers(
//         selectedUsers.filter((id) => id !== user._id)
//       );
//     } else {
//       setSelectedUsers([...selectedUsers, user._id]);
//     }
//   };

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center bg-white">
//         <p className="text-sm text-slate-400">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full w-full flex-col bg-white">

//       {/* Search Bar */}
//       <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
//         <input
//           type="text"
//           placeholder="Search people..."
//           value={searchKeyword}
//           onChange={handleSearch}
//           className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
//         />
//       </div>

//       {/* User List */}
//       <div className="flex-1 bg-white">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => {
//             const isOnline = onlineUsers.includes(user._id);

//             const avatarUrl =
//               user.avatar?.url ||
//               "https://www.w3schools.com/w3images/avatar2.png";

//             const isSelected = selectedUsers.includes(user._id);

//             return (
//               <button
//                 key={user._id}
//                 onClick={() => handleSelect(user)}
//                 className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-slate-50 ${
//                   isSelected ? "bg-slate-100" : ""
//                 }`}
//               >
//                 {/* Avatar */}
//                 <div className="relative shrink-0">
//                   <img
//                     src={avatarUrl}
//                     alt={user.name}
//                     className="h-12 w-12 rounded-full object-cover"
//                   />

//                   {isOnline && (
//                     <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
//                   )}
//                 </div>

//                 {/* User Info */}
//                 <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
//                   <div className="flex items-center justify-between">
//                     <h3 className="truncate text-sm font-semibold text-slate-900">
//                       {user.name}
//                     </h3>

//                     {/* <span className="text-xs text-slate-500">
//                       {isOnline ? "Online" : "Offline"}
//                     </span> */}

//                   </div>

//                   <p className="mt-1 text-xs text-slate-400">
//                     Tap to select
//                   </p>
//                 </div>
//               </button>
//             );
//           })
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-sm text-slate-400">
//               No users found...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateGroup;










import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../components/socket/socket";
import {
  fetchUsers,
  setOnlineUsers,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";

const CreateGroup = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // ✅ Redux state
  const {
    user: currentUser,
    allUsers = [],
    onlineUsers = [],
    loading,
  } = useSelector((state) => state.user || {});

  // ✅ Local state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // ✅ Fetch users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ✅ Initialize list
  useEffect(() => {
    const baseList = allUsers.filter(
      (u) => u._id !== currentUser?._id
    );                          

    setFilteredUsers(baseList);
  }, [allUsers, currentUser]);

  // ✅ Socket connect
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  // ✅ Online users
  useEffect(() => {
    const handleOnlineUsersUpdate = (ids) => {
      dispatch(setOnlineUsers(ids));
    };

    socket.on("updateOnlineUsers", handleOnlineUsersUpdate);

    return () => {
      socket.off("updateOnlineUsers", handleOnlineUsersUpdate);
    };
  }, [dispatch]);
                        
  // ✅ Search
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
                          
    const baseList = allUsers.filter(
      (u) => u._id !== currentUser?._id
    );

    if (!keyword.trim()) {
      setFilteredUsers(baseList);
      return;
    }

    const lower = keyword.toLowerCase();

    setFilteredUsers(
      baseList.filter((u) =>
        u.name?.toLowerCase().includes(lower)
      )
    );
  };

  // ✅ Select / Unselect users
  const handleSelect = (user) => {
    const exists = selectedUsers.some((u) => u._id === user._id);

    if (exists) {
      setSelectedUsers(      
        selectedUsers.filter((u) => u._id !== user._id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]); 
    }
  };

  // ✅ Loading UI             
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-sm text-slate-400">Loading users...</p>
      </div>
    );
  }

  const handleNext = () => { 
     if(selectedUsers.length < 2) return;

     navigate('/create-group-details', {
        state: {
           selectedUsers
        }
     });
                                  
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">

      {/* Search */}
      <div className="sticky top-0 z-10 bg-white p-3 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search people..."
          value={searchKeyword}
          onChange={handleSearch}
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
        />
      </div>

      {/* User List */}
      <div className="flex-1 bg-white">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUsers.some((u) => u._id === user._id);
            const avatarUrl =
              user.avatar?.url ||
              "https://www.w3schools.com/w3images/avatar2.png";

            return (
              <button          
                key={user._id}
                onClick={() => handleSelect(user)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-slate-50 `}            
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  {/* Online dot */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                  )}

                  {/* Selected tick on avatar */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </h3>
  
                    {/* Selected text */}
                    {/* {isSelected && (
                      <span className="text-xs font-medium text-emerald-600">
                        ✓ Selected
                      </span>
                    )} */}
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Tap to select
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">
              No users found...
            </p>
          </div>
        )}
      </div>
      
      <button onClick={handleNext}
        disabled={selectedUsers.length < 2}
         className={`fixed flex cursor-pointer text-align-center bottom-5 right-5 px-3 py-2 rounded-full text-white ${
    selectedUsers.length < 2
      ? "bg-gray-400"
      : "bg-emerald-500"
  }`}
      >
                                                                
        <GrLinkNext /> ({selectedUsers.length})         

      </button>

    </div>
  );
};

export default CreateGroup;