import React from "react";
import { FiCamera } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Spinner from "../Spinner";

const ImageUpdateGroupModal = ({
  groupImage,
  selectedFile,
  setSelectedFile,
  setGroupImage,
  onClose,
  onSave,
  isUploading,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setGroupImage(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[12px] p-0 sm:p-4">

      <div className="w-full sm:w-[400px] bg-white rounded-t-[28px] sm:rounded-[24px] shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease]">

        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900 leading-tight">
              Group photo
            </h2>
            <p className="text-[13px] text-slate-500 mt-0.5">Tap to change</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-[#F1F2F5] hover:bg-slate-200 flex items-center justify-center text-slate-600 transition active:scale-95">
            <IoClose className="text-[20px]" />
          </button>
        </div>

        <div className="py-8 flex flex-col items-center">
          <label className="relative cursor-pointer group">
            <div className="relative w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900 via-blue-600 to-indigo-600 blur-[20px] opacity-20 group-hover:opacity-30 transition" />
              <img
                src={groupImage || "https://cdn-icons-png.flaticon.com/512/681/681494.png"}
                alt="Group"
                className="relative w-full h-full rounded-full object-cover border-[4px] border-white shadow-[0_12px_32px_rgba(0,0,0,0.14)] group-active:scale-[0.98] transition"
              />
              <div className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-white shadow-lg border-2 border-white flex items-center justify-center transition">
                <FiCamera size={18} />
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <p className="text-[13px] text-slate-500 mt-4 px-6 text-center">
            {selectedFile? "New photo selected" : "Tap photo to choose from gallery"}
          </p>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F8F9FB] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-full bg-white border border-slate-200 text-[15px] font-medium text-slate-700 hover:bg-slate-50 transition active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={!selectedFile || isUploading}
            className="flex-1 h-[48px] rounded-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 text-[15px] font-semibold text-white hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98] flex items-center justify-center shadow-[0_6px_18px_rgba(37,99,235,0.35)]"
          >
            {isUploading? <Spinner /> : "Save photo"}
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ImageUpdateGroupModal;