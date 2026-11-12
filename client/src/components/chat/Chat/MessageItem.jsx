import React, { useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BsCheckAll } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";

const MessageItem = ({
  message,
  selectedUser,
  currentUserId,
  onDeleteForMe,
  onDeleteForEveryone,
}) => {
  const isGroup = selectedUser?.isGroupChat;
  const sender = typeof message.senderId === "object" ? message.senderId : null;
  const senderId = sender?._id || message.senderId;
  const senderName = sender?.name || "Unknown";
  const senderAvatar = sender?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png";
  const isOwn = String(senderId) === String(currentUserId);
  const isDeleted = Boolean(message.isDeletedForEveryone);
  const isMedia = message.type === "image" || message.type === "video";
  const isTemp = String(message._id).startsWith("temp-");

  const [showPreview, setShowPreview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [showMenu]);

  const formatTime = (d) => d ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(d)) : "";

  const renderStatus = () => {
  if (!isOwn) return null;

  if (message.status === "sending") {
    return (
      <span className="text-[10px] text-white/70 animate-pulse">
        Sending
      </span>
    );
  }

  if (message.status === "failed") {
  return (
    <span
      className="text-[10px] text-red-200"
      title="Message failed to send"
    >
      Failed
    </span>
  );
}

  switch (message.status) {
    case "seen":
      return (
        <BsCheckAll
          className="h-[16px] w-[16px] text-[#38BDF8] drop-shadow-sm"
          title="Seen"
        />
      );

    case "delivered":
      return (
        <BsCheckAll
          className="h-[15px] w-[15px] text-white"
          title="Delivered"
        />
      );

    default:
      return (
        <IoMdCheckmark
          className="h-[14px] w-[14px] text-white/80"
          title="Sent"
        />
      );
  }
};


  return (
    <>
      <div className={`group flex w-full items-end gap-1.5 px-2.5 md:px-3 mb-[2px] ${isOwn ? "justify-end" : "justify-start"}`}>
        
        {isGroup && !isOwn && (
          <img src={senderAvatar} alt={senderName} className="mb-1 h-[28px] w-[28px] md:h-7 md:w-7 rounded-full object-cover shrink-0" />
        )}

        <div className={`flex max-w-[78%] md:max-w-[62%] lg:max-w-[56%] items-center gap-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          
          {(!isTemp || message.status === "failed") && !isDeleted && (
            <div ref={menuRef} className="relative shrink-0">
              <button onClick={() => setShowMenu(v => !v)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 text-[14px] font-bold transition active:scale-90 md:opacity-0 md:group-hover:opacity-100">
                ⋮
              </button>
              {showMenu && (
                <div className={`absolute top-8 z-50 min-w-[160px] rounded-[12px] border border-slate-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${isOwn ? "right-0" : "left-0"}`}>
                  <button onClick={() => { setShowMenu(false); onDeleteForMe?.(message._id); }} className="w-full rounded-[8px] px-3 py-2.5 text-left text-[13px] font-mediumhover:bg-slate-50">Delete for me</button>
                  {isOwn && !isTemp && <button onClick={() => { setShowMenu(false); onDeleteForEveryone?.(message._id); }} className="w-full rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-red-600 hover:bg-red-50">Delete for everyone</button>}
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {!isDeleted && message.type === "text" && (
              <div className={`relative px-[9px] md:px-[10px] pt-[6px] md:pt-[5px] pb-[5px] md:pb-[4px] shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] ${isOwn ? "bg-[#0084FF] text-white rounded-[14px] md:rounded-[12px] rounded-br-[4px]" : "bg-white border border-slate-100/80 text-[#111B21] rounded-[14px] md:rounded-[12px] rounded-bl-[4px]"}`}>
                {isGroup && !isOwn && <p className="text-[11px] font-bold leading-[13px] text-[#0084FF] pb-[2px]">{senderName}</p>}
                <p className="whitespace-pre-wrap break-words text-[15px] md:text-[14.6px] leading-[20px] md:leading-[19px]">
                  {message.text}
                  <span className={`float-right ml-2 mt-[6px] inline-flex items-center gap-[2px] text-[10.5px] md:text-[10px] leading-none ${isOwn ? "text-white/80" : "text-[#667781]"}`}>
                    {formatTime(message.createdAt)}{renderStatus()}
                  </span>
                </p>
              </div>
            )}

            {isDeleted && (
              <div className={`px-[10px] py-[6px] md:px-[9px] md:py-[5px] shadow-sm text-[14.5px] md:text-[13.8px] italic leading-[18px] ${isOwn ? "bg-[#0084FF]/80 text-white rounded-[14px] rounded-br-[4px]" : "bg-white border border-slate-100 text-slate-500 rounded-[14px] rounded-bl-[4px]"}`}>
                <p className="inline">This message was deleted.</p>
                <span className="float-right ml-3 mt-[4px] text-[10px] opacity-70">{formatTime(message.createdAt || message.deletedAt)}</span>
              </div>
            )}

            {!isDeleted && message.type === "image" && (
              <div className={`relative overflow-hidden p-[3px] md:p-[2px] shadow-sm ${isOwn ? "bg-[#0084FF] rounded-[14px] md:rounded-[12px] rounded-br-[4px]" : "bg-white border border-slate-100 rounded-[14px] md:rounded-[12px] rounded-bl-[4px]"}`}>
                {isGroup && !isOwn && <p className="px-1 pb-1 text-[11px] font-bold text-[#0084FF]">{senderName}</p>}
                <img src={message.imageUrl} alt="" onClick={() => setShowPreview(true)} className="block w-[min(72vw,280px)] md:w-[320px] max-h-[320px] md:max-h-[360px] cursor-pointer rounded-[11px] md:rounded-[10px] object-cover bg-slate-100" />
                <div className="absolute bottom-[6px] right-[6px] flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] leading-none text-white backdrop-blur-sm">{formatTime(message.createdAt)}{renderStatus()}</div>
              </div>
            )}

            {!isDeleted && message.type === "video" && (
              <div className={`relative overflow-hidden p-[3px] md:p-[2px] shadow-sm ${isOwn ? "bg-[#0084FF] rounded-[14px] md:rounded-[12px] rounded-br-[4px]" : "bg-white border border-slate-100 rounded-[14px] md:rounded-[12px] rounded-bl-[4px]"}`}>
                {isGroup && !isOwn && <p className="px-1 pb-1 text-[11px] font-bold text-[#0084FF]">{senderName}</p>}
                <video controls playsInline className="block w-[min(72vw,280px)] md:w-[320px] max-h-[320px] md:max-h-[380px] rounded-[11px] md:rounded-[10px] bg-black object-contain">
                  <source src={message.videoUrl} />
                </video>
                <div className="absolute top-[6px] right-[6px] flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] leading-none text-white backdrop-blur-sm">{formatTime(message.createdAt)}{renderStatus()}</div>
              </div>
            )}

            {!isDeleted && message.type === "audio" && (
              <div className={`px-2 pt-2 pb-1 md:px-[10px] md:pt-[6px] md:pb-[4px] shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] ${isOwn ? "bg-[#0084FF] text-white rounded-[14px] md:rounded-[12px] rounded-br-[4px]" : "bg-white border border-slate-100 rounded-[14px] md:rounded-[12px] rounded-bl-[4px]"}`}>
                {isGroup && !isOwn && <p className="pb-1 text-[11px] font-bold text-[#0084FF]">{senderName}</p>}
                <audio controls src={message.audioUrl} className="block h-[36px] w-[220px] md:w-[260px] md:h-[34px]" />
                <div className={`flex justify-end items-center gap-1 pt-1 text-[10px] leading-none ${isOwn ? "text-white/80" : "text-[#667781]"}`}>{formatTime(message.createdAt)}{renderStatus()}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3" onClick={() => setShowPreview(false)}>
          <button onClick={() => setShowPreview(false)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"><IoClose size={22} /></button>
          <img src={message.imageUrl} alt="" onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </>
  );
};

export default MessageItem;