import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateGroup from "./pages/CreateGroup";
import CreateGroupDetails from "./pages/CreateGroupDetails";
import GroupDetails from "./pages/GroupDetails";

import { getCurrentUser } from "./features/user/userSlice";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/create-group-details" element={<CreateGroupDetails />} />
        <Route path="/group/:chatId" element={<GroupDetails />} />
        <Route path="/user-profile/:id" element={ <UserProfile/> } />
      </Routes>

      <ToastContainer
        position="top-right"
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;