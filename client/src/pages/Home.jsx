// import React from 'react';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';

// const Home = () => {
//   return (
//     <div
//       style={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#f1f5f9',
//       }}
//     >
//       {/* Navbar on top */}
//       <div style={{ flexShrink: 0 }}>
//         <Navbar />                                                   
//       </div>

//       {/* Main chat area: Sidebar + ChatBox */}
//       <div
//         style={{
//           display: 'flex',
//           flex: 1,
//           overflow: 'hidden',
//         }}
//       >
//         <Sidebar />
//       </div>
//     </div>
//   );
// };

// export default Home;












import React from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/chat/Sidebar";

const Home = () => {
  return (
    <div className="h-screen md:h-dvh flex flex-col  overflow-hidden">
    
      <header className="shrink-0">
        <Navbar />
      </header>

      <main className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar />
      </main>
    </div>
  );
};

export default Home;