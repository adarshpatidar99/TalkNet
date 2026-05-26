import React from "react";
import { BsCheckAll } from "react-icons/bs";
import { PiChecksBold } from "react-icons/pi";

const MessageItem = ({ message, currentUserId, onDelete }) => {
  const isOwnMessage =
    String(message.senderId) === String(currentUserId);

  // Format time (e.g. 10:45 PM)
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Message status icon (sent, delivered, seen)
  const renderStatus = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "seen":
        return (
          <BsCheckAll className="text-[#53BDEB] text-[15px] shrink-0" />
        );

      case "delivered":
        return (
          <BsCheckAll className="text-slate-400 text-[15px] shrink-0" />
        );

      default:
        return (
          <PiChecksBold className="text-slate-400 text-[15px] shrink-0" />
        );
    }
  };

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {/* MESSAGE BUBBLE */}
      <div
        className={`
          relative
          inline-block
          w-fit mr-10
          max-w-[85vw] sm:max-w-[95%] md:max-w-[65%]
          min-w-[80px]
          break-words whitespace-pre-wrap
          rounded-2xl px-2 py-1
          shadow-sm
          ${
            isOwnMessage
              ? "bg-[#d9fdd3] text-slate-900 rounded-br-md"
              : "bg-white text-slate-900 rounded-bl-md border border-slate-200"
          }
        `}
      >
        {/* TEXT MESSAGE */}
        {message.type === "text" && message.text && (
          <>
            <span className="text-sm leading-relaxed">
              {message.text}
            </span>

            {/* TIME + STATUS (WhatsApp style) */}
            {/* <span
              className={`
                inline-flex items-center gap-1
                ml-2  clear-both
                text-[11px] leading-none
                ${
                  isOwnMessage
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              <span>{formatTime(message.createdAt)}</span>
              {renderStatus()}
            </span> */}
            <span
  className={`
    inline-flex items-end gap-1
    ml-2
    float-right
    clear-both
    mt-1
    text-[11px]
    leading-none
    align-bottom
    ${
      isOwnMessage
        ? "text-slate-500"
        : "text-slate-400"
    }
  `}
>
  <span >{formatTime(message.createdAt)}</span>
  {renderStatus()}
</span>
          </>
        )}

        {/* IMAGE MESSAGE */}
        {message.type === "image" && message.imageUrl && (
          <>
            <img
              src={message.imageUrl}
              alt="Shared"
              className="max-w-full rounded-xl"
            />

            <div
              className={`
                 flex items-center justify-end gap-1
                text-[11px]
                ${
                  isOwnMessage
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              <span>{formatTime(message.createdAt)}</span>
              {renderStatus()}
            </div>
          </>
        )}

        {/* VIDEO MESSAGE */}
        {message.type === "video" && message.videoUrl && (
          <>
            <video controls className="max-w-full rounded-xl">
              <source
                src={message.videoUrl}
                type="video/mp4"
              />
              Your browser does not support video.
            </video>

            <div
              className={`
                mt-1 flex items-center justify-end gap-1
                text-[11px]
                ${
                  isOwnMessage
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              <span>{formatTime(message.createdAt)}</span>
              {renderStatus()}
            </div>
          </>
        )}

        {/* AUDIO MESSAGE */}
        {message.type === "audio" && (
          <>
            <audio
              controls
              src={message.audioUrl || message.localUrl}
              className="max-w-full"
            />

            <div
              className={`
                mt-1 flex items-center justify-end gap-1
                text-[11px]
                ${
                  isOwnMessage
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              <span>{formatTime(message.createdAt)}</span>
              {renderStatus()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageItem;