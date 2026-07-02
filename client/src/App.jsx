import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateGroup from "./pages/CreateGroup"   
import CreateGroupDetails from "./pages/CreateGroupDetails";         
import GroupDetails from "./pages/GroupDetails";
import { useEffect } from "react";         
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/user/userSlice"; 
   

const App = () => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [])

  return (                    
    <>   
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={ <Profile/> } />    
          <Route path="/create-group" element= 
          { <CreateGroup  /> } />   
          <Route path="/create-group-details" element={ <CreateGroupDetails /> } />
          <Route path="/group/:chatId" element={<GroupDetails />} />
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
