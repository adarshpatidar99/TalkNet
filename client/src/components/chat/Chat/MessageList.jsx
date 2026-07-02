


// import React, { useEffect, useRef } from "react";
// import MessageItem from "./MessageItem";

// const MessageList = ({ messages, currentUserId, onDelete }) => {
                                                                    
//   console.log("📩 MessageList messages:", messages);

//   const chatRef = useRef(null);

//   const scrollToBottom = () => {
//     if (!chatRef.current) return;
//     chatRef.current.scrollTop = chatRef.current.scrollHeight;
//   };

//   useEffect(() => {
//     scrollToBottom();
//     const timer = setTimeout(scrollToBottom, 150);
//     return () => clearTimeout(timer);
//   }, [messages]);

//   return (
//     <div
//       ref={chatRef}
//       style={{
//         flex: 1,
//         padding: "10px", // reduce padding
//         overflowY: "auto",
//         display: "flex",
//         flexDirection: "column",
//         gap: "4px", // small gap between messages
//         backgroundColor: "#f1f5f9"
//       }}
//     >
//       {messages.map(msg => (
//         <MessageItem
//           key={msg._id}
//           message={msg}
//           currentUserId={currentUserId}
//           onDelete={onDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default MessageList;






// // src/components/chat/MessageList.jsx

// import React, { useEffect, useRef } from "react";
// import MessageItem from "./MessageItem";

// const MessageList = ({ messages = [], currentUserId, onDelete }) => {
//   const chatRef = useRef(null);
//   const bottomRef = useRef(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     if (!bottomRef.current) return;

//     // Small timeout ensures images/videos are rendered before scrolling
//     const timer = setTimeout(() => {
//       bottomRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [messages]);

//   return (
//     <div
//       ref={chatRef}
//       className="
//         flex-1
//         overflow-y-auto
//         bg-slate-100
//         px-2 py-3
//         sm:px-4
//         space-y-1.5
//         scroll-smooth
//       "
//     >
//       {messages.length > 0 ? (
//         messages.map((msg) => (
//           <MessageItem
//             key={msg._id}
//             message={msg}
//             currentUserId={currentUserId}
//             onDelete={onDelete}
//           />
//         ))
//       ) : (
//         <div className="flex h-full items-center justify-center">
//           <p className="text-sm text-slate-400">
//             No messages yet. Start the conversation.
//           </p>
//         </div>
//       )}

//       {/* Invisible element used for auto-scroll */}
//       <div ref={bottomRef} />
//     </div>
//   );
// };

// export default MessageList;






// // src/components/chat/MessageList.jsx

// import React, { useEffect, useRef } from "react";
// import MessageItem from "./MessageItem";

// const MessageList = ({
//   messages = [],
//   currentUserId,
//   onDelete,
// }) => {
//   const chatRef = useRef(null);
//   const bottomRef = useRef(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     if (!bottomRef.current) return;

//     // Small timeout ensures images/videos are rendered before scrolling
//     const timer = setTimeout(() => {
//       bottomRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [messages]);

//   return (
//     <div
//       ref={chatRef}
//       className="
//         flex-1
//         overflow-y-auto
//         bg-[#F8FAFC]
//         px-2 py-3
//         sm:px-4
//         space-y-1.5
//         scroll-smooth
//       "
//     >
//       {messages.length > 0 ? (
//         messages.map((msg) => (
//           <MessageItem
//             key={msg._id}
//             message={msg}
//             currentUserId={currentUserId}
//             onDelete={onDelete}
//           />
//         ))
//       ) : (
//         <div className="flex h-full items-center justify-center">
//           <p className="text-sm text-slate-400">
//             No messages yet. Start the conversation.
//           </p>
//         </div>
//       )}

//       {/* Invisible element used for auto-scroll */}
//       <div ref={bottomRef} />
//     </div>
//   );
// };

// export default MessageList;




// src/components/chat/MessageList.jsx

import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({
  messages = [],
  selectedUser,
  currentUserId,
  onDelete,
}) => {
  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (!bottomRef.current) return;

    // Small timeout ensures images/videos are rendered before scrolling
    const timer = setTimeout(() => {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div
      ref={chatRef}
      className="
        flex-1
        overflow-y-auto

        /* WhatsApp-like soft chat background */
        bg-[#EFEAE2]

        px-2 py-3
        sm:px-4
        space-y-1.5
        scroll-smooth
      "
    >                            
      {messages.length > 0 ? (
        messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            selectedUser={selectedUser}
            currentUserId={currentUserId}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            No messages yet. Start the conversation.
          </p>
        </div>
      )}

      {/* Invisible element used for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;