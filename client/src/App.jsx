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
import UserProfile from "./pages/UserProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser } from "./features/user/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route
            path="/create-group-details"
            element={<CreateGroupDetails />}
          />
          <Route path="/group/:chatId" element={<GroupDetails />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
