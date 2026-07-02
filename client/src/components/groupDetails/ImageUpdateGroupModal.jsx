import React from "react";
import { useState } from "react";

const ImageUpdateGroupModal = ({
  groupImage,
  selectedFile,
  setSelectedFile,
  setGroupImage,
  onClose,
  onSave,
  isUploading
}) => {

  // if(!selectedFile) {
  //    return;
  // }


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    // Preview image
    setGroupImage(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px]">

        <h2 className="text-xl font-semibold mb-4">
          Update Group Image
        </h2>

        {groupImage && (
          <img
            src={groupImage}
            alt="Group Preview"
            className="w-40 h-40 rounded-full object-cover mx-auto mb-5"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-5"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={!selectedFile}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {isUploading ? <span>saving...</span> : <span>save</span>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImageUpdateGroupModal;