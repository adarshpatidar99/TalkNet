import React, { useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5"; 
import { BsCheckAll } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";

const MessageItem = ({ message, selectedUser, currentUserId }) => {
  const isGroup = selectedUser?.isGroupChat;
  const sender = typeof message.senderId === "object"? message.senderId : null;
  const senderId = sender?._id || message.senderId;
  const senderName = sender?.name || "Unknown";
  const senderAvatar = sender?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png";
  const isOwnMessage = String(senderId) === String(currentUserId);

  const textRef = useRef(null);
  const [isLong, setIsLong] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // NEW

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

const renderStatus = () => {
  if (!isOwnMessage) return null;

  if(message.status === "sending") {
     return (
       <span className="text-gray-300 text-[11px] animate-pulse">
         sending...
       </span>
     )
  }

  switch (message.status) {
    case "seen":
      return (
        <BsCheckAll className="text-sky-400 text-[17px]" />
      );

    case "delivered":
      return (
        <BsCheckAll className="text-gray-300 text-[17px]" />
      );

    default: // sent
      return (
        <IoMdCheckmark className="text-gray-300 text-[14px]" />
      );
  }
};

  useEffect(() => {
    if (message.type === "text" && textRef.current) {
      const el = textRef.current;
      setIsLong(el.scrollWidth > el.clientWidth || message.text.length > 50);
    }
  }, [message.text, message.type]);

  const timeColor = isOwnMessage? "text-white/90" : "text-slate-500";

  return (
    <>
      <div className={`flex ml-2 mr-2 items-end gap-2 mb-1 ${isOwnMessage? "justify-end" : "justify-start"}`}>
        {isGroup &&!isOwnMessage && (
          <img src={senderAvatar} className="h-7 w-7 rounded-full object-cover self-start" alt={senderName} />
        )}

        <div className={`max-w-[75%] sm:max-w-[65%] ${message.type === "text"? "px-2 py-1.5" : "p-1"} rounded-2xl shadow-sm ${
          isOwnMessage? "bg-gradient-to-r from-blue-500 to-blue-600 rounded-br-md" : "bg-white rounded-bl-md"
        }`}>

          {isGroup &&!isOwnMessage && (
            <p className="text-[11px] font-semibold text-blue-600 px-1 pb-0.5">{senderName}</p>
          )}               

          {/* TEXT MESSAGE */}
          {message.type === "text" && (
            <div className="flex flex-wrap items-end gap-x-1.5">
              <p ref={textRef} className={`text-sm whitespace-pre-wrap break-words break-all leading-snug ${isOwnMessage? "text-white" : "text-slate-800"}`}>
                {message.text}
              </p>
              <span className={`flex items-center gap-1 text-[11px] shrink-0 ${timeColor} ${isLong? "w-full justify-end mt-0.5" : "ml-auto"}`}>
                {formatTime(message.createdAt)}
                {renderStatus()}
              </span>
            </div>
          )}

          {message.type === "image" && (
    <div className="relative rounded-xl overflow-hidden">
    <img
      src={message.imageUrl}
      alt="message"                            
      className="block max-w-[250px] max-h-[300px] w-auto h-auto object-cover cursor-pointer hover:opacity-90 transition"
      onClick={() => setShowPreview(true)}
    />

    {/* FAILED STATE */}
   {message.status === "failed" && (
  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
    <p className="text-sm font-medium text-red-400">
      Upload failed
    </p>
  </div>
)}

    <div className={`absolute bottom-1 right-1.5 flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md backdrop-blur-sm bg-black/40 ${timeColor}`}>
      {formatTime(message.createdAt)}
      {renderStatus()}
    </div>
  </div>
)}

          {/* VIDEO - overlay time */}
          {message.type === "video" && (
            <div className="relative rounded-xl overflow-hidden">
              <video controls className="block max-w-[250px] max-h-[300px] w-auto h-auto">
                <source src={message.videoUrl} />
              </video>
              {message.status === "sending" && (        
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}                            
              <div className={`absolute bottom-1 right-1.5 flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md backdrop-blur-sm bg-black/40 ${timeColor}`}>
                {formatTime(message.createdAt)}
                {renderStatus()}
              </div>
            </div>
          )}

          {/* AUDIO - time below */}
          {message.type === "audio" && (
            <div className="flex flex-col gap-1">
              <audio controls src={message.audioUrl} className="w-[200px] h-8" />
              <span className={`flex items-center gap-1 self-end text-[11px] ${timeColor}`}>
                {formatTime(message.createdAt)}
                {renderStatus()}
              </span>
            </div>
          )}
        </div>
      </div>                                               

      {/* IMAGE PREVIEW MODAL */}
      {showPreview && message.type === "image" && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setShowPreview(false)}
          >
            <IoClose />
          </button>
          <img
            src={message.imageUrl}
            alt="preview"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image
          />
        </div>
      )}
    </>
  );
};

export default MessageItem;








