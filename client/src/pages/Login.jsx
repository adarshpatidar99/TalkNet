// React
import React, { useState } from "react";

// Libraries
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

// Redux
import { setUser } from "../features/user/userSlice";

// Icons
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";

// Assets
import logo from "../assets/TalkNet2.png";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/user/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );

      dispatch(setUser(data.user));

      setEmail("");
      setPassword("");

      toast.success("Login Successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(auth, provider);

      const name = result.user.displayName;
      const email = result.user.email;
      const avatar = result.user.photoURL;

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/google/login`,
        { name, email, avatar },
        { withCredentials: true }
      );

      dispatch(setUser(data.user));

      toast.success("Google Login Success 🎉");
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      toast.error(
        error.response?.data?.message ||
        "Google Login Failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-10">
        <img
          src={logo}
          alt="TalkNet"
          className="
            w-11 h-11
            sm:w-12 sm:h-12
            md:w-14 md:h-14
            object-contain
            select-none
            drop-shadow-md
          "
          draggable={false}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg rounded-xl p-4">

        <div className="flex justify-center mb-3">
          <FaUser className="text-slate-700 text-3xl" />
        </div>

        <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Welcome Back
        </h2>

        {/* Login Form */}
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />

          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full cursor-pointer flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FcGoogle />
            {googleLoading ? "Please wait..." : "Google"}
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