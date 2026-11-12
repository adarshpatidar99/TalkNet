import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaCamera, FaTimes } from "react-icons/fa";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

const ChatInput = ({ text, onTextChange, onSendText, onSendAudio, selectedUser }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(()=>()=>{
    clearInterval(timerRef.current);
    if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
  },[]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream); const chunks=[];
      mediaRecorderRef.current=rec;
      rec.ondataavailable=e=>chunks.push(e.data);
      rec.onstop=()=>{ setAudioURL(URL.createObjectURL(new Blob(chunks,{type:"audio/webm"}))); stream.getTracks().forEach(t=>t.stop()); };
      rec.start(); setIsRecording(true); setTimer(0);
      timerRef.current=setInterval(()=>setTimer(p=>p+1),1000);
    } catch { toast.error("Mic denied"); }
  };
  const stopRecording = () => { mediaRecorderRef.current?.stop(); clearInterval(timerRef.current); setIsRecording(false); };
  const cancelRecording = () => { mediaRecorderRef.current?.stop(); clearInterval(timerRef.current); if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()); setIsRecording(false); setAudioURL(null); setTimer(0); };
  const sendAudio = async () => {
    if(!audioURL) return; setUploading(true);
    const blob = await (await fetch(audioURL)).blob();
    await onSendAudio({ type:"audio", file:new File([blob],"voice.webm",{type:"audio/webm"}) });
    cancelRecording(); setUploading(false);
  };
  const sendMessage = () => {
    if(!text.trim() &&!selectedImage) return;
    if(text.trim()) onSendText({ type:"text", text });
    if(selectedImage) onSendText({ type:selectedImage.type, file:selectedImage.file });
    if(selectedImage?.preview) URL.revokeObjectURL(selectedImage.preview);
    setSelectedImage(null); onTextChange("");
  };
  const handleUpload = (e) => {
    const file=e.target.files?.[0]; if(!file) return;
    if(selectedImage?.preview) URL.revokeObjectURL(selectedImage.preview);
    setSelectedImage({ file, preview:URL.createObjectURL(file), type:file.type.startsWith("video")?"video":"image" });
    e.target.value="";
  };

  return (
    <div className="shrink-0 bg-[#F7F8FA] md:bg-white border-t border-slate-200/70 px-2.5 py-2 md:px-4 md:py-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-3">
      
      {showEmoji && (
        <div className="absolute bottom-[68px] md:bottom-[76px] left-2.5 right-2.5 md:left-4 md:right-auto md:w-[352px] rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] overflow-hidden z-50 animate-[scaleIn_0.15s_ease]">
          <div className="flex justify-between items-center p-3 px-4 border-b border-slate-100">
            <span className="text-[13px] font-semibold text-slate-800">Emoji</span>
            <button onClick={()=>setShowEmoji(false)} className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"><FaTimes size={10} className="text-slate-600"/></button>
          </div>
          <EmojiPicker onEmojiClick={(e)=>onTextChange(text+e.emoji)} width="100%" height={320} previewConfig={{showPreview:false}} />
        </div>
      )}

      {selectedImage && (
        <div className="mb-2.5 flex items-end gap-2">
          <div className="relative rounded-[14px] overflow-hidden border border-slate-200 bg-white shadow-sm">
            {selectedImage.type === "image" ? (
              <img src={selectedImage.preview} className="h-[72px] w-[72px] md:h-[80px] md:w-[80px] object-cover" alt=""/>
            ) : (
              <video src={selectedImage.preview} className="h-[72px] w-[72px] md:h-[80px] md:w-[80px] object-cover" />
            )}
            <button onClick={()=>{ if(selectedImage?.preview) URL.revokeObjectURL(selectedImage.preview); setSelectedImage(null); }} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition"><FaTimes size={10}/></button>
          </div>
          <span className="text-[11px] text-slate-500 mb-1">1 file attached</span>
        </div>
      )}

      {isRecording && (
        <div className="mb-2.5 flex justify-between items-center rounded-full bg-white border border-red-200 px-3 md:px-4 py-2 shadow-sm">
          <div className="flex gap-2.5 items-center text-red-600">
            <span className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"/>
            <span className="text-[13px] md:text-[13px] font-medium tabular-nums">{formatTime(timer)} • Recording</span>
          </div>
          <div className="flex gap-2">
            <button onClick={cancelRecording} className="h-[34px] md:h-8 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[12.5px] font-medium transition">Cancel</button>
            <button onClick={stopRecording} className="h-[34px] md:h-8 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-[12.5px] font-medium shadow-sm transition">Stop</button>
          </div>
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="mb-2.5 flex items-center gap-2 p-2 rounded-full bg-white border border-slate-200 shadow-sm">
          <audio controls src={audioURL} className="flex-1 h-[36px] md:h-9 w-full rounded-full" />
          <button onClick={cancelRecording} className="h-9 w-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 border flex items-center justify-center transition"><FaTimes size={10} className="text-slate-600"/></button>
          <button onClick={sendAudio} className="h-9 px-4 rounded-full bg-[#0084FF] hover:bg-[#0066CC] text-white text-[13px] font-medium shadow-sm transition disabled:opacity-50" disabled={uploading}>{uploading?"Sending...":"Send"}</button>
        </div>
      )}

      {!audioURL && !isRecording && (
        <div className="flex gap-2 md:gap-3 items-end">
          <div className="flex-1 relative flex items-end">
          
            <input 
              value={text} 
              onChange={e=>onTextChange(e.target.value)} 
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); }}} 
              placeholder="Message" 
              className="w-full h-[42px] md:h-[44px] rounded-full bg-white border border-slate-200 md:border-slate-200 shadow-sm md:shadow-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100/60 pl-[42px] md:pl-12 pr-[46px] md:pr-12 text-[15px] md:text-[14.5px] text-[#111B21] placeholder:text-[#667781] outline-none transition"
            />
            <button 
              onClick={()=>setShowEmoji(!showEmoji)} 
              className={`absolute left-1 md:left-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] md:h-8 md:w-8 rounded-full flex items-center justify-center transition ${showEmoji ? "bg-blue-50 text-[#0084FF]" : "text-[#667781] hover:text-slate-700 hover:bg-slate-100"}`}
            >
              <RiEmojiStickerLine size={20} className="md:w-[20px] md:h-[20px]" />
            </button>
            <label className="absolute right-1 md:right-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] md:h-8 md:w-8 rounded-full bg-[#F1F2F5] md:bg-[#F1F2F5] hover:bg-[#E8EBF0] border-0 md:border border-slate-200/60 flex items-center justify-center cursor-pointer transition active:scale-95">
              <input type="file" accept="image/*,video/*" hidden onChange={handleUpload}/>
              <FaCamera size={13} className="text-slate-600 md:text-[14px]" />
            </label>
          </div>

          {text.trim()||selectedImage ? (
            <button onClick={sendMessage} className="h-[42px] w-[42px] md:h-[44px] md:w-[44px] rounded-full bg-[#0084FF] hover:bg-[#0066CC] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,132,255,0.35)] active:scale-95 transition shrink-0">
              <IoSend size={18} className="md:w-5 md:h-5 translate-x-[-1px]" />
            </button>
          ) : (
            <button onClick={startRecording} className="h-[42px] w-[42px] md:h-[44px] md:w-[44px] rounded-full bg-[#0084FF] hover:bg-[#0066CC] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,132,255,0.35)] active:scale-95 transition shrink-0">
              <FaMicrophone size={16} className="md:w-[17px] md:h-[17px]" />
            </button>
          )}
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity:0; transform: scale(0.98) translateY(6px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};
export default ChatInput;