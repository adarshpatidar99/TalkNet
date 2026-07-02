// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import { FaUsers } from "react-icons/fa";

// const GroupHeader = ({ group }) => {
//   const navigate = useNavigate();

//   return (
//     <section className="w-full bg-white shadow-sm border-b">

//       {/* Top Bar */}
//       <div className="flex items-center gap-3 px-5 py-4">

//         <button
//           onClick={() => navigate(-1)}
//           className="
//             h-10
//             w-10
//             rounded-full
//             flex
//             items-center
//             justify-center
//             hover:bg-slate-100
//             transition
//           "
//         >
//           <IoArrowBack className="text-2xl text-slate-700" />
//         </button>

//         <h2 className="text-xl font-semibold text-slate-800">
//           Group Info
//         </h2>

//       </div>

//       {/* Header Body */}

//       <div
//         className="
//           flex
//           flex-col
//           items-center
//           justify-center
//           px-6
//           pb-8
//         "
//       >

//         {/* Group Image */}

//         <img
//           src={group.groupImage}
//           alt={group.chatName}
//           className="
//             w-36
//             h-36
//             rounded-full
//             object-cover
//             border-4
//             border-white
//             shadow-lg
//           "
//         />

//         {/* Group Name */}

//         <h1
//           className="
//             mt-5
//             text-3xl
//             font-bold
//             text-slate-900
//             text-center
//           "
//         >
//           {group.chatName}
//         </h1>

//         {/* Member Count */}

//         <div
//           className="
//             flex
//             items-center
//             gap-2
//             mt-3
//             text-slate-600
//           "
//         >
//           <FaUsers />

//           <span className="font-medium">
//             {group.participants.length} Members
//           </span>
//         </div>

//         {/* Created Date */}

//         <p
//           className="
//             mt-2
//             text-sm
//             text-slate-500
//           "
//         >
//           Created on{" "}
//           {new Date(group.createdAt).toLocaleDateString()}
//         </p>

//       </div>

//     </section>
//   );
// };

// export default GroupHeader;





import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import RenameGroupModal from "./RenameGroupModal";
import { useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import ImageUpdateGroupModal from "./ImageUpdateGroupModal";

const GroupHeader = ({ group, isAdmin, setGroup }) => {

  const navigate = useNavigate();
                                           
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [groupName, setGroupName] = useState(group.chatName);

  const [groupImage, setGroupImage] = useState(group.groupImage);

  const [selectedFile, setSelectedFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const [openImageModal, setOpenImageModal] = useState(false);

  if(openImageModal) {
    console.log("Image modal open");
    
  }

  useEffect(() => {
     setGroupImage(group.groupImage)
  }, [group.groupImage]);          

                                  
  useEffect(() => {
     setGroupName(group.chatName)
  }, [group.chatName]);

  const handleRenameGroup = async() => {
    
    try {
      
      const res = await axios.put('http://localhost:5000/api/v1/chat/group/rename', 
      {chatId: group._id,
       name: groupName
      }, {withCredentials: true})

        setGroup(res.data.chat);   
    setOpenRenameModal(false);   

    } catch (error) {
      console.log("Some error occured", error);
    }
     
  }

   const handleUpdateGroupImage = async () => {
  try {
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("chatId", group._id);
    formData.append("groupImage", selectedFile);

    const response = await axios.put(
      "http://localhost:5000/api/v1/chat/group/image",
      formData,
      {
        withCredentials: true,
      }
    );

    setGroup(response.data.chat);
    
    setSelectedFile(null);
    setOpenImageModal(false);
  } catch (error) {
    console.log(error);
  } finally {
    setIsUploading(false);
  }
};


  return (
    <section className="w-full">

      {/* Top Gradient Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 h-28 rounded-3xl relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <IoArrowBack className="text-white text-xl" />
        </button>

        {/* Title */}
        <h2 className="absolute top-5 left-16 text-white font-semibold text-lg">
          Group Profile
        </h2>

      </div>

      {/* Floating Card */}
      <div className="bg-white rounded-3xl shadow-lg -mt-14 mx-4 p-6 flex flex-col items-center text-center">

       

         {/* Image */}
<div className="relative">

  <img
    src={group.groupImage}
    alt={group.chatName}
    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
  />

  {isAdmin && (
    <button
      onClick={() => setOpenImageModal(true)}
      className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition"
    >
      <FaCamera className="text-sm" />
    </button>
  )}

  {openImageModal && (
    <ImageUpdateGroupModal
      groupImage={groupImage}
      isUploading={isUploading}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      setGroupImage={setGroupImage}
      onClose={() => setOpenImageModal(false)}
      onSave={handleUpdateGroupImage}
    />
  )}

</div>
         


      {/* Name */}
<div className="flex items-center justify-center gap-2 mt-4">

  <h1 className="text-xl font-bold text-slate-900">
    {group.chatName}
  </h1>

  {isAdmin && (
    <button
      onClick={() => setOpenRenameModal(true)}
      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
    >
      <FiEdit2 className="text-slate-600 hover:text-blue-600 text-lg" />
    </button>
  )}

  {openRenameModal && (
    <RenameGroupModal
      groupName={groupName}
      setGroupName={setGroupName}
      onClose={() => setOpenRenameModal(false)}
      onSave={handleRenameGroup}
    />
  )}

</div>



        {/* Members */}
        <div className="flex items-center gap-2 mt-2 text-slate-600">
          <FaUsers />
          <span className="text-sm font-medium">
            {group.participants.length} Members
          </span>
        </div>

        {/* Divider */}
        <div className="w-full border-t my-4"></div>

        {/* Footer Info */}
        <div className="flex justify-between w-full text-sm text-slate-500">
          <span>Group Chat</span>
          <span>
            {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>

      </div>

    </section>
  );
};

export default GroupHeader;