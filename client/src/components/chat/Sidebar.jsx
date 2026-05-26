

// import React, { useEffect, useState } from "react";
// import AllUserList from "./AllUserList";
// import ChatBox from "./Chat/ChatBox";
// import axios from "axios";
// import socket from "../socket/socket";

// const Sidebar = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   // const [socket, setSocket] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [showUsers, setShowUsers] = useState(true); // controls visibility of AllUser list


//   const [chats, setChats] = useState({});

//   const handleSelectUser = (user) =>  setSelectedUser(user);

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/v1/user/me", {
//           withCredentials: true,
//         });
//         setCurrentUser(res.data.user);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCurrentUser();
//   }, []);

//   useEffect(() => {
//   socket.connect();
//   return () => socket.disconnect();
// }, []);

//   // Emit online after user is loaded
//   useEffect(() => {
//     if (socket && currentUser?._id) {
//       socket.emit("userOnline", currentUser._id);
//     }
//   }, [socket, currentUser]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div style={{ display: "flex", height: "90vh", fontFamily: '"Poppins", sans-serif' }}>
//       {/* Sidebar
//       <div style={{ width: "300px", background: "#0f172a", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
//         <div style={{ flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
//           <AllUserList onSelectUser={handleSelectUser} currentUserId={currentUser._id} socket={socket} />
//         </div>
//       </div> */}

//       <div
//   style={{
//     width: showUsers ? "300px" : "0px", // width when shown or hidden
//     transition: "width 0.3s",            // smooth slide animation
//     overflow: "hidden",
//     background: "#0f172a",
//     color: "#f8fafc",
//     display: "flex",
//     flexDirection: "column",
//   }}
// >
//   <div
//     style={{
//       flex: 1,
//       overflowY: "auto",
//       padding: "15px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//     }}
//   >
//     <AllUserList
//       onSelectUser={handleSelectUser}
//       currentUserId={currentUser._id}
//       socket={socket}
//     />
//   </div>
// </div>


//       {/* Chat */}
//       <div style={{ flex: 1, width: "900px", background: "#1e293b", display: "flex", justifyContent: "center", alignItems: "center" }}>
//         {socket && currentUser && selectedUser ? (
//           <ChatBox socket={socket} currentUserId={currentUser._id} selectedUser={selectedUser} chats={chats} setChats={setChats} />
//         ) : (
//           <div style={{ fontSize: "18px", color: "#64748b" }}>Select a user to start chatting</div>
//         )}
//       </div>

//        <button
//   onClick={() => setShowUsers(!showUsers)}
//   style={{
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     zIndex: 10,
//     padding: "8px 12px",
//     background: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   }}
// >
//   {showUsers ? "Hide Users" : "Show Users"}
// </button>


//     </div>
//   );
// };

// export default Sidebar;






// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import AllUserList from "./AllUserList";
// import ChatBox from "./Chat/ChatBox";
// import socket from "../socket/socket";

// const Sidebar = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [chats, setChats] = useState({});

//   // Controls desktop sidebar toggle
//   const [showUsers, setShowUsers] = useState(true);

//   // Controls mobile chat screen switching
//   const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

//   // Handle user selection
//   const handleSelectUser = (user) => {
//     setSelectedUser(user);

//     // On mobile, open chat screen and hide user list
//     if (window.innerWidth < 768) {
//       setIsMobileChatOpen(true);
//     }
//   };

//   // Back button for mobile
//   const handleBackToUsers = () => {
//     setIsMobileChatOpen(false);
//   };

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/v1/user/me",
//           {
//             withCredentials: true,
//           }
//         );

//         setCurrentUser(res.data.user);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   // Connect socket
//   useEffect(() => {
//     socket.connect();

//     return () => socket.disconnect();
//   }, []);

//   // Emit online event
//   useEffect(() => {
//     if (currentUser?._id) {
//       socket.emit("userOnline", currentUser._id);
//     }
//   }, [currentUser]);

//   // Reset mobile view when screen becomes desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsMobileChatOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-slate-100">
//         <p className="text-slate-500 text-lg">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative flex h-full w-full overflow-hidden font-sans">
//       {/* =========================
//           LEFT PANEL - USER LIST
//       ========================== */}
//       <div
//         className={`
//           bg-slate-900 text-slate-50 flex flex-col overflow-hidden
//           transition-all duration-300 ease-in-out
          
//           /* Desktop */
//           md:relative md:flex md:w-[320px] md:min-w-[320px]
//           ${showUsers ? "md:w-[320px]" : "md:w-0"}
          
//           /* Mobile */
//           ${
//             isMobileChatOpen
//               ? "hidden"
//               : "flex w-full"
//           }
//         `}
//       >
//         <div className="flex-1 overflow-y-auto p-4">
//           <AllUserList
//             onSelectUser={handleSelectUser}
//             currentUserId={currentUser._id}
//             socket={socket}
//           />
//         </div>
//       </div>

//       {/* =========================
//           RIGHT PANEL - CHAT AREA
//       ========================== */}
//       <div
//         className={`
//           flex-1 bg-slate-800
//           ${isMobileChatOpen ? "flex" : "hidden"}
//           md:flex
//         `}
//       >
//         {currentUser && selectedUser ? (
//           <ChatBox
//             socket={socket}
//             currentUserId={currentUser._id}
//             selectedUser={selectedUser}
//             chats={chats}
//             setChats={setChats}
//             onBack={handleBackToUsers} // Use this inside ChatBox for a mobile back button
//           />
//         ) : (
//           <div className="hidden md:flex flex-1 items-center justify-center">
//             <p className="text-lg text-slate-400">
//               Select a user to start chatting
//             </p>
//           </div>
//         )}
//       </div>

//       {/* =========================
//           DESKTOP TOGGLE BUTTON
//       ========================== */}
//       <button
//         onClick={() => setShowUsers(!showUsers)}
//         className="hidden md:flex absolute top-4 left-4 z-10 items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
//       >
//         {showUsers ? "Hide Users" : "Show Users"}
//       </button>
//     </div>
//   );
// };

// export default Sidebar;






import React, { useEffect, useState } from "react";
import axios from "axios";

import AllUserList from "./AllUserList";
import ChatBox from "./Chat/ChatBox";
import socket from "../socket/socket";

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState({});

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(true);

  // Select user
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    if (window.innerWidth < 768) {
      setIsMobileChatOpen(true);
    }
  };

  // Back button
  const handleBackToUsers = () => {
    setIsMobileChatOpen(false);
  };

  // Fetch user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/user/me",
          { withCredentials: true }
        );
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Socket connect
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("userOnline", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileChatOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden font-sans">

      {/* ================= LEFT SIDEBAR ================= */}
      <div
        className={`
          flex flex-col
          transition-all duration-300
          bg-slate-100
          md:w-[340px]

          ${isMobileChatOpen ? "hidden" : "flex w-full"}
        `}
      >
   

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">
          <AllUserList
            onSelectUser={handleSelectUser}
            currentUserId={currentUser._id}
            socket={socket}
          />
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div
        className={`
          flex-1
          bg-slate-100
          md:flex
          ${isMobileChatOpen ? "flex" : "hidden"}
        `}
      >
        {currentUser && selectedUser ? (
          <ChatBox
            socket={socket}
            currentUserId={currentUser._id}
            selectedUser={selectedUser}
            chats={chats}
            setChats={setChats}
            onBack={handleBackToUsers}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <p className="text-gray-400 text-lg">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>

      {/* ================= TOGGLE BUTTON ================= */}
      {/* <button
        onClick={() => setShowUsers(!showUsers)}
        className="hidden md:flex absolute top-4 left-4 z-10 bg-[#25D366] text-black px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
      >
        {showUsers ? "Hide" : "Show"}
      </button> */}
    </div>
  );
};

export default Sidebar;