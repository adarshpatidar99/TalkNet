import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (                    
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={ <Profile/> } />
        </Routes>
      </Router>

      <ToastContainer 
        position="top-right"
       
        pauseOnHover={true}
        theme="light"
      />
    </>
  );
};

export default App;
