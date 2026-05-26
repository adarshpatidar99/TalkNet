
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/v1/user/me", {
//           withCredentials: true,
//         });
//         setCurrentUser(res.data.user);
//       } catch (err) {
//         if (err.response?.status === 401) navigate("/login");
//         else console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCurrentUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:5000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       // 🔥 Toast instead of alert
//       toast.success("Logged out successfully!", { position: "top-center" });

//       setTimeout(() => {
//         navigate("/login");
//       }, 1200);
//     } catch (err) {
//       console.error(err);
//       toast.error("Logout failed, try again!", { position: "top-center" });
//     }
//   };

//   return (
//     <>
//       {/* Toast container */}
//       <ToastContainer />

//       <nav
//         style={{
//           width: "100%",
//           background: "linear-gradient(to right, #000000, #1f2937, #374151)",
//           color: "#e5e7eb",
//           padding: "10px 16px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           position: "sticky",
//           top: 0,
//           zIndex: 50,
//           fontFamily: "'Poppins', sans-serif",
//           backdropFilter: "blur(8px)",
//           borderBottom: "1px solid rgba(255,255,255,0.1)",
//           flexWrap: "wrap",
//         }}
//       >
//         <h1
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
//         </h1>

//         <style>
//           {`
//           @media (max-width: 768px) {
//             .chatflow-title { font-size: 20px; margin-bottom: 6px; }
//             .user-info { font-size: 12px; padding: 4px 8px; }
//             .logout-btn { font-size: 12px; padding: 4px 10px; }
//           }
//         `}
//         </style>

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             className="user-info"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               backgroundColor: "rgba(255,255,255,0.08)",
//               padding: "5px 10px",
//               borderRadius: "16px",
//               fontWeight: 500,
//               fontSize: "14px",
//               backdropFilter: "blur(6px)",
//               transition: "all 0.2s",
//             }}
//           >
//             <img
//               src={
//                 currentUser?.avatar?.url ||
//                 "https://www.w3schools.com/w3images/avatar2.png"
//               }
//               alt={currentUser?.name || "Guest"}
//               style={{
//                 width: "28px",
//                 height: "28px",
//                 borderRadius: "50%",
//                 border: "2px solid #3b82f6",
//                 objectFit: "cover",
//               }}
//             />
//             <span>{loading ? "Loading..." : currentUser?.name || "Guest"}</span>
//           </div>

//           {/* <button
//             className="logout-btn"
//             onClick={handleLogout}
//             style={{
//               background: "linear-gradient(to right, #ef4444, #b91c1c)",
//               padding: "5px 12px",
//               borderRadius: "10px",
//               color: "#fff",
//               border: "none",
//               fontWeight: 600,
//               cursor: "pointer",
//               fontSize: "13px",
//               transition: "all 0.3s",
//             }}
//             onMouseOver={(e) =>
//               (e.target.style.background =
//                 "linear-gradient(to right, #b91c1c, #7f1d1d)")
//             }
//             onMouseOut={(e) =>
//               (e.target.style.background =
//                 "linear-gradient(to right, #ef4444, #b91c1c)")
//             }
//           >
//             Logout
//           </button> */}
          
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // Install icon library if not already installed:
// // npm install lucide-react
// import { MdOutlineLogout } from "react-icons/md";





// const Navbar = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/v1/user/me",
//           {
//             withCredentials: true,
//           }
//         );

//         setCurrentUser(res.data.user);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           navigate("/login");
//         } else {
//           console.error(err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:5000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       toast.success("Logged out successfully!", {
//         position: "top-center",
//       });

//       setTimeout(() => {
//         navigate("/login");
//       }, 1200);
//     } catch (err) {
//       console.error(err);

//       toast.error("Logout failed, try again!", {
//         position: "top-center",
//       });
//     }
//   };

//   return (
//     <>
//       <ToastContainer />

//       {/* Minimal Glass Navbar */}
//       <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
//         <div className="flex items-center justify-between px-4 md:px-6 py-1">
//           {/* Left Section: Logo + App Name */}
//           <div className="flex items-center gap-2 min-w-0">
//             {/* Logo Placeholder */}
//             <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold shadow-sm shrink-0">
//               {/* Replace with your logo image later */}
//               {/* <img src="/logo.png" alt="TalkNet Logo" className="h-6 w-6" /> */}
//               TN
//             </div>

//             {/* App Name */}
//             <div className="min-w-0">
//               <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
//                 TalkNet
//               </h1>
            
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-3">
//             {/* User Badge */}
//             <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white  shadow-sm">
//               <img
//                 src={
//                   currentUser?.avatar?.url ||
//                   "https://www.w3schools.com/w3images/avatar2.png"
//                 }
//                 alt={currentUser?.name || "Guest"}
//                 className="h-8 w-8 rounded-full object-cover"
//               />

//               {/* Hidden on smaller screens */}
//               <span className="hidden sm:block max-w-28 truncate text-sm font-medium text-slate-700">
//                 {loading ? "Loading..." : currentUser?.name || "Guest"}
//               </span>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="hidden sm:inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
//             >
//               <MdOutlineLogout />
//             </button>

            

//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdOutlineLogout } from "react-icons/md";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/v1/user/me",
//           {
//             withCredentials: true,
//           }
//         );

//         setCurrentUser(res.data.user);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           navigate("/login");
//         } else {
//           console.error(err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:5000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       toast.success("Logged out successfully!", {
//         position: "top-center",
//       });

//       setTimeout(() => {
//         navigate("/login");
//       }, 1200);
//     } catch (err) {
//       console.error(err);

//       toast.error("Logout failed, try again!", {
//         position: "top-center",
//       });
//     }
//   };

//   return (
//     <>
//       <ToastContainer />

//       {/* Minimal Glass Navbar */}
//       <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
//         <div className="flex items-center justify-between px-4 md:px-6 py-1">
//           {/* Left Section: Logo + App Name */}
//           <div className="flex items-center gap-2 min-w-0">
//             {/* Logo Placeholder */}
//             <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold shadow-sm shrink-0">
//               {/* Replace with your actual logo */}
//               <img src="/TalkNet.png" alt="Logo" className="h-6 w-6" />
              
//             </div>

//             {/* App Name (always visible on mobile and desktop) */}
//             <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
//               TalkNet
//             </h1>
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-3 md:gap-3">
//             {/* User Badge */}
//             <div className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white shadow-sm px-0.5 py-0.5 md:px-1.5">
//               <img
//                 src={
//                   currentUser?.avatar?.url ||
//                   "https://www.w3schools.com/w3images/avatar2.png"
//                 }
//                 alt={currentUser?.name || "Guest"}
//                 className="h-8 w-8 rounded-full object-cover"
//               />

//               {/* Show username only on desktop/tablet */}
//               <span className="hidden md:block max-w-28 truncate text-sm font-medium text-slate-700">
//                 {loading ? "Loading..." : currentUser?.name || "Guest"}
//               </span>
//             </div>

//             {/* Logout Button/Icon
//                 Mobile: icon only
//                 Desktop: icon + text
//             */}
//             <button
//               onClick={handleLogout}
//               className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 md:px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
//               aria-label="Logout"
//             >
//               <MdOutlineLogout className="text-lg" />

//               {/* Show text only on desktop/tablet */}
//               {/* <span className="hidden md:inline">Logout</span> */}
//             </button>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdOutlineLogout } from "react-icons/md";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/v1/user/me", {
//           withCredentials: true,
//         });
//         setCurrentUser(res.data.user);
//       } catch (err) {
//         if (err.response?.status === 401) navigate("/login");
//         else console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:5000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       toast.success("Logged out successfully!", {
//         position: "top-center",
//       });

//       setTimeout(() => navigate("/login"), 1000);
//     } catch (err) {
//       console.error(err);
//       toast.error("Logout failed!", { position: "top-center" });
//     }
//   };

//   return (
//     <>
//       <ToastContainer />

//       {/* NAVBAR */}
//       <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
//         <div className="flex items-center justify-between px-3 md:px-6 py-2">

//           {/* LEFT: LOGO + NAME */}
//           <div className="flex items-center gap-2">

//             {/* LOGO (FIXED ISSUE HERE) */}
//             <div className="flex items-center justify-center">
//               <div className="flex items-center justify-center">
//   <img
//     src="src/assets/TalkNet2.png"
//     alt="TalkNet"
//     className="h-12 w-12 md:h-14 md:w-14 object-contain"
//   />
// </div>

//               {/* fallback if image fails */}
//               {/* <span className="hidden text-sm font-bold text-slate-800">
//                 TN
//               </span> */}
//             </div>

//             {/* APP NAME */}
//             <h1 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
//               TalkNet
//             </h1>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center gap-2 md:gap-3">

//             {/* USER */}
//             <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200 bg-white/60">
//               <img
//                 src={
//                   currentUser?.avatar?.url ||
//                   "https://www.w3schools.com/w3images/avatar2.png"
//                 }
//                 className="h-8 w-8 rounded-full object-cover"
//               />

//               <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
//                 {loading ? "..." : currentUser?.name || "Guest"}
//               </span>
//             </div>

//             {/* LOGOUT */}
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100 transition"
//             >
//               <MdOutlineLogout className="text-lg" />
//               <span className="hidden md:inline text-sm">Logout</span>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdOutlineLogout } from "react-icons/md";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/v1/user/me", {
//           withCredentials: true,
//         });
//         setCurrentUser(res.data.user);
//       } catch (err) {
//         if (err.response?.status === 401) navigate("/login");
//         else console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:5000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       toast.success("Logged out successfully!", {
//         position: "top-center",
//       });

//       setTimeout(() => navigate("/login"), 1000);
//     } catch (err) {
//       console.error(err);
//       toast.error("Logout failed!", { position: "top-center" });
//     }
//   };

//   return (
//     <>
//       <ToastContainer />

//       {/* NAVBAR */}
//       <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
//         <div className="flex items-center justify-between px-3 md:px-6 py-1.5">

//           {/* LEFT SIDE */}
//           <div className="flex items-center gap-2">

//             {/* LOGO */}
//             <img
//               src="src/assets/TalkNet2.png"
//               alt="TalkNet"
//               className="h-8 w-8 md:h-9 md:w-9 object-contain"
//             />

//             {/* NAME */}
//             <h1 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
//               TalkNet
//             </h1>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center gap-2 md:gap-3">

//             {/* USER */}
//             <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200 bg-white/60">

//               <img
//                 src={
//                   currentUser?.avatar?.url ||
//                   "https://www.w3schools.com/w3images/avatar2.png"
//                 }
//                 className="h-7 w-7 rounded-full object-cover"
//               />

//               <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
//                 {loading ? "..." : currentUser?.name || "Guest"}
//               </span>
//             </div>

//             {/* LOGOUT */}
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 transition"
//             >
//               <MdOutlineLogout className="text-base" />
//               <span className="hidden md:inline text-sm">Logout</span>
//             </button>

//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineLogout } from "react-icons/md";

// ✅ IMPORTANT: correct way to import local image
import logo from "../../assets/TalkNet2.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/me", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
        else console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });

      toast.success("Logged out successfully!", {
        position: "top-center",
      });

      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      toast.error("Logout failed!", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer />

      {/* NAVBAR (SMALL HEIGHT) */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between px-3 md:px-6 h-11">

          {/* LEFT SIDE */}
          <div className="flex items-center ">

            {/* LOGO BOX (NO WHITE BACKGROUND ISSUE) */}
            <div className="flex items-center justify-center h-8 w-10">
              <img
                src={logo}
                alt="TalkNet2"
                className="h-12 w-10 "
              />
            </div>

            {/* NAME */}
            {/* <h1 className="text-base md:text-lg font-semibold text-slate-700">
              TalkNet
            </h1> */}
            <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
  TalkNet
</h1>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* USER */}
            {/* <div className="flex items-center gap-1 px-0.5 py-0.5 rounded-full border border-slate-300 bg-white/60">
              <img
                src={
                  currentUser?.avatar?.url ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                className="h-7 w-7 rounded-full  object-cover"
              />

              <span className="hidden md:block text-sm text-slate-700">
                {loading ? "..." : currentUser?.name || "Guest"}
              </span>
            </div> */}
            <div className="flex items-center gap-1 px-0.5 py-0.5 rounded-full border border-slate-300 bg-white/60">

  <img onClick={() => navigate('/profile')}
    src={currentUser?.avatar?.url || "https://www.w3schools.com/w3images/avatar2.png"}
    className="h-7 w-7 cursor-pointer rounded-full object-cover"
  />

  <span className="hidden md:flex md:px-3 md:py-1 md:rounded-full md:bg-white/70 md:backdrop-blur-md md:border md:border-slate-200 md:text-sm md:text-slate-700 md:shadow-sm">
    {loading ? "..." : currentUser?.name || "Guest"}
  </span>

</div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 cursor-pointer px-2 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-100 transition"
            >
              <MdOutlineLogout />
              {/* <span className="hidden md:inline text-sm">Logout</span> */}
            </button>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;