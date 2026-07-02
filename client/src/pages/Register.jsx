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
import { AiFillEdit } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";

// Assets
import logo from "../assets/TalkNet2.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

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

    if (!name ||!email ||!username ||!password) {
      return toast.error("Please fill all fields");
    }

    if (!EMAIL_REGEX.test(email)) {
      return toast.error("Invalid email");
    }

    if (password.length < 6) {
      return toast.error(
        "Password should be at least 6 characters"
      );
    }

    if (password!== confirmPassword) {
      return toast.error(
        "Passwords do not match"
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(data.user));

      toast.success(
        "Registered Successfully 🎉"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(
        auth,
        provider
      );

      const name = result.user.displayName;

      const email = result.user.email;

      const username =
        email.split("@")[0];

      const avatar =
        result.user.photoURL;

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/google/register`,
        {
          name,
          email,
          username,
          avatar,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(data.user));

      toast.success(
        "Google Register Success 🎉"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Google Registration Failed"
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

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg rounded-xl p-4">
        <div className="flex justify-center mb-3 relative">
          {avatarPreview? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="h-16 w-16 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200">
              <FaUser className="text-slate-500 text-xl" />
            </div>
          )}

          <label className="absolute bottom-0 right-[35%] bg-slate-900 text-white p-1 rounded-full cursor-pointer">
            <AiFillEdit className="text-[10px]" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Create Account
        </h2>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-2"
        >
          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            required
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            required
            type="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Username"
            value={username}
            required
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Password"
            value={password}
            required
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            required
            type="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
             ? "Creating Account..."
              : "Register"}
          </button>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm bg-white hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FcGoogle />

            {googleLoading
             ? "Please wait..."
              : "Google"}
          </button>
        </form>

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