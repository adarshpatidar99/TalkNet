import React, { useEffect, useLayoutEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({
  messages = [],
  selectedUser,
  currentUserId,
  onDeleteForMe,
  onDeleteForEveryone,

  // Pagination props
  onLoadOlder,
  hasMore = false,
  isLoadingOlder = false,
}) => {
  const chatRef = useRef(null);
  const isFirstLoad = useRef(true);

  const previousScroll = useRef(null);
  const isRequestingOlder = useRef(false);

  // Preserve scroll position after older messages are prepended.
  useLayoutEffect(() => {
    const el = chatRef.current;

    if (!el || !previousScroll.current) return;

    const previous = previousScroll.current;

    el.scrollTop =
      el.scrollHeight - previous.scrollHeight + previous.scrollTop;

    previousScroll.current = null;
  }, [messages]);

  // Initial load and automatic scrolling for new messages.
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    if (isFirstLoad.current) {
      el.scrollTop = el.scrollHeight;
      isFirstLoad.current = false;
      return;
    }

    if (previousScroll.current) return;

    const distFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    const isNearBottom = distFromBottom < 200;

    if (isNearBottom) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Reset scroll state when switching conversations.
  useEffect(() => {
    isFirstLoad.current = true;
    previousScroll.current = null;
    isRequestingOlder.current = false;
  }, [selectedUser?._id]);

  // Load older messages when the user scrolls near the top.
  const handleScroll = async () => {
    const el = chatRef.current;

    if (
      !el ||
      el.scrollTop > 80 ||
      !hasMore ||
      isLoadingOlder ||
      isRequestingOlder.current ||
      !onLoadOlder
    ) {
      return;
    }

    isRequestingOlder.current = true;

    // Save current position before loading older messages.
    previousScroll.current = {
      scrollHeight: el.scrollHeight,
      scrollTop: el.scrollTop,
    };

    try {
      await onLoadOlder();
    } catch (error) {
      previousScroll.current = null;
      console.error("Failed to load older messages:", error);
    } finally {
      isRequestingOlder.current = false;
    }
  };

  const getDateLabel = (d) => {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      ref={chatRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#F8F9FB] px-2 sm:px-3 py-4 space-y-1 h-full"
    >
      {isLoadingOlder && (
        <div className="py-2 text-center text-xs text-slate-400">
          Loading older messages...
        </div>
      )}

      {messages.length ? (
        messages.map((msg, i) => {
          const prev = messages[i - 1];

          const showDate =
            !prev ||
            new Date(msg.createdAt).toDateString() !==
              new Date(prev.createdAt).toDateString();

          return (
            <React.Fragment key={msg._id}>
              {showDate && (
                <div className="flex justify-center my-3">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-500 shadow-sm">
                    {getDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <MessageItem
                message={msg}
                selectedUser={selectedUser}
                currentUserId={currentUserId}
                onDeleteForMe={onDeleteForMe}
                onDeleteForEveryone={onDeleteForEveryone}
              />
            </React.Fragment>
          );
        })
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-[13px] text-slate-400">
            No messages yet. Say hello 👋
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageList;
