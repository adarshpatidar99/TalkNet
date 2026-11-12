import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import { toast } from "react-toastify";

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
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videoUploads, setVideoUploads] = useState({});

  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [groupTypingUsers, setGroupTypingUsers] = useState([]);

  // Pagination state for each conversation.
const [paginationByChat, setPaginationByChat] = useState({});
const [loadingOlderByChat, setLoadingOlderByChat] = useState({});

// Prevent duplicate older-message requests for the same chat.
const loadingOlderRequests = useRef(new Set());

  const stopTypingTimeoutRef = useRef(null);
  const lastTypingEmitRef = useRef(0);

  const selectedChatId = selectedUser?._id;
  const isGroupChat = Boolean(selectedUser?.isGroupChat);

  const messages = selectedChatId
    ? chats[selectedChatId] || []
    : [];
  
   // ================= LOAD MESSAGES =================
   useEffect(() => {
  if (!selectedChatId) return;

  let cancelled = false;

  const loadMessages = async () => {
    try {
      let res;

      // GROUP CHAT
      if (isGroupChat) {
        res = await axios.get(
          `${API_URL}/api/v1/message/group/${selectedChatId}`,
          {
            params: { limit: 30 },
            withCredentials: true,
          }
        );
      } else {
        // PRIVATE CHAT
        res = await axios.get(
          `${API_URL}/api/v1/message/private/${currentUserId}/${selectedChatId}`,
          {
            params: { limit: 30 },
            withCredentials: true,
          }
        );
      }

      if (cancelled) return;

      const loadedMessages = res.data.messages || [];
      const pagination = res.data.pagination || {};

      setChats((prev) => {
        const existing = prev[selectedChatId] || [];
        const messageMap = new Map();

        loadedMessages.forEach((msg) => {
          messageMap.set(String(msg._id), msg);
        });

        existing.forEach((msg) => {
          messageMap.set(String(msg._id), msg);
        });

        const mergedMessages = Array.from(messageMap.values());

        mergedMessages.sort(
          (a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        return {
          ...prev,
          [selectedChatId]: mergedMessages,
        };
      });

      // Save pagination information for both chat types.
      setPaginationByChat((prev) => ({
        ...prev,
        [selectedChatId]: {
          hasMore: Boolean(pagination.hasMore),
          nextCursor: pagination.nextCursor || null,
        },
      }));

      // Mark loaded group messages as delivered.
      if (isGroupChat) {
        loadedMessages.forEach((msg) => {
          const senderId =
            msg.senderId?._id || msg.senderId;

          if (String(senderId) !== String(currentUserId)) {
            socket?.emit("group-message-delivered", {
              messageId: msg._id,
              userId: currentUserId,
            });
          }
        });
      }
    } catch (err) {
      if (!cancelled) {
        console.error("Failed to load messages:", err);
      }
    }
  };

  loadMessages();

  return () => {
    cancelled = true;
  };
}, [
  selectedChatId,
  isGroupChat,
  currentUserId,
  setChats,
  socket,
   ]);

  // ================= RECEIVE PRIVATE MESSAGE =================
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      const senderId = msg.senderId?._id || msg.senderId;
      const receiverId =
        msg.receiverId?._id || msg.receiverId;

      const chatId =
        String(senderId) === String(currentUserId)
          ? receiverId
          : senderId;

      if (!chatId) return;

      setChats((prev) => {
        const existing = prev[chatId] || [];

        if (
          msg._id &&
          existing.some(
            (m) => String(m._id) === String(msg._id)
          )
        ) {
          return prev;
        }

        return {
          ...prev,
          [chatId]: [...existing, msg],
        };
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, currentUserId, setChats]);

  // ================= RECEIVE GROUP MESSAGE =================
  useEffect(() => {
    if (!socket) return;

    const handleGroupMessage = (msg) => {
      const senderId = msg.senderId?._id || msg.senderId;

      if (String(senderId) === String(currentUserId)) {
        return;
      }

      const chatId = msg.chatId?._id || msg.chatId;

      if (!chatId) return;

      setChats((prev) => {
        const existing = prev[chatId] || [];

        if (
          msg._id &&
          existing.some(
            (m) => String(m._id) === String(msg._id)
          )
        ) {
          return prev;
        }

        return {
          ...prev,
          [chatId]: [...existing, msg],
        };
      });

      socket.emit("group-message-delivered", {
        messageId: msg._id,
        userId: currentUserId,
      });
    };

    socket.on("newGroupMessage", handleGroupMessage);

    return () => {
      socket.off("newGroupMessage", handleGroupMessage);
    };
  }, [socket, currentUserId, setChats]);

    // ================= LOAD OLDER MESSAGES =================
  const loadOlderMessages = useCallback(async () => {
  if (!selectedChatId) return;

  const chatId = selectedChatId;
  const pagination = paginationByChat[chatId];

  if (!pagination?.hasMore || !pagination.nextCursor) return;
  if (loadingOlderRequests.current.has(chatId)) return;

  loadingOlderRequests.current.add(chatId);

  setLoadingOlderByChat((prev) => ({
    ...prev,
    [chatId]: true,
  }));

  try {
    const endpoint = isGroupChat
      ? `${API_URL}/api/v1/message/group/${chatId}`
      : `${API_URL}/api/v1/message/private/${currentUserId}/${chatId}`;

    const res = await axios.get(endpoint, {
      params: {
        before: pagination.nextCursor,
        limit: 30,
      },
      withCredentials: true,
    });

    const olderMessages = res.data.messages || [];
    const newPagination = res.data.pagination || {};

    setChats((prev) => {
      const existing = prev[chatId] || [];

      const messageMap = new Map();

      olderMessages.forEach((msg) => {
        messageMap.set(String(msg._id), msg);
      });

      existing.forEach((msg) => {
        messageMap.set(String(msg._id), msg);
      });

      const mergedMessages = Array.from(messageMap.values());

      mergedMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      return {
        ...prev,
        [chatId]: mergedMessages,
      };
    });

    setPaginationByChat((prev) => ({
      ...prev,
      [chatId]: {
        hasMore: Boolean(newPagination.hasMore),
        nextCursor: newPagination.nextCursor || null,
      },
    }));
  } catch (err) {
    console.error("Failed to load older messages:", err);
    throw err;
  } finally {
    loadingOlderRequests.current.delete(chatId);

    setLoadingOlderByChat((prev) => ({
      ...prev,
      [chatId]: false,
    }));
  }
}, [
  selectedChatId,
  isGroupChat,
  currentUserId,
  paginationByChat,
  setChats,
]);

     // ================= DELETE MESSAGE FOR EVERYONE =================
  const handleDeleteMessageForEveryone = async (messageId) => {
    if (!selectedChatId || !messageId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this message for everyone?"
    );

    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/message/${messageId}/for-everyone`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to delete message."
        );
      }

      // Update the current user's message immediately.
      setChats((prev) => ({
        ...prev,
        [selectedChatId]: (prev[selectedChatId] || []).map((msg) =>
          String(msg._id) === String(messageId)
            ? {
                ...msg,
                text: "",
                content: "",
                imageUrl: "",
                audioUrl: "",
                videoUrl: "",
                isDeletedForEveryone: true,
                deletedAt: res.data.deletedAt || new Date().toISOString(),
                deletedPlaceholder: "This message was deleted.",
              }
            : msg
        ),
      }));
    } catch (err) {
      console.error("Failed to delete message for everyone:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete message. Please try again."
      );
    }
  };

  // ================= MESSAGE DELETED FOR EVERYONE =================
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleMessageDeletedForEveryone = (payload) => {
      const {
        messageId,
        senderId,
        receiverId,
        chatId,
        isGroupChat: deletedFromGroup,
        deletedAt,
      } = payload || {};

      if (!messageId) return;

      // Group messages use the group chat ID.
      // Private messages use the other participant's ID.
      const conversationId = deletedFromGroup
        ? chatId
        : String(senderId) === String(currentUserId)
          ? receiverId
          : senderId;

      if (!conversationId) return;

      setChats((prev) => {
        const existing = prev[conversationId] || [];

        return {
          ...prev,
          [conversationId]: existing.map((msg) =>
            String(msg._id) === String(messageId)
              ? {
                  ...msg,
                  text: "",
                  content: "",
                  imageUrl: "",
                  audioUrl: "",
                  videoUrl: "",
                  replyTo: null,
                  isDeletedForEveryone: true,
                  deletedAt:
                    deletedAt || new Date().toISOString(),
                  deletedPlaceholder: "This message was deleted.",
                }
              : msg
          ),
        };
      });
    };

    socket.on(
      "messageDeletedForEveryone",
      handleMessageDeletedForEveryone
    );

    return () => {
      socket.off(
        "messageDeletedForEveryone",
        handleMessageDeletedForEveryone
      );
    };
  }, [socket, currentUserId, setChats]);

  // ================= JOIN GROUP CHAT =================
  useEffect(() => {
    if (!socket || !selectedChatId || !isGroupChat) {
      return;
    }

    socket.emit("joinChat", selectedChatId);
  }, [socket, selectedChatId, isGroupChat]);

  // ================= PRIVATE MESSAGE STATUS UPDATE =================
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    const handleStatus = ({
      messageId,
      messageIds,
      status,
    }) => {
      setChats((prev) => ({
        ...prev,
        [selectedChatId]: (
          prev[selectedChatId] || []
        ).map((msg) => {
          const shouldUpdate =
            String(msg._id) === String(messageId) ||
            messageIds?.some(
              (id) => String(id) === String(msg._id)
            );

          return shouldUpdate
            ? { ...msg, status }
            : msg;
        }),
      }));
    };

    socket.on("messageStatusUpdated", handleStatus);

    return () => {
      socket.off("messageStatusUpdated", handleStatus);
    };
  }, [socket, selectedChatId, setChats]);

  // ================= GROUP MESSAGE DELIVERED UPDATE =================
  useEffect(() => {
    if (!socket || !selectedChatId || !isGroupChat) {
      return;
    }

    const handleGroupDelivered = ({
      messageId,
      deliveredTo,
      status,
    }) => {
      setChats((prev) => ({
        ...prev,
        [selectedChatId]: (
          prev[selectedChatId] || []
        ).map((msg) =>
          String(msg._id) === String(messageId)
            ? { ...msg, deliveredTo, status }
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
  }, [socket, selectedChatId, isGroupChat, setChats]);

  // ================= RESET TYPING =================
  useEffect(() => {
    setIsPartnerTyping(false);
    setGroupTypingUsers([]);
  }, [selectedChatId]);

  // ================= HANDLE TYPING =================
  const handleTypingLocal = (value) => {
    setText(value);

    if (!socket || !selectedUser) return;

    if (!value || value.trim() === "") {
      clearTimeout(stopTypingTimeoutRef.current);

      if (isGroupChat) {
        socket.emit("group-stop-typing", {
          chatId: selectedChatId,
          fromUserId: currentUserId,
          userName: currentUser?.name,
        });
      } else {
        socket.emit("stop-typing", {
          fromUserId: currentUserId,
          toUserId: selectedChatId,
        });
      }

      return;
    }

    const now = Date.now();

    if (now - lastTypingEmitRef.current > 700) {
      if (isGroupChat) {
        socket.emit("group-typing", {
          chatId: selectedChatId,
          fromUserId: currentUserId,
          userName: currentUser?.name,
        });
      } else {
        socket.emit("typing", {
          fromUserId: currentUserId,
          toUserId: selectedChatId,
        });
      }

      lastTypingEmitRef.current = now;
    }

    clearTimeout(stopTypingTimeoutRef.current);

    stopTypingTimeoutRef.current = setTimeout(() => {
      if (isGroupChat) {
        socket.emit("group-stop-typing", {
          chatId: selectedChatId,
          fromUserId: currentUserId,
          userName: currentUser?.name,
        });
      } else {
        socket.emit("stop-typing", {
          fromUserId: currentUserId,
          toUserId: selectedChatId,
        });
      }
    }, 1400);
  };

  // ================= PRIVATE TYPING EVENTS =================
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    const handleUserTyping = ({ fromUserId }) => {
      if (
        !isGroupChat &&
        String(fromUserId) === String(selectedChatId)
      ) {
        setIsPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ fromUserId }) => {
      if (
        !isGroupChat &&
        String(fromUserId) === String(selectedChatId)
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
  }, [socket, selectedChatId, isGroupChat]);

  // ================= GROUP TYPING EVENTS =================
  useEffect(() => {
    if (!socket || !selectedChatId || !isGroupChat) {
      return;
    }

    const handleGroupTyping = ({
      fromUserId,
      userName,
    }) => {
      if (String(fromUserId) === String(currentUserId)) {
        return;
      }

      setGroupTypingUsers((prev) => {
        const exists = prev.some(
          (user) => String(user.id) === String(fromUserId)
        );

        if (exists) return prev;

        return [
          ...prev,
          {
            id: fromUserId,
            name: userName,
          },
        ];
      });
    };

    const handleGroupStopTyping = ({ fromUserId }) => {
      setGroupTypingUsers((prev) =>
        prev.filter(
          (user) => String(user.id) !== String(fromUserId)
        )
      );
    };

    socket.on("group-userTyping", handleGroupTyping);
    socket.on("group-stop-userTyping", handleGroupStopTyping);

    return () => {
      socket.off("group-userTyping", handleGroupTyping);
      socket.off("group-stop-userTyping", handleGroupStopTyping);
    };
  }, [
    socket,
    selectedChatId,
    isGroupChat,
    currentUserId,
  ]);

  // ================= SEND MESSAGE =================
  const handleSendMessage = async (payload) => {
    if (!selectedUser || !payload) return;
  
    // Validate media file types before creating a message
  if (["image", "video", "audio"].includes(payload.type)) {
  if (!payload.file) {
    toast.error("Please select a file.");
    return;
  }

  const allowedTypes = {
    image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4"],
  };

  if (!allowedTypes[payload.type]?.includes(payload.file.type)) {
    toast.error(`Unsupported ${payload.type} format.`);
    return;
  }
}


    // Capture the chat for this particular send operation.
    // Switching chats will not change the upload's destination.
    const chatIdForMessage = selectedChatId;
    const groupChatForMessage = isGroupChat;

    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const localMediaUrl =
      payload.file &&
      ["image", "video", "audio"].includes(payload.type)
        ? URL.createObjectURL(payload.file)
        : "";

    const tempMessage = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: chatIdForMessage,
      chatId: groupChatForMessage ? chatIdForMessage : undefined,
      type: payload.type,
      text: payload.type === "text" ? payload.text : "",
      imageUrl:
        payload.type === "image" ? localMediaUrl : "",
      videoUrl:
        payload.type === "video" ? localMediaUrl : "",
      audioUrl:
        payload.type === "audio" ? localMediaUrl : "",
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    // Show the temporary message in its original conversation.
    setChats((prev) => ({
      ...prev,
      [chatIdForMessage]: [
        ...(prev[chatIdForMessage] || []),
        tempMessage,
      ],
    }));

    try {
      let imageUrl = "";
      let videoUrl = "";
      let audioUrl = "";

      // ================= IMAGE UPLOAD =================
      if (payload.type === "image") {
        if (!payload.file) {
          throw new Error("No image file selected.");
        }

        const formData = new FormData();
        formData.append("image", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/image`,
          formData,
          { withCredentials: true }
        );

        imageUrl = res.data.url;

        if (!imageUrl) {
          throw new Error("Image upload returned no URL.");
        }
      }

      // ================= VIDEO UPLOAD =================
      else if (payload.type === "video") {
        if (!payload.file) {
          throw new Error("No video file selected.");
        }

        // Initialize progress for this chat only.
        setVideoUploads((prev) => ({
          ...prev,
          [chatIdForMessage]: 0,
        }));

        // Request signed upload parameters from the backend.
        const signatureRes = await axios.get(
          `${API_URL}/api/v1/message/upload/video/signature`,
          { withCredentials: true }
        );

        const {
          timestamp,
          signature,
          folder,
          cloudName,
          apiKey,
        } = signatureRes.data;

        if (
          !timestamp ||
          !signature ||
          !folder ||
          !cloudName ||
          !apiKey
        ) {
          throw new Error(
            "Invalid Cloudinary signature response."
          );
        }

        // Upload the video directly to Cloudinary.
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) /
                    progressEvent.total
                );

                // Update progress for the original chat.
                setVideoUploads((prev) => ({
                  ...prev,
                  [chatIdForMessage]: percentage,
                }));
              }
            },
          }
        );

        videoUrl = uploadRes.data.secure_url;

        if (!videoUrl) {
          throw new Error(
            "Cloudinary returned no video URL."
          );
        }
      }

      // ================= AUDIO UPLOAD =================
      else if (payload.type === "audio") {
        if (!payload.file) {
          throw new Error("No audio file selected.");
        }

        const formData = new FormData();
        formData.append("audio", payload.file);

        const res = await axios.post(
          `${API_URL}/api/v1/message/upload/voice`,
          formData,
          { withCredentials: true }
        );

        audioUrl = res.data.url;

        if (!audioUrl) {
          throw new Error("Audio upload returned no URL.");
        }
      }

      const messageData = {
        type: payload.type,
        text: payload.type === "text" ? payload.text : "",
        imageUrl,
        videoUrl,
        audioUrl,
      };

      let savedMessage;

      // ================= SAVE GROUP MESSAGE =================
      if (groupChatForMessage) {
        const res = await axios.post(
          `${API_URL}/api/v1/chat/group/send`,
          {
            chatId: chatIdForMessage,
            ...messageData,
          },
          { withCredentials: true }
        );

        savedMessage = res.data.message;

        if (!savedMessage) {
          throw new Error(
            "Group message response contained no message."
          );
        }
      } else {
        // ================= SAVE PRIVATE MESSAGE =================
        const saveRes = await axios.post(
          `${API_URL}/api/v1/message/save`,
          {
            senderId: currentUserId,
            receiverId: chatIdForMessage,
            ...messageData,
          },
          { withCredentials: true }
        );

        savedMessage = saveRes.data.message;

        if (!savedMessage) {
          throw new Error(
            "Private message response contained no message."
          );
        }

        socket?.emit("sendMessage", savedMessage);
      }

      // Replace the temporary message in its original chat.
      setChats((prev) => ({
        ...prev,
        [chatIdForMessage]: (
          prev[chatIdForMessage] || []
        ).map((msg) =>
          msg._id === tempId ? savedMessage : msg
        ),
      }));

      // Update input state only if the user is still in
      // the chat where this message was started.
      if (String(selectedChatId) === String(chatIdForMessage)) {
        setText("");
        setImage(null);
        setSelectedVideo(null);
        setIsPartnerTyping(false);
      }
    } catch (err) {
      console.error("Failed to send message:", err);

      setChats((prev) => ({
        ...prev,
        [chatIdForMessage]: (
          prev[chatIdForMessage] || []
        ).map((msg) =>
          msg._id === tempId
            ? { ...msg, status: "failed" }
            : msg
        ),
      }));
    } finally {
      // Remove progress only for this upload's chat.
      if (payload.type === "video") {
        setVideoUploads((prev) => {
          const updated = { ...prev };
          delete updated[chatIdForMessage];
          return updated;
        });
      }

    }
  };


const handleDeleteMessageForMe = async (messageId) => {
  if (!selectedChatId || !messageId) return;

  // Find the message in the current chat.
  const message = (chats[selectedChatId] || []).find(
    (msg) => String(msg._id) === String(messageId)
  );

  // Failed or temporary messages are not stored in MongoDB.
  // Remove them directly from frontend state.
  if (
    message?.status === "failed" ||
    String(messageId).startsWith("temp-")
  ) {
    setChats((prev) => ({
      ...prev,
      [selectedChatId]: (prev[selectedChatId] || []).filter(
        (msg) => String(msg._id) !== String(messageId)
      ),
    }));

    return;
  }

  // Normal saved messages: keep existing backend functionality.
  try {
    await axios.delete(
      `${API_URL}/api/v1/message/${messageId}/for-me`,
      { withCredentials: true }
    );

    setChats((prev) => ({
      ...prev,
      [selectedChatId]: (prev[selectedChatId] || []).filter(
        (msg) => String(msg._id) !== String(messageId)
      ),
    }));
  } catch (err) {
    console.error("Failed to delete message for me:", err);
    alert(
      err.response?.data?.message ||
        "Failed to delete message. Please try again."
    );
  }
};


  const handleClearChat = async (chatId) => {
  if (!chatId || !selectedUser) return;

  const endpoint = isGroupChat
    ? `${API_URL}/api/v1/message/group/${chatId}/clear`
    : `${API_URL}/api/v1/message/private/${chatId}/clear`;

  try {
    await axios.delete(endpoint, { withCredentials: true });

    setChats((prev) => ({
      ...prev,
      [chatId]: [],
    }));
  } catch (err) {
    console.error("Failed to clear chat:", err);
    alert(
      err.response?.data?.message ||
        "Failed to clear chat. Please try again."
    );
  }
};

   
  // ================= MARK PRIVATE MESSAGES SEEN =================
  useEffect(() => {
    if (!socket || !selectedChatId || !messages.length) {
      return;
    }

    if (isGroupChat) return;

    const unseen = messages
      .filter((msg) => {
        const receiverId =
          msg.receiverId?._id || msg.receiverId;

        return (
          String(receiverId) === String(currentUserId) &&
          msg.status !== "seen" &&
          !String(msg._id).startsWith("temp-")
        );
      })
      .map((msg) => msg._id);

    if (unseen.length) {
      socket.emit("message-seen", {
        messageIds: unseen,
        senderId: selectedChatId,
      });
    }
  }, [
    messages,
    selectedChatId,
    currentUserId,
    socket,
    isGroupChat,
  ]);

  // ================= MARK GROUP MESSAGES SEEN =================
  useEffect(() => {
    if (!isGroupChat || !socket || !messages.length) {
      return;
    }

    messages.forEach((message) => {
      const senderId =
        message.senderId?._id || message.senderId;

      if (
        String(senderId) !== String(currentUserId) &&
        !String(message._id).startsWith("temp-")
      ) {
        socket.emit("group-message-seen", {
          messageId: message._id,
          userId: currentUserId,
        });
      }
    });
  }, [messages, isGroupChat, socket, currentUserId]);

  // ================= GROUP MESSAGE SEEN UPDATE =================
  useEffect(() => {
    if (!socket || !selectedChatId || isGroupChat) {
      return;
    }

    const handleGroupSeenUpdate = ({
      messageId,
      seenBy,
    }) => {
      setChats((prev) => ({
        ...prev,
        [selectedChatId]: (
          prev[selectedChatId] || []
        ).map((msg) =>
          String(msg._id) === String(messageId)
            ? { ...msg, seenBy }
            : msg
        ),
      }));
    };

    socket.on(
      "group-message-seen-update",
      handleGroupSeenUpdate
    );

    return () => {
      socket.off(
        "group-message-seen-update",
        handleGroupSeenUpdate
      );
    };
  }, [socket, selectedChatId, isGroupChat, setChats]);

  useEffect(() => {
    return () => {
      clearTimeout(stopTypingTimeoutRef.current);
    };
  }, []);

  // ================= EMPTY STATE =================
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-slate-800">
        <p className="text-lg text-slate-400">
          Select a user to start chatting
        </p>
      </div>
    );
  }


  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0">
        
    <ChatHeader
      selectedUser={selectedUser}
      isPartnerTyping={isPartnerTyping}
      groupTypingUsers={groupTypingUsers}
      onBack={onBack}
      onClearChat={handleClearChat}
    />

      </div>

      <div className="min-h-0 flex-1 overflow-hidden">

     <MessageList
      messages={messages}
      selectedUser={selectedUser}
      currentUserId={currentUserId}
      onDeleteForMe={handleDeleteMessageForMe}
      onDeleteForEveryone={handleDeleteMessageForEveryone}
      onLoadOlder={loadOlderMessages}
      hasMore={Boolean(paginationByChat[selectedChatId]?.hasMore)}
      isLoadingOlder={Boolean(loadingOlderByChat[selectedChatId])}
    />

      </div>

      {videoUploads[selectedChatId] !== undefined && (
        <div className="shrink-0 bg-slate-800 px-4 py-2">
          <div className="mb-1 flex justify-between text-sm text-slate-200">
            <span>Uploading video...</span>
            <span>{videoUploads[selectedChatId]}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-600">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-200"
              style={{
                width: `${videoUploads[selectedChatId]}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="shrink-0">
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
    </div>
  );
};

export default ChatBox;
