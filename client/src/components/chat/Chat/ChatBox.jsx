

// // // ChatBox.jsx
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ChatHeader from "./ChatHeader";
// import MessageList from "./MessageList";
// import ChatInput from "./ChatInput";

// const ChatBox = ({ socket, currentUserId, selectedUser, chats, setChats }) => {

//   const messages = chats[selectedUser._id] || [];
//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [isPartnerTyping, setIsPartnerTyping] = useState(false);

//   const stopTypingTimeoutRef = useRef(null);
//   const lastTypingEmitRef = useRef(0);

//   // ================= RECEIVE MESSAGE =================
//   useEffect(() => {
//     if (!socket) return;

//     const handleReceiveMessage = (msg) => {
//       setChats(prev => {
//         const userId =
//           msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

//         return {
//           ...prev,
//           [userId]: [...(prev[userId] || []), msg],
//         };
//       });
//     };

//     socket.on("receiveMessage", handleReceiveMessage);
//     return () => socket.off("receiveMessage", handleReceiveMessage);
//   }, [socket, currentUserId, setChats]);

//   // ================= DELIVERY STATUS =================
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     const handleStatus = ({ messageId, status }) => {
//       setChats(prev => ({
//         ...prev,
//         [selectedUser._id]: (prev[selectedUser._id] || []).map(m =>
//           String(m._id) === String(messageId)
//             ? { ...m, status }
//             : m
//         ),
//       }));
//     };

//     socket.on("messageStatusUpdated", handleStatus);
//     return () => socket.off("messageStatusUpdated", handleStatus);
//   }, [socket, selectedUser, setChats]);

//   // ================= SEEN STATUS =================
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     const handleSeen = ({ messageIds }) => {
//       setChats(prev => ({
//         ...prev,
//         [selectedUser._id]: (prev[selectedUser._id] || []).map(m =>
//           messageIds.includes(String(m._id))
//             ? { ...m, status: "seen" }
//             : m
//         ),
//       }));
//     };

//     socket.on("messages-seen-update", handleSeen);
//     return () => socket.off("messages-seen-update", handleSeen);
//   }, [socket, selectedUser, setChats]);

//   // ================= TYPING =================
//   const handleTypingLocal = (value) => {
//     setText(value);
//     const now = Date.now();

//     if (now - lastTypingEmitRef.current > 700) {
//       socket.emit("typing", {
//         fromUserId: currentUserId,
//         toUserId: selectedUser._id,
//       });
//       lastTypingEmitRef.current = now;
//     }

//     clearTimeout(stopTypingTimeoutRef.current);
//     stopTypingTimeoutRef.current = setTimeout(() => {
//       socket.emit("stop-typing", {
//         fromUserId: currentUserId,
//         toUserId: selectedUser._id,
//       });
//     }, 1400);
//   };

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("userTyping", ({ fromUserId }) => {
//       if (String(fromUserId) === String(selectedUser._id)) {
//         setIsPartnerTyping(true);
//       }
//     });

//     socket.on("stop-userTyping", ({ fromUserId }) => {
//       if (String(fromUserId) === String(selectedUser._id)) {
//         setIsPartnerTyping(false);
//       }
//     });

//     return () => {
//       socket.off("userTyping");
//       socket.off("stop-userTyping");
//     };
//   }, [socket, selectedUser]);

//   // ================= SEND MESSAGE =================
//   const handleSendMessage = async (payload) => {
//     let finalImageUrl = "";
//     let finalVideoUrl = "";
//     let finalAudioUrl = "";
//     let messageText = "";

//     if (payload.type === "text") messageText = payload.text;

//     if (payload.type === "image") {
//       const fd = new FormData();
//       fd.append("image", payload.file);
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/message/image",
//         fd,
//         { withCredentials: true }
//       );
//       finalImageUrl = res.data.url;
//     }

//     if (payload.type === "video") {
//       const fd = new FormData();
//       fd.append("video", payload.file);
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/message/video",
//         fd,
//         { withCredentials: true }
//       );
//       finalVideoUrl = res.data.url;
//     }

//     // ✅ AUDIO HANDLING
//     if (payload.type === "audio") {
//       const fd = new FormData();
//       fd.append("audio", payload.file);
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/message/audio",
//         fd,
//         { withCredentials: true }
//       );
//       finalAudioUrl = res.data.url;
//     }

//     const saveRes = await axios.post(
//       "http://localhost:5000/api/v1/message/save",
//       {
//         senderId: currentUserId,
//         receiverId: selectedUser._id,
//         type: payload.type,        // ✅ must send correct type
//         text: messageText,
//         imageUrl: finalImageUrl,
//         videoUrl: finalVideoUrl,
//         audioUrl: finalAudioUrl,   // ✅ must send audio URL
//       },
//       { withCredentials: true }
//     );

//     const savedMessage = saveRes.data.message;
//     socket.emit("sendMessage", savedMessage);

//     setChats(prev => ({
//       ...prev,
//       [selectedUser._id]: [...(prev[selectedUser._id] || []), savedMessage],
//     }));

//     setText("");
//     setImage(null);
//     setSelectedVideo(null);
//   };

//   // ================= MESSAGE SEEN =================
//   useEffect(() => {
//     if (!socket || !messages.length) return;

//     const unseen = messages
//       .filter(m => m.receiverId === currentUserId && m.status !== "seen")
//       .map(m => m._id);

//     if (unseen.length) {
//       socket.emit("message-seen", {
//         messageIds: unseen,
//         senderId: selectedUser._id,
//       });
//     }
//   }, [messages, socket, currentUserId, selectedUser]);

//   // ================= DELETE =================
//   const handleMessageDelete = (messageId) => {
//     socket.emit("deleteMessage", {
//       messageId,
//       receiverId: selectedUser._id,
//     });

//     setChats(prev => ({
//       ...prev,
//       [selectedUser._id]: (prev[selectedUser._id] || []).filter(
//         m => String(m._id) !== String(messageId)
//       ),
//     }));
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "90vh", flex: 1 }}>

//       <ChatHeader selectedUser={selectedUser} isPartnerTyping={isPartnerTyping} />
//       <MessageList messages={messages} currentUserId={currentUserId} onDelete={handleMessageDelete} />
//       <ChatInput
//         text={text}
//         onTextChange={handleTypingLocal}
//         onSendText={handleSendMessage}
//         onSendAudio={handleSendMessage}   // ✅ audio now works
//         setImage={setImage}
//         socket={socket}
//         currentUserId={currentUserId}
//         selectedUser={selectedUser}
//       />
//     </div>
//   );
// };

// export default ChatBox




// File Location:
// src/components/chat/Chat/ChatBox.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { playReceiveSound } from "../../../utils/playReceiveSound";

const ChatBox = ({
  socket,
  currentUserId,
  selectedUser,
  chats,
  setChats,
  onBack, // optional: used for mobile back button
}) => {
  // Prevent errors if no user is selected yet
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-slate-800">
        <p className="text-lg text-slate-400">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  const messages = chats[selectedUser._id] || [];

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const stopTypingTimeoutRef = useRef(null);
  const lastTypingEmitRef = useRef(0);

  // ==========================================
  // RECEIVE NEW MESSAGE
  // ==========================================
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      
      if(msg.senderId !== currentUserId) {
        playReceiveSound();
      }

      setChats((prev) => {
        const userId =
          msg.senderId === currentUserId
            ? msg.receiverId
            : msg.senderId;

        return {
          ...prev,
          [userId]: [...(prev[userId] || []), msg],
        };
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);
   
    return () => {
     
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, currentUserId, setChats]);

  // ==========================================
  // MESSAGE DELIVERY STATUS
  // ==========================================
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleStatus = ({ messageId, status }) => {
      setChats((prev) => ({
        ...prev,
        [selectedUser._id]: (
          prev[selectedUser._id] || []
        ).map((message) =>
          String(message._id) === String(messageId)
            ? { ...message, status }
            : message
        ),
      }));
    };

    socket.on("messageStatusUpdated", handleStatus);

    return () => {
      socket.off("messageStatusUpdated", handleStatus);
    };
  }, [socket, selectedUser, setChats]);

  // ==========================================
  // MESSAGE SEEN STATUS
  // ==========================================
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleSeen = ({ messageIds }) => {
      setChats((prev) => ({
        ...prev,
        [selectedUser._id]: (
          prev[selectedUser._id] || []
        ).map((message) =>
          messageIds.includes(String(message._id))
            ? { ...message, status: "seen" }
            : message
        ),
      }));
    };

    socket.on("messages-seen-update", handleSeen);

    return () => {
      socket.off("messages-seen-update", handleSeen);
    };
  }, [socket, selectedUser, setChats]);

  // ==========================================
  // LOCAL TYPING HANDLER
  // ==========================================
  const handleTypingLocal = (value) => {
    setText(value);

    if (!socket || !selectedUser) return;

    const now = Date.now();

    // Throttle typing event
    if (now - lastTypingEmitRef.current > 700) {
      socket.emit("typing", {
        fromUserId: currentUserId,
        toUserId: selectedUser._id,
      });

      lastTypingEmitRef.current = now;
    }

    // Emit stop typing after inactivity
    clearTimeout(stopTypingTimeoutRef.current);

    stopTypingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        fromUserId: currentUserId,
        toUserId: selectedUser._id,
      });
    }, 1400);
  };

  // ==========================================
  // RECEIVE TYPING EVENTS
  // ==========================================
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleUserTyping = ({ fromUserId }) => {
      if (
        String(fromUserId) === String(selectedUser._id)
      ) {
        setIsPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ fromUserId }) => {
      if (
        String(fromUserId) === String(selectedUser._id)
      ) {
        setIsPartnerTyping(false);
      }
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("stop-userTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("stop-userTyping", handleStopTyping);
    };
  }, [socket, selectedUser]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleSendMessage = async (payload) => {
    try {
      let finalImageUrl = "";
      let finalVideoUrl = "";
      let finalAudioUrl = "";
      let messageText = "";

      // Text
      if (payload.type === "text") {
        messageText = payload.text;
      }

      // Image Upload
      if (payload.type === "image") {
        const formData = new FormData();
        formData.append("image", payload.file);

        const response = await axios.post(
          "http://localhost:5000/api/v1/message/image",
          formData,
          { withCredentials: true }
        );

        finalImageUrl = response.data.url;
      }

      // Video Upload
      if (payload.type === "video") {
        const formData = new FormData();
        formData.append("video", payload.file);

        const response = await axios.post(
          "http://localhost:5000/api/v1/message/video",
          formData,
          { withCredentials: true }
        );

        finalVideoUrl = response.data.url;
      }

      // Audio Upload
      if (payload.type === "audio") {
        const formData = new FormData();
        formData.append("audio", payload.file);

        const response = await axios.post(
          "http://localhost:5000/api/v1/message/audio",
          formData,
          { withCredentials: true }
        );

        finalAudioUrl = response.data.url;
      }

      // Save Message in Database
      const saveResponse = await axios.post(
        "http://localhost:5000/api/v1/message/save",
        {
          senderId: currentUserId,
          receiverId: selectedUser._id,
          type: payload.type,
          text: messageText,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          audioUrl: finalAudioUrl,
        },
        { withCredentials: true }
      );

      const savedMessage = saveResponse.data.message;

      // Emit to Socket.IO
      socket.emit("sendMessage", savedMessage);

      // Update Local State
      setChats((prev) => ({
        ...prev,
        [selectedUser._id]: [
          ...(prev[selectedUser._id] || []),
          savedMessage,
        ],
      }));

      // Reset Local UI State
      setText("");
      setImage(null);
      setSelectedVideo(null);
      setIsPartnerTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ==========================================
  // MARK MESSAGES AS SEEN
  // ==========================================
  useEffect(() => {
    if (
      !socket ||
      !selectedUser ||
      !messages.length
    ) {
      return;
    }

    const unseenMessageIds = messages
      .filter(
        (message) =>
          message.receiverId === currentUserId &&
          message.status !== "seen"
      )
      .map((message) => message._id);

    if (unseenMessageIds.length > 0) {
      socket.emit("message-seen", {
        messageIds: unseenMessageIds,
        senderId: selectedUser._id,
      });
    }
  }, [
    messages,
    socket,
    currentUserId,
    selectedUser,
  ]);

  // ==========================================
  // DELETE MESSAGE
  // ==========================================
  const handleMessageDelete = (messageId) => {
    if (!socket || !selectedUser) return;

    socket.emit("deleteMessage", {
      messageId,
      receiverId: selectedUser._id,
    });

    setChats((prev) => ({
      ...prev,
      [selectedUser._id]: (
        prev[selectedUser._id] || []
      ).filter(
        (message) =>
          String(message._id) !== String(messageId)
      ),
    }));
  };

  // ==========================================
  // CLEANUP
  // ==========================================
  useEffect(() => {
    return () => {
      clearTimeout(stopTypingTimeoutRef.current);
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="flex h-full flex-1 flex-col ">
      <ChatHeader
        selectedUser={selectedUser}
        isPartnerTyping={isPartnerTyping}
        onBack={onBack}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onDelete={handleMessageDelete}
      />

      <ChatInput
        text={text}
        onTextChange={handleTypingLocal}
        onSendText={handleSendMessage}
        onSendAudio={handleSendMessage}
        setImage={setImage}
        socket={socket}
        currentUserId={currentUserId}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default ChatBox;