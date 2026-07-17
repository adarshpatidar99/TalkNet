import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addChat } from "../features/chat/chatSlice";
import { FiCamera } from "react-icons/fi";
import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

const CreateGroupDetails = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const selectedUsers =
    location.state?.selectedUsers || [];

  const [groupName, setGroupName] =
    useState("");

  const [groupNameError, setGroupNameError] = useState("");

  const [creatingGroup, setCreatingGroup] = useState(false);

  const [groupImage, setGroupImage] =
    useState(null);

  const handleGroupCreate = async () => {
  if(!groupName.trim()) {
     setGroupNameError("Please Enter Group name...")
     return 
  }

  setGroupNameError("");

  if (selectedUsers.length === 0) {
    toast.error("Please select users");
    return;
  }

  setCreatingGroup(true);

  try {
    const formData = new FormData();

    formData.append("groupName", groupName);

    if (groupImage) {
      formData.append("groupImage", groupImage);
    }

    formData.append(
      "userIds",
      JSON.stringify(userIds)
    );

    const response = await axios.post(
      `${API_URL}/api/v1/chat/group`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(addChat(response.data.groupChat));
    toast.success("New Group Created...");

    navigate("/");
  } catch (error) {
    console.error(error.response?.data || error.message);

    toast.error(
      error.response?.data?.message ||
        "Failed to create group"
    );
  } finally {
    setCreatingGroup(false);
  }
};

  const userIds = selectedUsers.map(
    (user) => user._id
  )

  return (
  <section className="min-h-screen bg-[#EFEAE2] px-3 py-4">
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">

      {/* Header */}
      <div className="border-b border-slate-100 bg-white px-5 py-4">
        <h2 className="text-center text-lg font-semibold text-slate-800">
          Create Group
        </h2>
      </div>

      <div className="p-5">

        <div className="mb-6 flex flex-col items-center">
          <label className="relative cursor-pointer">
            <img
              src={
                groupImage
                  ? URL.createObjectURL(groupImage)
                  : "https://cdn-icons-png.flaticon.com/512/681/681494.png"
              }
              alt="group"
              className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
            />

          <label
             className="
               absolute bottom-0 right-0
               flex h-8 w-8 cursor-pointer
               items-center justify-center
               rounded-full
               bg-gradient-to-r
               from-slate-900
               via-blue-600
               to-indigo-600
               text-white
               shadow-md
             "
           >
         <FiCamera className="text-sm" />

         <input
           type="file"
          accept="image/*"
          className="hidden"
         onChange={(e) => setGroupImage(e.target.files[0])}
         />
       </label>    
          </label>

          <p className="mt-3 text-xs text-slate-500">
            Upload Group Photo
          </p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Group Name
          </label>

        <>
  <input
    type="text"
    placeholder="Enter group name"
    value={groupName}
    onChange={(e) => {
      setGroupName(e.target.value);

      if (groupNameError) {
        setGroupNameError("");
      }
    }}
    className={`
      w-full rounded-xl
      bg-slate-50
      px-4 py-3
      text-sm
      outline-none
      focus:bg-white
      ${
        groupNameError
          ? "border border-red-500 focus:border-red-500"
          : "border border-slate-200 focus:border-blue-400"
      }
    `}
  />

  {groupNameError && (
    <p className="mt-1 text-xs text-red-500">
      {groupNameError}
    </p>
  )}
</>
        </div>
        
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Participants ({selectedUsers.length})
          </p>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex min-w-[70px] flex-col items-center"
              >
                <img
                  src={
                    user.avatar?.url ||
                    "https://www.w3schools.com/w3images/avatar2.png"
                  }
                  alt={user.name}
                  className="
                    h-14 w-14 rounded-full
                    border-2 border-white
                    object-cover shadow
                  "
                />

                <p className="mt-2 max-w-[65px] truncate text-center text-xs text-slate-600">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </div>

  <button
  onClick={handleGroupCreate}
  disabled={creatingGroup}
  className="
    w-full rounded-xl
    bg-gradient-to-r
    from-slate-900
    via-blue-600
    to-indigo-600
    py-3
    text-sm
    font-semibold
    text-white
    transition
    hover:opacity-90
    disabled:cursor-not-allowed
    disabled:opacity-70
  "
>
  {creatingGroup ? (
    <div className="flex items-center justify-center gap-2">
       <Spinner />
    </div>
  ) : (
    "Create Group"
  )}
</button>
      </div>
    </div>
  </section>
);  

};

export default CreateGroupDetails;