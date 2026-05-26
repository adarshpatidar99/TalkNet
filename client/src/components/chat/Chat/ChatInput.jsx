// import { useState, useRef, useEffect } from "react";
// import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";

// const ChatInput = ({
//   text,
//   onTextChange,
//   onSendText,
//   setImage,          // ✅ USED CORRECTLY
//   onSendAudio,
//   socket,
//   currentUserId,
//   selectedUser
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [audioURL, setAudioURL] = useState(null);
//   const [timer, setTimer] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   console.log("🟢 ChatInput RENDERED");

//   const timerRef = useRef(null);

//   console.log("🧪 ChatInput props:", {
//   hasSetImage: typeof setImage,
//   hasOnSendText: typeof onSendText,
//   hasOnSendAudio: typeof onSendAudio
// });


//   useEffect(() => {
//     if (isRecording) startRecording();
//     return () => clearInterval(timerRef.current);
//   }, [isRecording]);

//   const formatTime = (sec) => {
//     const m = String(Math.floor(sec / 60)).padStart(2, "0");
//     const s = String(sec % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // ---------- Voice Recording ----------
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       setMediaRecorder(recorder);
//       let tempChunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) tempChunks.push(e.data);
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(tempChunks, { type: "audio/webm" });
//         const url = URL.createObjectURL(blob);
//         setAudioURL(url);
//         setAudioChunks(tempChunks);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       recorder.start();
//       timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
//     } catch {
//       alert("Microphone permission denied");
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
//     clearInterval(timerRef.current);
//     setIsRecording(false);
//   };

//   const cancelRecording = () => {
//     setIsRecording(false);
//     setAudioURL(null);
//     setTimer(0);
//     setAudioChunks([]);
//   };

//   // ---------- Send Audio ----------
//   const sendAudio = async () => {
//     if (!audioURL || !selectedUser?._id) return;

//     try {
//       setUploading(true);
//       const resBlob = await fetch(audioURL);
//       const blob = await resBlob.blob();

//       const formData = new FormData();
//       formData.append("audio", blob, "voice.webm");

//       const uploadRes = await axios.post(
//         "http://localhost:5000/api/v1/message/voice",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//       );

//       const audioUrl = uploadRes?.data?.url;
//       if (!audioUrl) throw new Error("Upload failed");

//       const saveRes = await axios.post(
//         "http://localhost:5000/api/v1/message/save",
//         {
//           senderId: currentUserId,
//           receiverId: selectedUser._id,
//           type: "audio",
//           audioUrl
//         },
//         { withCredentials: true }
//       );

//       const savedMessage = saveRes?.data?.message;

//       const messageForSender = {
//         ...savedMessage,
//         type: "audio",
//         localUrl: audioURL
//       };

//       socket.emit("sendAudioMessage", messageForSender);
//       if (onSendAudio) onSendAudio((prev) => [...prev, messageForSender]);

//       cancelRecording();
//     } catch (err) {
//       console.error("Voice upload error:", err);
//       alert("Upload failed. Try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ---------- SEND TEXT / IMAGE / VIDEO ----------
// //   const sendText = () => {
// //     console.log("🧪 sendText() CALLED");

// //     if (!text.trim() && !selectedImage) return;

// //     if (text.trim()) {
// //       onSendText(text);
// //     }

// //     // if (selectedImage) {
// //     //   setImage({
// //     //     file: selectedImage.file,
// //     //     type: selectedImage.file.type.startsWith("video") ? "video" : "image"
// //     //   });
// //     // }

// // //      if (selectedImage && typeof setImage === "function") {
// // //   setImage({
// // //     file: selectedImage.file,
// // //     type: selectedImage.file.type.startsWith("video") ? "video" : "image"
// // //   });
// // // }

// // // if (selectedImage) {
// // //   onSendText({
// // //     file: selectedImage.file,
// // //     type: selectedImage.file.type.startsWith("video") ? "video" : "image"
// // //   });
// // // }



// //     setSelectedImage(null);
// //   };



// //    const sendText = () => {
// //   console.log("🧪 sendText() CALLED");

// //   if (!text.trim() && !selectedImage) return;

// //   // TEXT MESSAGE
// //   if (text.trim()) {
// //     onSendText({
// //       type: "text",
// //       text
// //     });
// //   }

// //   // IMAGE MESSAGE
// //   if (selectedImage) {
// //     onSendText({
// //       type: "image",
// //       file: selectedImage.file
// //     });
// //   }

// //   setSelectedImage(null);
// // };


//   const sendText = () => {
//   console.log("🧪 sendText() CALLED");

//   if (!text.trim() && !selectedImage) return;

//   // TEXT MESSAGE
//   if (text.trim()) {
//     onSendText({
//       type: "text",
//       text
//     });
//   }

//   // IMAGE or VIDEO MESSAGE
//   if (selectedImage) {
//     onSendText({
//       type: selectedImage.type === "video" ? "video" : "image",
//       file: selectedImage.file
//     });
//   }

//   setSelectedImage(null);
// };



//   // const handleMediaUpload = (e) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   setSelectedImage({
//   //     file,
//   //     preview: URL.createObjectURL(file)
//   //   });
//   // };



// //   const handleMediaUpload = (e) => {
// //   const file = e.target.files[0];
// //   if (!file) return;

// //   const imgObj = { 
// //     file,
// //     preview: URL.createObjectURL(file)
// //   };

// //   setSelectedImage(imgObj);   // local preview
// //   if (typeof setImage === "function") setImage(imgObj); // update ChatBox state
// // };


//  const handleMediaUpload = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const mediaObj = { 
//     file,
//     preview: URL.createObjectURL(file),
//     type: file.type.startsWith("video") ? "video" : "image"
//   };

//   setSelectedImage(mediaObj);
//   if (typeof setImage === "function") setImage(mediaObj);
// };



//   const removeImage = () => setSelectedImage(null);

//   return (
//     <div className="p-2 bg-gray-900 border-t border-gray-700 flex flex-col gap-1">
//       {/* Image/Video Preview */}
//       <div className="flex items-center gap-2">
//         {selectedImage && (
//           <div className="relative w-24 h-24 rounded-md overflow-hidden">
//             {selectedImage.file.type.startsWith("video") ? (
//               <video src={selectedImage.preview} className="w-full h-full object-cover" controls />
//             ) : (
//               <img src={selectedImage.preview} alt="preview" className="w-full h-full object-cover" />
//             )}
//             <button
//               onClick={removeImage}
//               className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded-full"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         )}

//         {!audioURL && !isRecording && (
//           <div className="relative mr-15 flex-1">
           
//             <input
//               value={text}
//               onChange={(e) => onTextChange(e.target.value)}
//               placeholder="Type a message..."
//                onKeyDown={(e) => {
//     // ✅ Send message on Enter (text, image, or video)
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault(); // Prevent newline in input
//       sendText();         // Call your sendText function
//     }}}
//               className="w-[97%] ml-5 px-4 py-2 bg-gray-800/70 text-white rounded-full focus:bg-[#374151] border border-gray-700 focus:border-blue-500 outline-none shadow-inner placeholder-gray-400 transition-all duration-200"
//             />

//             <label className="absolute right-14 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white">
//               <input
//                 type="file"
//                 accept="image/*,video/*"
//                 className="hidden"
//                 onChange={handleMediaUpload}
//               />
//               <FaCamera />
//             </label>

//             {(text.trim() || selectedImage) ? (
//               <button
//                 onClick={sendText}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full"
//               >
//                 ➤
//               </button>
//             ) : (
//               <button
//                 onClick={() => setIsRecording(true)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-blue-400 rounded-full text-lg"
//               >
//                 <FaMicrophone />
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Recording UI */}
//       {isRecording && (
//         <div className="flex items-center ml-76 gap-2 mr-92 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 text-sm">
//           <div className="text-red-400 flex items-center gap-1 font-medium text-xs">
//             <span className="animate-pulse">🔴</span>
//             <span>Rec… {formatTime(timer)}</span>
//           </div>
//           <button
//             onClick={stopRecording}
//             className="px-2 py-0.5 bg-red-600  hover:bg-red-500 rounded-md text-white text-xs"
//           >
//             ⏹ Stop
//           </button>
//           <button
//             onClick={cancelRecording}
//             className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-xs"
//           >
//             ✖
//           </button>
//         </div>
//       )}

//       {/* Preview Audio */}
//       {audioURL && !isRecording && (
//         <div className="flex items-center gap-2 ml-54 mr-69 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
//           <audio controls src={audioURL} className="h-7 rounded-md" />
//           <button
//             onClick={sendAudio}
//             disabled={uploading}
//             className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded-md text-white text-xs"
//           >
//             {uploading ? "Sending..." : "✓"}
//           </button>
//           <button
//             onClick={cancelRecording}
//             className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-xs"
//           >
//             ✖
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;












// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";
// import { RiEmojiStickerLine } from "react-icons/ri";

// const ChatInput = ({
//   text,
//   onTextChange,
//   onSendText,
//   setImage,
//   onSendAudio,
//   socket,
//   currentUserId,
//   selectedUser,
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioURL, setAudioURL] = useState(null);
//   const [timer, setTimer] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const timerRef = useRef(null);

//   // Cleanup interval and preview URLs
//   useEffect(() => {
//     return () => {
//       clearInterval(timerRef.current);
//       if (selectedImage?.preview) {
//         URL.revokeObjectURL(selectedImage.preview);
//       }
//       if (audioURL) {
//         URL.revokeObjectURL(audioURL);
//       }
//     };
//   }, [selectedImage, audioURL]);

//   // Start recording when toggled
//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     }
//   }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

//   const formatTime = (seconds) => {
//     const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // =========================
//   // Voice Recording
//   // =========================
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const chunks = [];

//       setMediaRecorder(recorder);
//       setTimer(0);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const url = URL.createObjectURL(blob);
//         setAudioURL(url);

//         stream.getTracks().forEach((track) => track.stop());
//       };

//       recorder.start(); // no timeslice needed

//       timerRef.current = setInterval(() => {
//         setTimer((prev) => prev + 1);
//       }, 1000);
//     } catch (error) {
//       console.error("Microphone permission denied:", error);
//       alert("Microphone permission denied.");
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state !== "inactive") {
//       mediaRecorder.stop();
//     }

//     clearInterval(timerRef.current);
//     setIsRecording(false);
//   };

//   const cancelRecording = () => {
//     if (mediaRecorder && mediaRecorder.state !== "inactive") {
//       mediaRecorder.stop();
//     }

//     clearInterval(timerRef.current);

//     if (audioURL) {
//       URL.revokeObjectURL(audioURL);
//     }

//     setIsRecording(false);
//     setAudioURL(null);
//     setTimer(0);
//   };

//   // =========================
//   // Send Audio
//   // =========================
//   const sendAudio = async () => {
//     if (!audioURL || !selectedUser?._id) return;

//     try {
//       setUploading(true);

//       const response = await fetch(audioURL);
//       const blob = await response.blob(); // webm blob

//       // Let ChatBox handle uploading and saving
//       if (typeof onSendAudio === "function") {
//         await onSendAudio({
//           type: "audio",
//           file: new File([blob], "voice.webm", { type: "audio/webm" }),
//         });
//       }

//       cancelRecording();
//     } catch (error) {
//       console.error("Voice upload error:", error);
//       alert("Upload failed. Try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // =========================
//   // Send Text / Image / Video
//   // =========================
//   const sendMessage = () => {
//     if (!text.trim() && !selectedImage) return;

//     // Send text
//     if (text.trim()) {
//       onSendText({
//         type: "text",
//         text,
//       });
//     }

//     // Send image or video
//     if (selectedImage) {
//       onSendText({
//         type: selectedImage.type,
//         file: selectedImage.file,
//       });

//       if (typeof setImage === "function") {
//         setImage(selectedImage);
//       }
//     }

//     // Clear preview
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     setSelectedImage(null);
//   };

//   // =========================
//   // Media Upload
//   // =========================
//   const handleMediaUpload = (event) => {
//     const file = event.target.files?.[0]; // first selected file
//     if (!file) return;

//     // Remove old preview URL to avoid memory leaks
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     const media = {
//       file,
//       preview: URL.createObjectURL(file),
//       type: file.type.startsWith("video") ? "video" : "image",
//     };

//     setSelectedImage(media);

//     if (typeof setImage === "function") {
//       setImage(media);
//     }

//     // Reset input so same file can be selected again later
//     event.target.value = "";
//   };

//   const removeSelectedImage = () => {
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     setSelectedImage(null);

//     if (typeof setImage === "function") {
//       setImage(null);
//     }
//   };

//   // =========================
//   // Keyboard Shortcut
//   // =========================
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault(); // prevent newline
//       sendMessage(); // send current message
//     }
//   };

//   return (
//   <div className=" border-slate-200  p-2 sm:p-3">
//     {/* Image / Video Preview */}
//     {selectedImage && (
//       <div className="mb-3 inline-block relative">
//         <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           {selectedImage.type === "video" ? (
//             <video
//               src={selectedImage.preview}
//               controls
//               className="h-full w-full object-cover"
//             />
//           ) : (
//             <img
//               src={selectedImage.preview}
//               alt="Preview"
//               className="h-full w-full object-cover"
//             />
//           )}

//           <button
//             type="button"
//             onClick={removeSelectedImage}
//             className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
//           >
//             <FaTimes size={12} />
//           </button>
//         </div>
//       </div>
//     )}

//     {/* Recording UI */}
//     {isRecording && (
//       <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
//         <div className="flex items-center gap-2 text-sm font-medium text-red-600">
//           <span className="animate-pulse">🔴</span>
//           <span>Recording {formatTime(timer)}</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={stopRecording}
//             className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
//           >
//             Stop
//           </button>

//           <button
//             type="button"
//             onClick={cancelRecording}
//             className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     )}

//     {/* Audio Preview */}
//     {audioURL && !isRecording && (
//       <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
//         <audio controls src={audioURL} className="max-w-full" />

//         <button
//           type="button"
//           onClick={sendAudio}
//           disabled={uploading}
//           className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
//         >
//           {uploading ? "Sending..." : "Send"}
//         </button>

//         <button
//           type="button"
//           onClick={cancelRecording}
//           className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
//         >
//           Remove
//         </button>
//       </div>
//     )}

//     {/* Main Input Row */}
    
//     {/* Main Input Row */}
// {!audioURL && !isRecording && (
//   <div className="relative">
//     {/* Text Input with internal padding for icons */}
//     <input
//       type="text"
//       value={text}
//       onChange={(event) => onTextChange(event.target.value)}
//       onKeyDown={handleKeyDown}
//       placeholder="Type a message..."
//       className="
//         w-full rounded-full border border-slate-200 bg-slate-50
//         pl-4 pr-24 py-3 text-sm text-slate-700
//         outline-none transition-all duration-200
//         placeholder:text-slate-400
//         focus:border-slate-300 focus:bg-white
//         focus:ring-2 focus:ring-slate-100
//       "
//     />


//     {/* stiker */}

  
//     <label className="absolute right-185 top-1/2 -translate-y-1/2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 ">
//        <RiEmojiStickerLine />
//     </label>


//     {/* Camera Icon Inside Input */}
//     <label
//       className="
//         absolute right-12 top-1/2 -translate-y-1/2
//         flex h-9 w-9 cursor-pointer items-center justify-center
//         rounded-full text-slate-500
//         transition hover:bg-slate-100 hover:text-slate-700
//       "
//     >
//       <input
//         type="file"
//         accept="image/*,video/*"
//         className="hidden"
//         onChange={handleMediaUpload}
//       />
//       <FaCamera size={16} />
//     </label>

    


//     {/* Send or Microphone Button Inside Input */}
//     {text.trim() || selectedImage ? (
//       <button
//         type="button"
//         onClick={sendMessage}
//         className="
//           absolute right-1 top-1/2 -translate-y-1/2
//           flex h-9 w-9 items-center justify-center
//           rounded-full
//           bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
//           text-white transition hover:opacity-90
//         "
//       >
//         ➤
//       </button>
//     ) : (
//       <button
//         type="button"
//         onClick={() => setIsRecording(true)}
//         className="
//           absolute right-1 top-1/2 -translate-y-1/2
//           flex h-9 w-9 items-center justify-center
//           rounded-full bg-slate-100
//           text-blue-600 transition hover:bg-slate-200
//         "
//       >
//         <FaMicrophone size={16} />
//       </button>
//     )}
//   </div>
// )}


//   </div>
// );
// };

// export default ChatInput;






// // src/components/chat/ChatInput.jsx

// import React, { useEffect, useRef, useState } from "react";
// import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";
// import { RiEmojiStickerLine } from "react-icons/ri";
// import EmojiPicker from "emoji-picker-react";

// const ChatInput = ({
//   text,
//   onTextChange,
//   onSendText,
//   setImage,
//   onSendAudio,
//   selectedUser,
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioURL, setAudioURL] = useState(null);
//   const [timer, setTimer] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const [showEmoji, setShowEmoji] = useState(false);
                                                         
//   const timerRef = useRef(null);


//   const handleEmojiClick = (emojiData) => {
//       onTextChange(text + emojiData.emoji);
//       setShowEmoji(false);
//   }


//   // Cleanup interval and preview URLs
//   useEffect(() => {
//     return () => {
//       clearInterval(timerRef.current);

//       if (selectedImage?.preview) {
//         URL.revokeObjectURL(selectedImage.preview);
//       }

//       if (audioURL) {
//         URL.revokeObjectURL(audioURL);
//       }
//     };
//   }, [selectedImage, audioURL]);

//   // Start recording when toggled
//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     }
//   }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

//   const formatTime = (seconds) => {
//     const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // =========================
//   // Voice Recording
//   // =========================
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       const recorder = new MediaRecorder(stream);
//       const chunks = [];

//       setMediaRecorder(recorder);
//       setTimer(0);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(chunks, {
//           type: "audio/webm",
//         });

//         const url = URL.createObjectURL(blob);
//         setAudioURL(url);

//         stream.getTracks().forEach((track) => track.stop());
//       };

//       recorder.start();

//       timerRef.current = setInterval(() => {
//         setTimer((prev) => prev + 1);
//       }, 1000);
//     } catch (error) {
//       console.error("Microphone permission denied:", error);
//       alert("Microphone permission denied.");
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     if (
//       mediaRecorder &&
//       mediaRecorder.state !== "inactive"
//     ) {
//       mediaRecorder.stop();
//     }

//     clearInterval(timerRef.current);
//     setIsRecording(false);
//   };

//   const cancelRecording = () => {
//     if (
//       mediaRecorder &&
//       mediaRecorder.state !== "inactive"
//     ) {
//       mediaRecorder.stop();
//     }

//     clearInterval(timerRef.current);

//     if (audioURL) {
//       URL.revokeObjectURL(audioURL);
//     }

//     setIsRecording(false);
//     setAudioURL(null);
//     setTimer(0);
//   };

//   // =========================
//   // Send Audio
//   // =========================
//   const sendAudio = async () => {
//     if (!audioURL || !selectedUser?._id) return;

//     try {
//       setUploading(true);

//       const response = await fetch(audioURL);
//       const blob = await response.blob();

//       if (typeof onSendAudio === "function") {
//         await onSendAudio({
//           type: "audio",
//           file: new File(
//             [blob],
//             "voice.webm",
//             {
//               type: "audio/webm",
//             }
//           ),
//         });
//       }

//       cancelRecording();
//     } catch (error) {
//       console.error("Voice upload error:", error);
//       alert("Upload failed. Try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // =========================
//   // Send Text / Image / Video
//   // =========================
//   const sendMessage = () => {
//     if (!text.trim() && !selectedImage) return;

//     // Send text
//     if (text.trim()) {
//       onSendText({
//         type: "text",
//         text,
//       });
//     }                                      

//     // Send image or video
//     if (selectedImage) {
//       onSendText({
//         type: selectedImage.type,
//         file: selectedImage.file,
//       });

//       if (typeof setImage === "function") {
//         setImage(selectedImage);
//       }
//     }

//     // Clear preview URL
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     // Reset preview
//     setSelectedImage(null);
//   };

//   // =========================
//   // Media Upload
//   // =========================
//   const handleMediaUpload = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Remove old preview URL
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     const media = {
//       file,
//       preview: URL.createObjectURL(file),
//       type: file.type.startsWith("video")
//         ? "video"
//         : "image",
//     };

//     setSelectedImage(media);

//     if (typeof setImage === "function") {
//       setImage(media);
//     }

//     // Allow selecting same file again later
//     event.target.value = "";
//   };

//   const removeSelectedImage = () => {
//     if (selectedImage?.preview) {
//       URL.revokeObjectURL(selectedImage.preview);
//     }

//     setSelectedImage(null);

//     if (typeof setImage === "function") {
//       setImage(null);
//     }
//   };

//   // =========================
//   // Send on Enter
//   // =========================
//   const handleKeyDown = (event) => {
//     if (
//       event.key === "Enter" &&
//       !event.shiftKey
//     ) {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="border-slate-200 bg-[#EFEAE2] p-2 sm:p-3">
//       {/* =========================
//           Image / Video Preview
//       ========================= */}

//              {showEmoji && (
//               <div children="absolute bottom-14 left-0 z-50  ">    
//                 <EmojiPicker 
//                 onEmojiClick={handleEmojiClick}  />
//               </div>
//             )}
          

//       {selectedImage && (
//         <div className="relative mb-3 inline-block">
//           <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//             {selectedImage.type === "video" ? (
//               <video
//                 src={selectedImage.preview}
//                 controls
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <img
//                 src={selectedImage.preview}
//                 alt="Preview"
//                 className="h-full w-full object-cover"
//               />
//             )}

//             <button
//               type="button"
//               onClick={removeSelectedImage}
//               className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
//             >
//               <FaTimes size={12} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* =========================
//           Recording UI
//       ========================= */}
//       {isRecording && (
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
//           <div className="flex items-center gap-2 text-sm font-medium text-red-600">
//             <span className="animate-pulse">🔴</span>
//             <span>
//               Recording {formatTime(timer)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={stopRecording}
//               className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
//             >
//               Stop
//             </button>

//             <button
//               type="button"
//               onClick={cancelRecording}
//               className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* =========================
//           Audio Preview
//       ========================= */}
//       {audioURL && !isRecording && (
//         <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
//           <audio
//             controls
//             src={audioURL}
//             className="max-w-full"
//           />

//           <button
//             type="button"
//             onClick={sendAudio}
//             disabled={uploading}
//             className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
//           >
//             {uploading
//               ? "Sending..."
//               : "Send"}
//           </button>

//           <button
//             type="button"
//             onClick={cancelRecording}
//             className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
//           >
//             Remove
//           </button>
//         </div>
//       )}

//       {/* =========================
//           Main Input Row
//       ========================= */}
//       {!audioURL && !isRecording && (
//         <div className="relative">
//           {/* Text Input */}
//           {/* <input
//             type="text"
//             value={text}
//             onChange={(event) =>
//               onTextChange(
//                 event.target.value
//               )
//             }
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message..."
//             className="
//               w-full rounded-full border border-slate-200 bg-slate-50
//               pl-12 pr-24 py-3
//               text-sm text-slate-700
//               outline-none transition-all duration-200
//               placeholder:text-slate-400
//               focus:border-slate-300 focus:bg-white
//               focus:ring-2 focus:ring-slate-100
//             "
//           /> */}

//           {/* <input
//   type="text"
//   value={text}
//   onChange={(event) =>
//     onTextChange(event.target.value)
//   }
//   onKeyDown={handleKeyDown}
//   placeholder="Type a message..."
//   className="
//     w-full rounded-full
//     border border-slate-200
//     bg-white
//     pl-12 pr-24 py-3
//     text-sm text-slate-700
//     shadow-sm
//     outline-none
//     transition-all duration-200
//     placeholder:text-slate-400
//     focus:border-slate-300
//     focus:ring-2 focus:ring-slate-100
//   "
// /> */}




//           <input
//   type="text"
//   value={text}
//   onChange={(event) =>
//     onTextChange(event.target.value)
//   }
//   onKeyDown={handleKeyDown}
//   placeholder="Type a message..."
//   className="
//     w-full min-w-0
//     rounded-full
//     border border-slate-200
//     bg-white
//     pl-11 sm:pl-12
//     pr-20 sm:pr-24
//     py-2.5 sm:py-3
//     text-sm text-slate-700
//     shadow-sm
//     outline-none
//     transition-all duration-200
//     placeholder:text-slate-900

//     /* Prevent zoom on iPhone and improve mobile usability */
//     text-[16px] sm:text-sm

//     /* Prevent text overflow on small screens */
//     truncate

//     /* Focus styles */
    
//   "
// />

   


//           {/* Sticker Icon (Left) */}
//           <button onClick={() => setShowEmoji(!showEmoji)}
//             type="button"        
//             className="
//               absolute cursor-pointer left-2 top-1/2 -translate-y-1/2
//               flex h-8 w-8 sm:h-9 sm:w-9
//               items-center justify-center
//               rounded-full
//               text-slate-700
//               transition hover:bg-slate-100 hover:text-slate-600
//             "
//           >
//             <RiEmojiStickerLine className="text-lg sm:text-xl" />              
//           </button>


//           {/* Camera Icon (Right) */}
//           <label
//             className="
//               absolute right-9.5 top-1/2 -translate-y-1/2
//               flex h-10 w-10 sm:h-9 sm:w-9
//               cursor-pointer items-center justify-center
//               rounded-full
//               text-slate-700
//               transition hover:bg-slate-100 hover:text-slate-600
//             "
//           >
//             <input
//               type="file"
//               accept="image/*,video/*"
//               className="hidden"
//               onChange={handleMediaUpload}
//             />
//             <FaCamera className="text-sm sm:text-base" />
//           </label>

//           {/* Send or Microphone */}
//           {text.trim() || selectedImage ? (
//             <button
//               type="button"
//               onClick={sendMessage}
//               className="
//                 absolute right-1 top-1/2 -translate-y-1/2
//                 flex h-8 w-8 sm:h-9 sm:w-9
//                 items-center justify-center
//                 rounded-full
//                 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
//                 text-white
//                 transition hover:opacity-90
//               "
//             >
//               <span className="text-sm sm:text-base">
//                 ➤
//               </span>
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() =>
//                 setIsRecording(true)
//               }
//               className="
//                 absolute right-1 top-1/2 -translate-y-1/2
//                 flex h-8 w-8 sm:h-9 sm:w-9
//                 items-center justify-center
//                 rounded-full
//                 bg-slate-100
//                 text-blue-600
//                 transition hover:bg-slate-200
//               "
//             >
//               <FaMicrophone className="text-sm sm:text-base" />
//             </button>
//           )}

  

//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;





// src/components/chat/ChatInput.jsx

import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { playSendSound } from "../../../utils/playSendSound";

const ChatInput = ({
  text,
  onTextChange,
  onSendText,
  setImage,
  onSendAudio,
  selectedUser,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // =========================
  // Emoji State
  // =========================
  const [showEmoji, setShowEmoji] = useState(false);

  const timerRef = useRef(null);

  // =========================
  // Emoji Handler
  // =========================
  const handleEmojiClick = (emojiData) => {
    onTextChange(text + emojiData.emoji);
  };

  // Cleanup interval and preview URLs
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }

      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [selectedImage, audioURL]);

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

  // =========================
  // Voice Recording
  // =========================
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
      console.error("Microphone permission denied:", error);
      alert("Microphone permission denied.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.state !== "inactive"
    ) {
      mediaRecorder.stop();
    }

    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.state !== "inactive"
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

  // =========================
  // Send Audio
  // =========================
  const sendAudio = async () => {
    if (!audioURL || !selectedUser?._id) return;

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
      console.error("Voice upload error:", error);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Send Text / Image / Video
  // =========================
  const sendMessage = () => {
    if (!text.trim() && !selectedImage) return;

    playSendSound();

    // Send text
    if (text.trim()) {
      onSendText({
        type: "text",
        text,
      });
    }

    // Send image or video
    if (selectedImage) {
      onSendText({
        type: selectedImage.type,
        file: selectedImage.file,
      });

      if (typeof setImage === "function") {
        setImage(selectedImage);
      }
    }

    // Clear preview URL
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    // Reset preview
    setSelectedImage(null);
  };

  // =========================
  // Media Upload
  // =========================
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

    if (typeof setImage === "function") {
      setImage(media);
    }

    // Allow selecting same file again later
    event.target.value = "";
  };

  const removeSelectedImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);

    if (typeof setImage === "function") {
      setImage(null);
    }
  };

  // =========================
  // Send on Enter
  // =========================
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
    <div className="border-slate-200 bg-[#EFEAE2] p-2 sm:p-3">
      {/* =========================
          Emoji Picker
      ========================= */}
      {showEmoji && (
        <div
          className="
            absolute bottom-14 left-2 z-50
            w-[450px] max-w-[95vw]
            sm:w-[322px]
          "
        >

 
             <div className="flex items-center rounded-t-lg  justify-between py-1 px-2  border-b border-slate-200 bg-white">
      <span className="text-sm font-medium text-slate-700">
        Emojis
      </span>

      <button
        type="button"
        onClick={() => setShowEmoji(false)}
        className="
          flex items-center justify-center
          h-7 w-7 rounded-full
          hover:bg-slate-200
          transition
        "
      >
        <FaTimes className="text-sm text-slate-600" />
      </button>
    </div>


          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={325}
          />
        </div>
      )}

      {/* =========================
          Image / Video Preview
      ========================= */}
      {selectedImage && (
        <div className="relative mb-3 inline-block">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {selectedImage.type === "video" ? (
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

      {/* =========================
          Recording UI
      ========================= */}
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
              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
            >
              Stop
            </button>

            <button
              type="button"
              onClick={cancelRecording}
              className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =========================
          Audio Preview
      ========================= */}
      {audioURL && !isRecording && (
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
            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {uploading
              ? "Sending..."
              : "Send"}
          </button>

          <button
            type="button"
            onClick={cancelRecording}
            className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
          >
            Remove
          </button>
        </div>
      )}

      {/* =========================
          Main Input Row
      ========================= */}
      {!audioURL && !isRecording && (
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
              py-2.5 sm:py-3
              text-[16px] sm:text-sm
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
            <RiEmojiStickerLine className="text-lg sm:text-xl" />
          </button>

          {/* Camera Icon */}
          <label
            className="
              absolute right-9.5 top-1/2 -translate-y-1/2
              flex h-10 w-10 sm:h-9 sm:w-9
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
          {text.trim() || selectedImage ? (
            <button
              type="button"
              onClick={sendMessage}
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                flex h-8 w-8 sm:h-9 sm:w-9
                items-center justify-center
                rounded-full
                bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
                text-white
                transition hover:opacity-90
              "
            >
              <span className="text-sm sm:text-base">
                ➤
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
                flex h-8 w-8 sm:h-9 sm:w-9
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