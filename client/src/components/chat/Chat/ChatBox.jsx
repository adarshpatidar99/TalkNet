import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const API_URL = import.meta.env.VITE_API_URL;
                                            
const ChatBox = ({                
  socket,
  currentUser,
  currentUserId,
  selectedUser,
  chats,
  setChats,
  onBack,
}) => {
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
  const [groupTypingUsers, setGroupTypingUsers] = useState([]);

  const stopTypingTimeoutRef = useRef(null);
  const lastTypingEmitRef = useRef(0);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const loadMessages = async () => {
      try {
        // GROUP CHAT
         if (selectedUser.isGroupChat) {
         const res = await axios.get(
        `${API_URL}/api/v1/message/group/${selectedUser._id}`,
        { withCredentials: true }
    );

  const messages = res.data.messages;

  setChats((prev) => ({
    ...prev,
    [selectedUser._id]: messages,
  }));

  // Tell backend these messages have been delivered to me
  messages.forEach((msg) => {
    const senderId = msg.senderId?._id || msg.senderId;

       if (String(senderId) !== String(currentUserId)) {
      socket.emit("group-message-delivered", {  
        messageId: msg._id,
        userId: currentUserId,
      });
      }
    });
  }
        // PRIVATE CHAT
        else {
          const res = await axios.get(
            `${API_URL}/api/v1/message/private/${currentUserId}/${selectedUser._id}`,
            { withCredentials: true }
          );

          setChats((prev) => ({
          ...prev,
            [selectedUser._id]: res.data.messages,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadMessages();
  }, [
    selectedUser?._id,
    selectedUser?.isGroupChat,
    currentUserId,
    setChats,
  ]);

  // ================= RECEIVE PRIVATE MESSAGE =================
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {

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

    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, currentUserId, setChats]);


  useEffect(() => {
  if (!socket) return;

  const handleGroupMessage = (msg) => {
    const senderId = msg.senderId?._id || msg.senderId;
    if (String(senderId) === String(currentUserId)) {
      return;
    }

    const chatId = msg.chatId?._id || msg.chatId;
    setChats((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), msg],
    }));

      socket.emit("group-message-delivered", {
       messageId: msg._id,
       userId: currentUserId,
  })
  };                                   

  socket.on("newGroupMessage", handleGroupMessage);

  return () => {
    socket.off("newGroupMessage", handleGroupMessage);
  };
}, [socket, currentUserId, setChats]);
         
  // ================= JOIN GROUP CHAT =================
  useEffect(() => {
    if (!socket ||!selectedUser?._id ||!selectedUser?.isGroupChat) return; 

    socket.emit("joinChat", selectedUser._id);
  }, [socket, selectedUser]);

  // ================= STATUS UPDATE =================
  useEffect(() => {
    if (!socket ||!selectedUser) return;

    const handleStatus = ({
      messageId,
      messageIds,
      status,
    }) => {
      setChats((prev) => ({
      ...prev,
        [selectedUser._id]: (
          prev[selectedUser._id] || []
        ).map((m) => {
          const shouldUpdate =
            String(m._id) === String(messageId) ||
            messageIds?.includes(String(m._id));

          return shouldUpdate
          ? {...m, status }
            : m;
        }),
      }));
    };

    socket.on("messageStatusUpdated", handleStatus);

    return () => socket.off("messageStatusUpdated", handleStatus);
  }, [socket, selectedUser, setChats]);

  // ================= GROUP MESSAGE DELIVERED =================

useEffect(() => {
  if (!socket || !selectedUser?.isGroupChat) return;

  const handleGroupDelivered = ({ messageId, deliveredTo, status }) => {
  
    setChats((prev) => ({
      ...prev,
      [selectedUser._id]: (prev[selectedUser._id] || []).map((msg) =>
        String(msg._id) === String(messageId)
          ? {
           ...msg, deliveredTo, status }
          : msg
      ),
    }));
  };

  socket.on(
    "group-message-delivered-update",
    handleGroupDelivered
  );

  return () => {
    socket.off(
      "group-message-delivered-update",
      handleGroupDelivered
    );
  };
}, [socket, selectedUser, setChats]);

  // ================= RESET TYPING =================
  useEffect(() => {
    setIsPartnerTyping(false);
    setGroupTypingUsers([]);
  }, [selectedUser?._id]);

  // ================= SEEN =================
  useEffect(() => {
    if (!socket ||!selectedUser) return;

    const handleSeen = ({ messageIds }) => {
      setChats((prev) => ({
      ...prev,
        [selectedUser._id]: (prev[selectedUser._id] || []).map((m) =>
          messageIds.includes(String(m._id))
          ? {...m, status: "seen" }
            : m
        ),
      }));
    };

    socket.on("messages-seen-update", handleSeen);

    return () => socket.off("messages-seen-update", handleSeen);
  }, [socket, selectedUser, setChats]);

  const handleTypingLocal = (value) => {
    setText(value);

    if (!socket ||!selectedUser) return;

    if (!value || value.trim() === "") return;

    const now = Date.now();

    if (now - lastTypingEmitRef.current > 700) {
      if (selectedUser?.isGroupChat) {
        socket.emit("group-typing", {
          chatId: selectedUser._id,
          fromUserId: currentUserId,
          userName: currentUser?.name
        });
      } else {
        socket.emit("typing", {
          fromUserId: currentUserId,      
          toUserId: selectedUser._id,
        });
      }

      lastTypingEmitRef.current = now;   
    }

    clearTimeout(stopTypingTimeoutRef.current);

    stopTypingTimeoutRef.current = setTimeout(() => {
      if (selectedUser?.isGroupChat) {
        socket.emit("group-stop-typing", {
          chatId: selectedUser._id,
          fromUserId: currentUserId,
          userName: currentUser?.name  
        });
      } else {
        socket.emit("stop-typing", {
          fromUserId: currentUserId,
          toUserId: selectedUser._id,
        });
      }
    }, 1400);
  };

  useEffect(() => {
    if (!socket ||!selectedUser) return;

    const handleUserTyping = ({ fromUserId }) => {
      if (
      !selectedUser.isGroupChat &&
        String(fromUserId) === String(selectedUser._id)
      ) {
        setIsPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ fromUserId }) => {
      if (
      !selectedUser.isGroupChat &&
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

  useEffect(() => { 

      if(!socket || !selectedUser?.isGroupChat) {
         return;
      }

      const handleGroupTyping = ({ fromUserId, userName }) => {

        if(String(fromUserId) === String(currentUserId)) {
           return;
        }
        
         setGroupTypingUsers((prev) => {
           const exists = prev.find(       
            (user) => user.id === fromUserId
           );

           if(exists) return prev;     

           return [
            ...prev,
            {
               id: fromUserId,
               name: userName,
            }
           ] 
         })
      }

      const handleGroupStopTyping = ({fromUserId}) => {
         
         setGroupTypingUsers((prev) => 
          prev.filter((user) => user.id !== fromUserId))
      }

      socket.on("group-userTyping", handleGroupTyping);
      socket.on("group-stop-userTyping", handleGroupStopTyping);
         
      return () => {
      socket.off("group-userTyping", handleGroupTyping);
      socket.off("group-stop-userTyping", handleGroupStopTyping);  
      }
 
  }, [socket, selectedUser]);

  const handleSendMessage = async (payload) => {

    const tempId = Date.now().toString();

    // Create TEMP message (shows immediately in UI)
    const tempMessage = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedUser._id,
      type: payload.type,
      text: payload.type === "text"? payload.text : "",
      imageUrl:
        payload.type === "image"
        ? URL.createObjectURL(payload.file)
          : "",
      videoUrl: "",
      audioUrl: "",
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    // Show instantly in UI
    setChats((prev) => ({
    ...prev,
      [selectedUser._id]: [
      ...(prev[selectedUser._id] || []),
        tempMessage,
      ],
    }));

    try {

      let groupFinalImageUrl = "";
      let groupFinalVideoUrl = "";
      let groupFinalAudioUrl = "";

      if (payload.type === "image") {
        const formData = new FormData();
        formData.append("image", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/image`,
          formData,
          { withCredentials: true }    
        );

        groupFinalImageUrl = res.data.url;
      }                                

      if (payload.type === "video") {
        const formData = new FormData();
        formData.append("video", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/video`,
          formData,
          { withCredentials: true }
        );

        groupFinalVideoUrl = res.data.url;
      }

      if (payload.type === "audio") {
        const formData = new FormData();
        formData.append("audio", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/voice`,
          formData,
          { withCredentials: true }
        );

        groupFinalAudioUrl = res.data.url;
      }

      if (selectedUser?.isGroupChat) {

        const res = await axios.post(
          `${API_URL}/api/v1/chat/group/send`,
          {
            chatId: selectedUser._id,
            type: payload.type,
            text: payload.type === "text"? payload.text : "",
            imageUrl: groupFinalImageUrl,
            videoUrl: groupFinalVideoUrl,
            audioUrl: groupFinalAudioUrl,
          },
          {
            withCredentials: true,
          }
        );

        setText("");

        const savedMessage = res.data.message;

        setChats((prev) => ({
        ...prev,
          [selectedUser._id]: (prev[selectedUser._id] || []).map((m) =>
            m._id === tempId? savedMessage : m
          ),
        }));

        return;
      }

      let messageText = "";
      let finalImageUrl = "";
      let finalVideoUrl = "";
      let finalAudioUrl = "";

      if (payload.type === "text") messageText = payload.text;

      if (payload.type === "image") {
        const formData = new FormData();
        formData.append("image", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/image`,
          formData,
          { withCredentials: true }
        );

        finalImageUrl = res.data.url;
      }

      if (payload.type === "video") {
        const formData = new FormData();
        formData.append("video", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/video`,
          formData,
          { withCredentials: true }
        );

        finalVideoUrl = res.data.url;
      }

      if (payload.type === "audio") {
        const formData = new FormData();
        formData.append("audio", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/voice`,
          formData,
          { withCredentials: true }
        );

        finalAudioUrl = res.data.url;
      }

      const saveRes = await axios.post(
        `${API_URL}/api/v1/message/save`,
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

      const savedMessage = saveRes.data.message;

      socket.emit("sendMessage", savedMessage);
    
      setChats((prev) => ({
      ...prev,
        [selectedUser._id]: (prev[selectedUser._id] || []).map((m) =>
          m._id === tempId? savedMessage : m
        ),
      }));

      setText("");
      setImage(null);
      setSelectedVideo(null);
      setIsPartnerTyping(false);
      } catch (err) {
  console.error(err);

  setChats((prev) => ({
    ...prev,
    [selectedUser._id]: (prev[selectedUser._id] || []).map((m) =>
      m._id === tempId ? { ...m, status: "failed" } : m
    ),
  }));
}
  };

  // ================= SEEN =================
  useEffect(() => {
    if (!socket ||!messages.length) return;

    const unseen = messages
   .filter(
        (m) =>
          String(m.receiverId) === String(currentUserId) &&
          m.status!== "seen"
      )
   .map((m) => m._id);

    if (unseen.length) {
      socket.emit("message-seen", {
        messageIds: unseen,
        senderId: selectedUser._id,
      });
    }
  }, [messages, selectedUser]);

  // group message seen       
  useEffect(() => {
    
     if(!selectedUser?.isGroupChat || !socket) {
         return;                           
     }

     messages.forEach((message) => {     

        const senderId = message.senderId?._id || 
        message.senderId;

        if(String(senderId) !== String(currentUserId)) {
           socket.emit("group-message-seen", {
               messageId: message._id,
               userId: currentUserId,
           }); 
        }
     });
  }, [messages]); 

  useEffect(() => { 

     if(!socket || selectedUser?.isGroupChat ) {
       return;
     }

     const handleSeen = ({ messageId, seenBy }) => {
       
         setChats((prev) => ({
             ...prev,
             [selectedUser._id]: 
              (prev[selectedUser._id] || []).map((msg) => 
                 String(msg._id) === String(messageId)
               ? {
                 ...msg,
                 seenBy
               } : msg
              )
         }))
     };

     socket.on("group-message-seen-update", 
        handleSeen
     )                                        
                                                
     return () => {
          socket.off("group-message-seen-update", handleSeen); 
     }                         
 
  }, [socket, selectedUser]);          


  useEffect(() => {
    return () => clearTimeout(stopTypingTimeoutRef.current);
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col">
      <ChatHeader                     
        selectedUser={selectedUser}
        isPartnerTyping={isPartnerTyping}
        groupTypingUsers={groupTypingUsers}
        onBack={onBack}
      />

      <MessageList
        messages={messages}
        selectedUser={selectedUser}
        currentUserId={currentUserId}
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