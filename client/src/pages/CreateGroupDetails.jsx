// import axios from 'axios';
// import React from 'react'
// import { useState } from 'react'
// import { useLocation } from 'react-router-dom'

// const CreateGroupDetails = () => {

//   const location = useLocation(); 

//   const selectedUsers = location.state?.selectedUsers || [];
                                               
//   const [groupName, setGroupName] = useState("");
//   const [groupImage, setGroupImage] = useState(null);
                                                           
//   const handleGroupCreate = async() => {

//      const formData = new FormData();

//      formData.append("groupName", groupName);
//      formData.append("groupImage", groupImage); 
//      formData.append(
//         "userIds",
//         JSON.stringify(selectedUsers)
//      )
     
//      const response = await axios.post('http://localhost:5000/api/v1/chat/group', formData , {
//        headers: {
//          "Content-Type": "multipart/form-data",
//        },
//      });

//   }


//   return (
    
//     <>
    
//       <div className=''>

//          <div className=''>
//            <h2 className=''> Create Group </h2>
//          </div>

//          <div className=''>
//            <input type='text' className='' placeholder='Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value) } />
//          </div>

//          <div className=''>
           
//            <input 
//             type="file"
//             onChange={(e) => setGroupImage(e.target.files[0])}
//             className=''  
//            />

//          </div>

//          <div className=''>                     
//              <p>
//                Selected Users: {" "} 
//                {selectedUsers.length}
//              </p>
                                                
//              {selectedUsers.length > 0 && 
//                selectedUsers.map((userId) => (
//                   <p key={userId}>   
//                     {userId.name}
//                   </p>        
//                ))}

//          </div>

//          <div className=''>
//            <button onClick={handleGroupCreate} className=''>
//               Create Group
//            </button>
//          </div>

//       </div>
    
//     </>

//   )
// }

// export default CreateGroupDetails    








                         



import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addChat } from "../features/chat/chatSlice";

const CreateGroupDetails = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const selectedUsers =
    location.state?.selectedUsers || [];

  const [groupName, setGroupName] =
    useState("");

  const [groupImage, setGroupImage] =
    useState(null);

  const handleGroupCreate = async () => {
    try {
      // Validation
      if (!groupName.trim()) {
        alert("Please enter group name");
        return;
      }

      if (selectedUsers.length === 0) {
        alert("Please select users");
        return;
      }

      const formData = new FormData();

      formData.append(
        "groupName",
        groupName
      );

      console.log(groupName);
      

      if (groupImage) {
        formData.append(
          "groupImage",
          groupImage
        );
      }
                                            
      formData.append(
        "userIds",
        JSON.stringify(userIds)
      );
  
      const response = await axios.post(
        "http://localhost:5000/api/v1/chat/group",
        formData,
        { 
          withCredentials: true, 
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

       console.log("GROUP RESPONSE:", response.data);

      dispatch(
        addChat(response.data.groupChat)
      )

     
     
      toast.success("New Group Created...")

      // Later:
      navigate(`/`);

    } catch (error) {
      console.error(
        error.response?.data ||
          error.message
      );
    }
  };

  

  const userIds = selectedUsers.map(
    (user) => user._id
  )



  // return (
  //   <div className="p-5">
  //     <h2 className="mb-4 text-2xl font-bold">
  //       Create Group
  //     </h2>

  //     <input
  //       type="text"
  //       placeholder="Group Name"
  //       value={groupName}
  //       onChange={(e) =>
  //         setGroupName(e.target.value)
  //       }
  //       className="mb-4 w-full rounded border p-2"
  //     />

  //     <input
  //       type="file"
  //       onChange={(e) =>
  //         setGroupImage(
  //           e.target.files[0]
  //         )
  //       }                          
  //       className="mb-4"
  //     />

  //     <div className="mb-4">
  //       <p className="font-semibold">
  //         Selected Users:{" "}
  //         {selectedUsers.length}
  //       </p>
                                       
  //       {selectedUsers.length > 0 &&
  //         selectedUsers.map((user) => (
  //           <div className="" key={user._id}>
  //                <img src={user.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
  //                <p className="">{user.name}</p>
  //           </div>
  //         ))}
  //     </div>

  //     <button
  //       onClick={handleGroupCreate}
  //       className="rounded bg-blue-500 px-4 py-2 text-white"
  //     >
  //       Create Group
  //     </button>
  //   </div>
  // );


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
        {/* Group Image */}
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

            <div
              className="
                absolute bottom-0 right-0
                flex h-8 w-8 items-center justify-center
                rounded-full
                bg-gradient-to-r
                from-slate-900
                via-blue-600
                to-indigo-600
                text-white shadow-md
              "
            >
              📷
            </div>

            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setGroupImage(e.target.files[0])
              }
            />
          </label>

          <p className="mt-3 text-xs text-slate-500">
            Upload Group Photo
          </p>
        </div>

        {/* Group Name */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Group Name
          </label>

          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
            className="
              w-full rounded-xl
              border border-slate-200
              bg-slate-50
              px-4 py-3
              text-sm
              outline-none
              focus:border-blue-400
              focus:bg-white
            "
          />
        </div>

        {/* Selected Users */}
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

        {/* Create Button */}
        <button
          onClick={handleGroupCreate}
          className="
            w-full cursor-pointer rounded-xl
            bg-gradient-to-r
            from-slate-900
            via-blue-600
            to-indigo-600
            py-3 text-sm font-semibold text-white
            transition hover:opacity-90
          "
        >
          Create Group
        </button>
      </div>
    </div>
  </section>
);  


};

export default CreateGroupDetails;