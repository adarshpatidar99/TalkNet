import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify"; 

const ChatInput = ({
  text,
  onTextChange,
  onSendText,
  onSendAudio,
  selectedUser,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);

  const timerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    onTextChange(text + emojiData.emoji);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      // Stop recorder if component unmounts while recording
      if (mediaRecorder && mediaRecorder.state!== "inactive") {
        mediaRecorder.stop();
      }

      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }

      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [selectedImage, audioURL, mediaRecorder]);

  // Start recording when toggled
  useEffect(() => {
    if (isRecording) {
      startRecording();
    }
  }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      setMediaRecorder(recorder);
      setTimer(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error("Microphone permission denied");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.state!== "inactive"
    ) {
      mediaRecorder.stop();
    }

    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.state!== "inactive"
    ) {
      mediaRecorder.stop();
    }

    clearInterval(timerRef.current);

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setIsRecording(false);
    setAudioURL(null);
    setTimer(0);
  };

  // Send Audio
  const sendAudio = async () => {
    if (!audioURL ||!selectedUser?._id) return;

    try {
      setUploading(true);

      const response = await fetch(audioURL);
      const blob = await response.blob();

      if (typeof onSendAudio === "function") {
        await onSendAudio({
          type: "audio",
          file: new File(
            [blob],
            "voice.webm",
            {
              type: "audio/webm",
            }
          ),
        });
      }

      cancelRecording();
    } catch (error) {
      // CHANGE 1: No alert
      console.error("Upload failed:", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Send Text / Image / Video
  const sendMessage = () => {
    if (!text.trim() &&!selectedImage) return;

    if (text.trim()) {
      onSendText({
        type: "text",
        text,
      });
    }

    if (selectedImage) {
      onSendText({
        type: selectedImage.type,
        file: selectedImage.file,
      });

    }

    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);
    onTextChange(""); 
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Remove old preview URL
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    const media = {
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video")
      ? "video"
        : "image",
    };

    setSelectedImage(media);

    event.target.value = "";
  };

  const removeSelectedImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);
  };

  // Send on Enter
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
    !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-slate-200 bg-[#EFEAE2] p-2 sm:p-3 relative">

      {showEmoji && (
  <div
    className="
      absolute bottom-[70px] left-0 right-0
      mx-auto z-50
      w-[calc(100vw-24px)]
      max-w-[360px]
      overflow-hidden
      rounded-2xl
      border border-slate-200
      bg-white
      shadow-2xl
      animate-in fade-in zoom-in duration-200
      sm:left-0 sm:right-auto sm:mx-0
    "
  >
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
      <span className="text-sm font-semibold text-slate-700">
        Emojis
      </span>

      <button
        type="button"
        onClick={() => setShowEmoji(false)}
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
      >
        <FaTimes className="text-sm text-slate-600" />
      </button>
    </div>

    <EmojiPicker
      onEmojiClick={handleEmojiClick}
      width="100%"
      height={320}
      lazyLoadEmojis
      searchDisabled={false}
      skinTonesDisabled={false}
      previewConfig={{
        showPreview: false,
      }}
    />
  </div>
)}

      {/* Image / Video Preview */}
      {selectedImage && (
        <div className="relative mb-3 inline-block">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {selectedImage.type === "video"? (
              <video
                src={selectedImage.preview}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={selectedImage.preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}

            <button
              type="button"
              onClick={removeSelectedImage}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <span className="animate-pulse">🔴</span>
            <span>
              Recording {formatTime(timer)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stopRecording}
              className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500"
            >
              Stop
            </button>

            <button
              type="button"
              onClick={cancelRecording}
              className="rounded-lg bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {audioURL &&!isRecording && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <audio
            controls
            src={audioURL}
            className="max-w-full"
          />

          <button
            type="button"
            onClick={sendAudio}
            disabled={uploading}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {uploading
            ? "Sending..."
              : "Send"}
          </button>

          <button
            type="button"
            onClick={cancelRecording}
            className="rounded-lg bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            Remove
          </button>
        </div>
      )}

      {/* Main Input Row */}
      {!audioURL &&!isRecording && (
        <div className="relative">

          <input
            type="text"
            value={text}
            onChange={(event) =>
              onTextChange(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="
              w-full min-w-0
              rounded-full
              border border-slate-200
              bg-white
              pl-11 sm:pl-12
              pr-20 sm:pr-24
              py-3
              text-sm sm:text-base
              text-slate-700
              shadow-sm
              outline-none
              transition-all duration-200
              placeholder:text-slate-500
            "
          />

          {/* Sticker Icon */}
          <button
            onClick={() =>
              setShowEmoji(!showEmoji)
            }
            type="button"
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              flex h-8 w-8 sm:h-9 sm:w-9
              cursor-pointer
              items-center justify-center
              rounded-full
              text-slate-700
              transition hover:bg-slate-100 hover:text-slate-600
            "
          >
            <RiEmojiStickerLine className="text-xl" />
          </button>

          {/* Camera Icon */}
          <label
            className="
              absolute right-9.5 top-1/2 -translate-y-1/2
              flex h-9 w-9
              cursor-pointer items-center justify-center
              rounded-full
              text-slate-700
              transition hover:bg-slate-100 hover:text-slate-600
            "
          >
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaUpload}
            />

            <FaCamera className="text-sm sm:text-base" />
          </label>

          {/* Send or Microphone */}
          {text.trim() || selectedImage? (
            <button
              type="button"
              onClick={sendMessage}
              disabled={uploading}
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
                text-white
                transition hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <span className="text-sm sm:text-base">
                {uploading? "..." : "➤"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setIsRecording(true)
              }
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-slate-100
                text-blue-600
                transition hover:bg-slate-200
              "
            >
              <FaMicrophone className="text-sm sm:text-base" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInput;