// import React from "react";

// const ChatHeader = ({ selectedUser, isPartnerTyping }) => {

//   const avatarUrl =
//     selectedUser?.avatar?.url ||
//     "https://www.w3schools.com/w3images/avatar2.png"; // same fallback as AllUserList

//   const isOnline = selectedUser?.isOnline;
  
//    const lastSeen = selectedUser?.lastSeen;

//   const formatLastSeen = (date) => {
    
//        if(!date) {
//          return "";
//        }                                                                       
//        const diff = Date.now() - new Date(date).getTime();
       
//        const mins = Math.floor(diff/60000);
                                                                        
//        if(mins < 1) {
//           return "just now";
//        }

//        if(mins < 60) {
//          return `${mins} min ago`;
//        } 
       
//        const hours = Math.floor(mins / 60);

//        if(hours < 24) {
//           return `${hours} hrs ago`;
//        }

//        const days = Math.floor(hours / 24);

//        if(days >= 1) {
//           return `${days} days ago`;
//        }

//        return new Date(date).toLocaleDateString();

//   } 

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         padding: "8px 16px",
//         backgroundColor: "#111827", // match AllUserList background
//         color: "#f9fafb",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         {/* Avatar with online/offline dot */}
//         <div style={{ position: "relative" }}>
//           <img
//             src={avatarUrl}
//             alt={selectedUser?.name || "User Avatar"}
//             style={{
//               width: "40px",
//               height: "40px",
//               borderRadius: "50%",
//               objectFit: "cover",
//               border: `2px solid ${isOnline ? "#22c55e" : "#9ca3af"}`,
//             }}
//           />
//           {isOnline && (
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: 0,
//                 right: 0,
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "50%",
//                 backgroundColor: "#22c55e",
//                 border: "2px solid #111827",
//               }}
//             />
//           )}
//         </div>

//         {/* Name + Status */}
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <h3 style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>
//             {selectedUser?.name || "User"}
//           </h3>
//           <p
//             style={{
//               fontSize: "12px",
//               margin: "2px 0 0 0",
//               color: isOnline ? "#22c55e" : "#9ca3af",
//             }}
//           >
//             {isPartnerTyping ? "typing..." : isOnline ? "Online" : 
//             `last seen ${formatLastSeen(lastSeen)} `}          
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;








// File Location:
// src/components/chat/Chat/ChatHeader.jsx

import React from "react";
// import { ArrowLeft } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";

const ChatHeader = ({
  selectedUser,
  isPartnerTyping,
  onBack, // Used on mobile to go back to user list
}) => {
  const avatarUrl =
    selectedUser?.avatar?.url ||
    "https://www.w3schools.com/w3images/avatar2.png";

  const isOnline = selectedUser?.isOnline;
  const lastSeen = selectedUser?.lastSeen;

  // Format last seen time
  const formatLastSeen = (date) => {
    if (!date) return "";

    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hrs ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";

    return `${days} days ago`;
  };

  // Status text
  const statusText = isPartnerTyping
    ? "typing..."
    : isOnline
    ? "Online"
    : lastSeen
    ? `last seen ${formatLastSeen(lastSeen)}`
    : "Offline";

  return (
    <header className="flex items-center gap-3 border-spacing-x-0.5   px-4 py-3  bg-white shadow-sm">
      {/* Mobile Back Button */}
      <button
        onClick={onBack}
        className="md:hidden flex h-9  items-center ml-1 rounded-full  "
      >
        <IoMdArrowBack />
      </button>

      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={avatarUrl}
          alt={selectedUser?.name || "User Avatar"}
          className="h-10 w-10 rounded-full object-cover  "
        />

      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-sans sm:text-base">
          {selectedUser?.name || "User"}
        </h3>

        <p
          className={`truncate text-xs ${
            isPartnerTyping
              ? "text-green-500"
              : isOnline
              ? "text-green-500"
              : "text-slate-500"
          }`}
        >
          {statusText}
        </p>
      </div>
    </header>
  );
};

export default ChatHeader;