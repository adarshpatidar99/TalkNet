// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from '../firebase';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
                             
//     try {
//       const { data } = await axios.post(
//         "http://localhost:5000/api/v1/user/login",
//         { email, password },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       setEmail("");
//       setPassword("");

//       toast.success("Login Successful!");
//       navigate("/");
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(
//         error.response?.data?.message || "Login failed"
//       );
//     }
//     setLoading(false);
//   };


//   const handleGoogleLogin = async() => {
   
//        try {
//           const result = await signInWithPopup(auth, provider);
      
//           const name = result.user.displayName;
//           const email = result.user.email;
//           const avatar = result.user.photoURL
      
//           const response = await axios.post(
//             "http://localhost:5000/api/v1/user/google/login",
//             { name, email, avatar },
//             { withCredentials: true }
//           );
      
//           console.log("Google login success", response.data);
      
//            toast.success(response.data.message || "Google login Successfully!");
      
//           setTimeout(() => {
//             navigate('/');
//           }, 1200); 
      
      
      
//         } catch (error) {
//           console.error("Google login Error:", error);
      
//           if (error.response?.data?.message) {
//             toast.error(error.response.data.message);
//           } else {
//             toast.error("Google login Failed!");
//           }
//         }
        
//   };


//   return (
//     <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">

//       <ToastContainer position="top-center" theme="dark" />

//       {/* <h1
//         className="absolute top-4 left-4 text-3xl sm:text-4xl font-extrabold
//              text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-white to-purple-500
//              select-none pointer-events-none shine"
//       >
//         ChatFlow
//       </h1> */}

//        <h1
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
//           .shine {
//             background-size: 200%;
//             animation: shineMove 3s linear infinite;
//           }
//           @keyframes shineMove {
//             0% { background-position: 200% center; }
//             100% { background-position: -200% center; }
//           }
//         `}
//       </style>

//       <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 relative z-10">
        
//         <div className="flex justify-center mb-4">
//           <FaUser className="text-cyan-400 text-4xl drop-shadow-md" />
//         </div>

//         <h1 className="text-4xl font-extrabold text-center text-cyan-400 drop-shadow-md mb-6">
//           Login
//         </h1>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
//           <input
//             type="email"
//             value={email}
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//           className="
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
//            className="
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
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-full
//              bg-white/10 border border-cyan-400/40 text-white 
//              font-semibold tracking-wide shadow-md backdrop-blur-lg 
//              hover:bg-cyan-500 hover:text-white hover:scale-105 transition-all duration-300"
//           >
//             <FcGoogle className="w-5 h-5" />
//             Login with Google
//           </button>

//         </form>

//         <p className="text-gray-300 text-center mt-5 text-sm">
//           Don’t have an account?{" "}
//           <span
//             className="text-cyan-400 cursor-pointer hover:underline"
//             onClick={() => navigate("/register")}
//           >
//             Register
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import logo from "../assets/TalkNet2.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password },
        { withCredentials: true }
      );

      setEmail("");
      setPassword("");

      toast.success("Login Successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const name = result.user.displayName;
      const email = result.user.email;
      const avatar = result.user.photoURL;

      await axios.post(
        "http://localhost:5000/api/v1/user/google/login",
        { name, email, avatar },
        { withCredentials: true }
      );

      toast.success("Google Login Success 🎉");
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      <ToastContainer />

      {/* LOGO TOP (same as register) */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <img src={logo} alt="TalkNet" className="h-9 w-9 object-contain" />
        {/* <h1 className="text-base font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TalkNet
        </h1> */}
      </div>

      {/* CARD */}
      <div className="w-full max-w-xs bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg rounded-xl p-4">

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <FaUser className="text-slate-700 text-3xl" />
        </div>

        {/* TITLE (same gradient as register) */}
        <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Welcome Back
        </h2>

        {/* FORM */}
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />

          {/* LOGIN BUTTON (same style as register button) */}
          <button
            type="submit"
             className="w-full py-2 cursor-pointer rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* GOOGLE BUTTON (same style as register google) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full cursor-pointer flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition"
          >
            <FcGoogle />
            Google
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-xs text-slate-500 mt-3">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-slate-900 font-medium cursor-pointer"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;