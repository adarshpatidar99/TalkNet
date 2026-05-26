// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { AiFillEdit } from "react-icons/ai";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from '../firebase';
// import { toast } from "react-toastify";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const handleImageChange = (e, setAvatar, setPreview) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       setPreview(reader.result);
//       setAvatar(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!avatar) {
//       toast.error("Please select an image!");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("email", email);
//       formData.append("username", username);
//       formData.append("password", password);
//       formData.append("avatar", avatar);

//       await axios.post(
//         "http://localhost:5000/api/v1/user/register",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       // Clear form
//       setName("");
//       setEmail("");
//       setUsername("");
//       setPassword("");
//       setAvatar(null);
//       setAvatarPreview(null);

//       toast.success("User registered successfully 🎉");
//       navigate("/");

//     } catch (error) {
//       console.error("Register error:", error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Register failed");
//       }
//     }
//   };

// const handleGoogleRegister = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);

//     const name = result.user.displayName;
//     const email = result.user.email;
//     const username = email.split("@")[0];
//     const avatar = result.user.photoURL

//     const response = await axios.post(
//       "http://localhost:5000/api/v1/user/google/register",
//       { name, email, username, avatar },
//       { withCredentials: true }
//     );

//     console.log("Google register success", response.data);

//      toast.success(response.data.message || "Google Registered Successfully!");

//     setTimeout(() => {
//       navigate('/');
//     }, 1200); 



//   } catch (error) {
//     console.error("Google Register Error:", error);

//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error("Google Register Failed!");
//     }
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative">
     
//       {/* <h1 className="absolute top-4 left-4 text-4xl font-extrabold
//            text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-white to-purple-500 select-none pointer-events-none shine">
//         ChatFlow
//       </h1> */}

//       {/* <h1
//           className="chatflow-title"
//           style={{
//             fontSize: "24px",
//             fontWeight: "800",
//             textTransform: "uppercase",
//             textAlign: "left",
//             background: "linear-gradient(to right, #06b6d4, #ffffff, #a78bfa)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             userSelect: "none",
//           }}
//         >
//           ChatFlow
//         </h1> */}

//         <h1
//   className="
//     absolute top-3 left-4
//     text-3xl font-extrabold uppercase 
//     bg-gradient-to-r from-cyan-400 via-white to-purple-400
//     text-transparent bg-clip-text
//     select-none"
// >
//   ChatFlow
// </h1>


//       <style>
//         {`
//           .shine { background-size: 200%; animation: shineMove 3s linear infinite; }
//           @keyframes shineMove {
//             0% { background-position: 200% center; }
//             100% { background-position: -200% center; }
//           }
//         `}
//       </style>

//       <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 relative z-10">

//         <div className="flex justify-center mb-3 relative w-24 mx-auto">
//           {avatarPreview ? (
//             <img
//               src={avatarPreview}
//               alt="profile"
//               className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow-md"
//             />
//           ) : (
//             <FaUser className="text-cyan-400 text-7xl drop-shadow-md" />
//           )}

//           <label
//             htmlFor="image-upload"
//             className="absolute bottom-0 right-0 bg-cyan-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-cyan-600 transition"
//           >
//             <AiFillEdit className="text-white text-sm" />
//           </label>

//           <input
//             id="image-upload"
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => handleImageChange(e, setAvatar, setAvatarPreview)}
//           />
//         </div>

//         <h1 className="text-2xl font-bold text-center text-cyan-400 drop-shadow-md mb-3">
//           Register
//         </h1>

//         <form onSubmit={handleRegister} className="flex flex-col gap-2">
//           <input
//             type="text"
//             value={name}
//             placeholder="Name"
//             onChange={(e) => setName(e.target.value)}
//             className="
//     w-full p-[10px_16px] rounded-full bg-[#1f2937]
//     text-[#f9fafb] text-[14px] outline-none border border-transparent
//     shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300             
//     focus:bg-[#374151] focus:border-blue-500
//   "
//           />
//           <input
//             type="email"
//             value={email}
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//            className="
//     w-full p-[10px_16px] rounded-full bg-[#1f2937]
//     text-[#f9fafb] text-[14px] outline-none border border-transparent
//     shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300             
//     focus:bg-[#374151] focus:border-blue-500
//   "
//           />
//           <input
//             type="text"
//             value={username}
//             placeholder="Username"
//             onChange={(e) => setUsername(e.target.value)}
//            className="
//     w-full p-[10px_16px] rounded-full bg-[#1f2937]
//     text-[#f9fafb] text-[14px] outline-none border border-transparent
//     shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300             
//     focus:bg-[#374151] focus:border-blue-500
//   "
//           />
//           <input
//             type="password"
//             value={password}
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//           className="
//     w-full p-[10px_16px] rounded-full bg-[#1f2937]
//     text-[#f9fafb] text-[14px] outline-none border border-transparent
//     shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition duration-300             
//     focus:bg-[#374151] focus:border-blue-500
//   "
//           />

//           <button
//             type="submit"
//             className="px-4 py-2 rounded-full bg-cyan-600 text-white font-semibold shadow-md hover:bg-cyan-500 hover:scale-105 transition duration-300"
//           >
//             Register
//           </button>

//           <button
//             type="button"
//             onClick={handleGoogleRegister}
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-full 
//                    bg-white/10 border border-cyan-400/40 text-white 
//                    font-semibold shadow-md backdrop-blur-lg 
//                    hover:bg-cyan-500 hover:text-white hover:scale-105 transition-all duration-300"
//           >
//             <FcGoogle className="w-5 h-5" />
//             Register with Google
//           </button>
//         </form>

//         <p className="text-gray-300 text-center mt-3 text-sm">
//           Already have an account?
//           <span
//             className="text-cyan-400 cursor-pointer hover:underline"
//             onClick={() => navigate("/login")}
//           >
//             {" "}Login
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Register;





// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { AiFillEdit } from "react-icons/ai";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../firebase";
// import {logo} from '../assets/TalkNet2.png'
// import  toast  from "react-toastify";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatarPreview(reader.result);
//       setAvatar(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("username", username);
//     formData.append("password", password);
//     formData.append("avatar", avatar);

//     await axios.post(
//       "http://localhost:5000/api/v1/user/register",
//       formData,
//       { withCredentials: true }
//     );

//     toast.success("Registered Successfully 🎉");
//     navigate("/");
//   };

//   const handleGoogleRegister = async () => {
//     const result = await signInWithPopup(auth, provider);

//     const name = result.user.displayName;
//     const email = result.user.email;
//     const username = email.split("@")[0];
//     const avatar = result.user.photoURL;

//     await axios.post(
//       "http://localhost:5000/api/v1/user/google/register",
//       { name, email, username, avatar },
//       { withCredentials: true }
//     );

//     toast.success("Google Register Success 🎉");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

//       {/* BRAND */}
//      <div className="">
//         <img src={logo} alt="TalkNet2" />
//      </div>

//       {/* SMALLER CARD */}
//       <div className="w-full max-w-xs bg-white/80 backdrop-blur-xl border border-slate-200 shadow-md rounded-xl p-4">

//         {/* AVATAR (smaller) */}
//         <div className="flex justify-center mb-3 relative">
//           {avatarPreview ? (
//             <img
//               src={avatarPreview}
//               className="h-16 w-16 rounded-full object-cover border border-slate-200"
//             />
//           ) : (
//             <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200">
//               <FaUser className="text-slate-500 text-xl" />
//             </div>
//           )}

//           <label className="absolute bottom-0 right-[35%] bg-slate-900 text-white p-1 rounded-full cursor-pointer">
//             <AiFillEdit className="text-[10px]" />
//             <input type="file" hidden onChange={handleImageChange} />
//           </label>
//         </div>

//         {/* TITLE */}
//         <h2 className="text-center text-lg font-semibold text-slate-900 mb-3">
//           Create Account
//         </h2>

//         {/* FORM (compact spacing) */}
//         <form className="flex flex-col gap-2">

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-300 outline-none"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-300 outline-none"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-300 outline-none"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <input
//             type="password"
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-300 outline-none"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* BUTTONS */}
//           {/* <button
//             onClick={handleRegister}
//             type="submit"
//             className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm hover:bg-slate-800 transition"
//           >
//             Register
//           </button> */}
// <button
//   onClick={handleRegister}
//   type="submit"
//   className="
//     w-full py-2 rounded-lg text-sm font-semibold text-white
//     bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500
//     hover:opacity-90 transition
//   "
// >
//   Register
// </button>

//           <button
//             type="button"
//             onClick={handleGoogleRegister}
//             className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition"
//           >
//             <FcGoogle />
//             Google
//           </button>
//         </form>

//         {/* LOGIN */}
//         <p className="text-center text-xs text-slate-500 mt-3">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-slate-900 font-medium cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;





// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { AiFillEdit } from "react-icons/ai";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../firebase";
// import { toast } from "react-toastify";
// import logo from "../assets/TalkNet2.png";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatarPreview(reader.result);
//       setAvatar(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("username", username);
//     formData.append("password", password);
//     formData.append("avatar", avatar);

//     await axios.post(
//       "http://localhost:5000/api/v1/user/register",
//       formData,
//       { withCredentials: true }
//     );

//     toast.success("Registered Successfully 🎉");
//     navigate("/");
//   };

//   const handleGoogleRegister = async () => {
//     const result = await signInWithPopup(auth, provider);

//     const name = result.user.displayName;
//     const email = result.user.email;
//     const username = email.split("@")[0];
//     const avatar = result.user.photoURL;

//     await axios.post(
//       "http://localhost:5000/api/v1/user/google/register",
//       { name, email, username, avatar },
//       { withCredentials: true }
//     );

//     toast.success("Google Register Success 🎉");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

//       {/* LEFT LOGO (like navbar style) */}
//       <div className="hidden md:block absolute top-4 left-6">
//         <img src={logo} alt="TalkNet" className="h-18 w-8 object-contain" />
//       </div>

//       {/* CARD */}
//       <div className="w-full max-w-xs bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg rounded-xl p-4">

//         {/* AVATAR */}
//         <div className="flex justify-center mb-3 relative">
//           {avatarPreview ? (
//             <img
//               src={avatarPreview}
//               className="h-16 w-16 rounded-full object-cover border border-slate-200"
//             />
//           ) : (
//             <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200">
//               <FaUser className="text-slate-500 text-xl" />
//             </div>
//           )}

//           <label className="absolute bottom-0 right-[35%] bg-slate-900 text-white p-1 rounded-full cursor-pointer">
//             <AiFillEdit className="text-[10px]" />
//             <input type="file" hidden onChange={handleImageChange} />
//           </label>
//         </div>

//         {/* TITLE (same navbar gradient style) */}
//         <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
//           Create Account
//         </h2>

//         {/* FORM */}
//         <form className="flex flex-col gap-2">

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <input
//             type="password"
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* BUTTON */}
//           <button
//             onClick={handleRegister}
//             type="submit"
//             className="
//               w-full py-2 rounded-lg text-sm font-semibold text-white
//               bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
//               hover:opacity-90 transition
//             "
//           >
//             Register
//           </button>

//           {/* GOOGLE */}
//           <button
//             type="button"
//             onClick={handleGoogleRegister}
//             className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition"
//           >
//             <FcGoogle />
//             Google
//           </button>
//         </form>

//         {/* LOGIN */}
//         <p className="text-center text-xs text-slate-500 mt-3">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-slate-900 font-medium cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;





import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiFillEdit } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import logo from "../assets/TalkNet2.png";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);

    await axios.post(
      "http://localhost:5000/api/v1/user/register",
      formData,
      { withCredentials: true }
    );

    toast.success("Registered Successfully 🎉");
    navigate("/");
  };

  const handleGoogleRegister = async () => {
    const result = await signInWithPopup(auth, provider);

    const name = result.user.displayName;
    const email = result.user.email;
    const username = email.split("@")[0];
    const avatar = result.user.photoURL;

    await axios.post(
      "http://localhost:5000/api/v1/user/google/register",
      { name, email, username, avatar },
      { withCredentials: true }
    );

    toast.success("Google Register Success 🎉");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      {/* ✅ FIXED LOGO (MOBILE + DESKTOP PERFECT) */}
      <div className="absolute top-3 left-3 md:top-4 md:left-6 flex items-center">
        {/* <img
          src={logo}
          alt="TalkNet"
          className="
            h-7 w-7 
            sm:h-8 sm:w-8 
            md:h-10 md:w-10 
            object-contain
          "
        /> */}
        <img
  src={logo}
  alt="TalkNet"
  className="
    h-8 w-8        /* mobile default */
    sm:h-9 sm:w-9  /* small screens */
    md:h-10 md:w-10 /* desktop */
    object-contain
  "
/>
      </div>

      {/* CARD */}
      <div className="w-full max-w-xs bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg rounded-xl p-4">

        {/* AVATAR */}
        <div className="flex justify-center mb-3 relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="h-16 w-16 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200">
              <FaUser className="text-slate-500 text-xl" />
            </div>
          )}

          <label className="absolute bottom-0 right-[35%] bg-slate-900 text-white p-1 rounded-full cursor-pointer">
            <AiFillEdit className="text-[10px]" />
            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Create Account
        </h2>

        {/* FORM */}
        <form className="flex flex-col gap-2">

          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* REGISTER BUTTON */}
          {/* <button
            onClick={handleRegister}
            type="submit"
            className="
              w-full py-2 rounded-lg text-sm font-semibold text-white
              bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600
              hover:opacity-90 transition
            "
          >
            Register
          </button> */}


<button
  onClick={handleRegister}
  type="submit"
  className="w-full py-2 cursor-pointer rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 hover:opacity-90 transition"
>
  Register
</button>


          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full cursor-pointer flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition"
          >
            <FcGoogle />
            Google
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-xs text-slate-500 mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-slate-900 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;