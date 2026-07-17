import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
                                 
const MessageList = ({
  messages = [],
  selectedUser,
  currentUserId,
}) => {
  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const shouldAutoScroll = useRef(true);

  useEffect(() => {
  const container = chatRef.current;

  if (!container) return;

  const handleScroll = () => {
    const threshold = 120;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScroll.current =
      distanceFromBottom < threshold;
  };

  container.addEventListener("scroll", handleScroll);

  return () =>
    container.removeEventListener("scroll", handleScroll);
}, []);

  // // Scroll to bottom whenever messages change
  useEffect(() => {
  if (!bottomRef.current) return;

  if (!shouldAutoScroll.current) return;

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
          />
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
         <p className="text-sm text-slate-500">
            No messages yet. Say hello 👋
        </p>
        </div>
      )}

      {/* Invisible element used for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;