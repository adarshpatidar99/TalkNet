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



