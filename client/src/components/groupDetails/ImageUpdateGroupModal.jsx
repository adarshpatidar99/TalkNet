import React from "react";
import { FiCamera } from "react-icons/fi";
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

    // Preview selected image
    setGroupImage(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-5 text-center text-xl font-semibold">
          Update Group Image
        </h2>

        <div className="mb-6 flex justify-center">
          <label className="relative cursor-pointer">

            <img
              src={
                groupImage ||
                "https://cdn-icons-png.flaticon.com/512/681/681494.png"
              }
              alt="Group"
              className="h-40 w-40 rounded-full object-cover border-2 border-slate-200"
            />

            <div
              className="
                absolute bottom-2 right-2
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-gradient-to-r
                from-slate-900
                via-blue-600
                to-indigo-600
                text-white
                shadow-lg
              "
            >
              <FiCamera size={18} />
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-5 py-2 text-sm font-medium hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={!selectedFile || isUploading}
            className="flex h-10 min-w-[110px] items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? <Spinner /> : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ImageUpdateGroupModal;