import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth, provider } from "../firebase";
import { setUser } from "../features/user/userSlice";

import { AiFillEdit } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineAtSymbol,
} from "react-icons/hi";

import logo from "../assets/TalkNet2.png";
import Spinner from "../components/Spinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };

    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password ||
      !confirmPassword
    ) {
      return toast.error("Please fill all fields");
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return toast.error("Invalid email address");
    }

    if (!USERNAME_REGEX.test(username.trim())) {
      return toast.error(
        "Username must be 3–20 characters using letters, numbers, or underscores"
      );
    }

    if (password.length < 6) {
      return toast.error("Password should be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("username", username.trim().toLowerCase());
      formData.append("password", password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/register`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUser(data.user));

      toast.success("Registered successfully 🎉");
      navigate("/");
    } catch (error) {
      console.error("[Registration] Backend error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });

      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

const handleGoogleRegister = async () => {
  if (!username.trim()) {
    return toast.error("Please enter a username");
  }

  if (!USERNAME_REGEX.test(username.trim())) {
    return toast.error(
      "Username must be 3-20 characters using letters, numbers, or underscores"
    );
  }

  if (!API_URL) {
    return toast.error("API URL is not configured");
  }

  try {
    setGoogleLoading(true);

    // Authenticate using Google Firebase popup.
    const result = await signInWithPopup(auth, provider);

    // Get Firebase ID token.
    const idToken = await result.user.getIdToken();

    // Send verified token and username to backend.
    const { data } = await axios.post(
      `${API_URL}/api/v1/user/google/register`,
      {
        idToken,
        username: username.trim().toLowerCase(),
      },
      { withCredentials: true }
    );

    dispatch(setUser(data.user));

    toast.success("Google registration successful 🎉");
    navigate("/");
  } catch (error) {
    console.error("[Google registration]", error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Google registration failed"
    );
  } finally {
    setGoogleLoading(false);
  }
};

  const resetPhoneOtp = () => {
    const verifier = window.registerRecaptchaVerifier;

    if (verifier) {
      try {
        verifier.clear();
      } catch (error) {
        console.warn("[Phone registration] Could not clear reCAPTCHA:", error);
      }

      window.registerRecaptchaVerifier = null;
    }

    setConfirmationResult(null);
    setOtp("");
  };

  const handleSendPhoneOtp = async () => {
    if (!name.trim() || !email.trim() || !username.trim()) {
      return toast.error(
        "Enter your name, email, and username first"
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return toast.error("Enter a valid email address");
    }

    if (!USERNAME_REGEX.test(username.trim())) {
      return toast.error(
        "Username must be 3–20 characters using letters, numbers, or underscores"
      );
    }

    const digits = phoneNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(digits)) {
      return toast.error(
        "Enter a valid 10-digit Indian mobile number"
      );
    }

    if (!API_URL) {
      return toast.error(
        "API URL is not configured. Check your frontend environment variables."
      );
    }

    try {
      setSendingOtp(true);

      console.info("[Phone registration] Starting OTP request:", {
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        phoneNumber: `+91${digits.replace(/\d(?=\d{4})/g, "*")}`,
      });

      // Clear any previous reCAPTCHA instance.
      resetPhoneOtp();

      const formattedPhone = `+91${digits}`;

      // Create visible reCAPTCHA verifier.
      const verifier = new RecaptchaVerifier(
        auth,
        "register-recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.info(
              "[Phone registration] reCAPTCHA verification completed"
            );
          },
          "expired-callback": () => {
            console.warn("[Phone registration] reCAPTCHA expired");
            toast.error("reCAPTCHA expired. Please verify again.");
          },
        }
      );

      window.registerRecaptchaVerifier = verifier;

      await verifier.render();

      console.info(
        "[Phone registration] reCAPTCHA rendered; requesting Firebase OTP"
      );

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        verifier
      );

      setConfirmationResult(result);

      console.info("[Phone registration] OTP request succeeded", {
        projectId: auth.app.options.projectId,
      });

      toast.success(`OTP sent to +91${digits}`);
    } catch (error) {
      logFirebaseError("Send phone OTP", error);

      resetPhoneOtp();

      if (error.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number");
      } else if (error.code === "auth/too-many-requests") {
        toast.error(
          "Too many attempts. Please try again later."
        );
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error(
          "Firebase returned auth/operation-not-allowed. Verify the Phone provider and the Firebase project shown in the browser console."
        );
      } else if (error.code === "auth/captcha-check-failed") {
        toast.error(
          "reCAPTCHA verification failed. Please try again."
        );
      } else if (error.code === "auth/invalid-app-credential") {
        toast.error(
          "Firebase could not verify this app. Check authorized domains and reCAPTCHA configuration."
        );
      } else {
        toast.error(error.message || "Could not send OTP");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!confirmationResult) {
      return toast.error("Please request an OTP first");
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      return toast.error("Enter the 6-digit OTP");
    }

    if (!API_URL) {
      return toast.error(
        "API URL is not configured. Check your frontend environment variables."
      );
    }

    try {
      setVerifyingOtp(true);

      console.info("[Phone registration] Verifying OTP", {
        projectId: auth.app.options.projectId,
      });

      const result = await confirmationResult.confirm(otp.trim());

      console.info("[Phone registration] OTP verified successfully");

      const idToken = await result.user.getIdToken();

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/phone/register`,
        {
          idToken,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
        },
        { withCredentials: true }
      );

      dispatch(setUser(data.user));

      toast.success("Phone registration successful 🎉");
      navigate("/");
    } catch (error) {
  const status = error.response?.status;
  const responseData = error.response?.data;

  console.error("[Registration] Backend error:", {
    status,
    responseData,
    message: error.message,
  });

  const message =
    responseData?.message ||
    responseData?.error ||
    (status === 409
      ? "An account with these details already exists. Please log in."
      : "Registration failed. Please try again.");

  toast.error(message);
} finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#F6F7F9] px-4 py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px]" />

      <div className="absolute -bottom-24 -right-24 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-br from-violet-200/40 to-sky-200/40 rounded-full blur-[60px] sm:blur-[80px]" />

      <div className="hidden sm:flex absolute top-4 left-4 items-center gap-2.5 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm">
        <img
          src={logo}
          alt="TalkNet"
          className="w-8 h-8 object-contain"
        />
        <span className="text-[15px] font-semibold text-slate-900">
          TalkNet
        </span>
      </div>

      <div className="w-full max-w-[460px] bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:shadow-[0_16px_48px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10">
        <div className="h-[4px] w-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600" />

        <div className="p-5 sm:p-9">
          
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 rounded-full blur-[12px] opacity-20" />

              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-[3px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  />
                ) : (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#F1F2F5] border-2 border-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <FaUser className="text-slate-400 text-[24px] sm:text-[28px]" />
                  </div>
                )}

                <label className="absolute bottom-0 right-0 h-8 w-8 sm:h-9 sm:w-9 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer active:scale-95">
                  <AiFillEdit className="text-[13px] sm:text-[14px]" />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <h2 className="text-[22px] sm:text-[24px] font-bold text-slate-900 mt-4 sm:mt-5">
              Create account
            </h2>

            <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1">
              Join TalkNet today
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
          >
            <InputField
              icon={<HiOutlineUser />}
              placeholder="Full name"
              value={name}
              onChange={setName}
              autoComplete="name"
            />

            <InputField
              icon={<HiOutlineMail />}
              placeholder="Email address"
              value={email}
              type="email"
              onChange={setEmail}
              autoComplete="email"
            />

            <InputField
              icon={<HiOutlineAtSymbol />}
              placeholder="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
            />

            <InputField
              icon={<HiOutlineLockClosed />}
              placeholder="Password"
              value={password}
              type="password"
              onChange={setPassword}
              autoComplete="new-password"
            />

            <InputField
              icon={<HiOutlineLockClosed />}
              placeholder="Confirm password"
              value={confirmPassword}
              type="password"
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />

            <button
              disabled={loading}
              type="submit"
              className="w-full h-[48px] sm:h-[52px] rounded-full text-[16px] sm:text-[17px] font-semibold text-white bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.35)] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center mt-1"
            >
              {loading ? <Spinner /> : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-[12px] sm:text-[13px] text-slate-400 font-medium">
              OR REGISTER WITH PHONE
            </span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600">
                <FaPhoneAlt />
              </div>

              <div className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                +91
              </div>

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setPhoneNumber(digits);
                }}
                disabled={Boolean(confirmationResult) || sendingOtp}
                className="w-full pl-[76px] pr-4 py-[14px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {!confirmationResult ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Verify that you're not a robot
                  </p>

                  <div
                    id="register-recaptcha-container"
                    className="flex justify-center min-h-[78px]"
                  />
                </div>

                <button
                  type="button"
                  disabled={sendingOtp || verifyingOtp}
                  onClick={handleSendPhoneOtp}
                  className="w-full h-[48px] rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[15px] font-semibold text-blue-700 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-60"
                >
                  {sendingOtp ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <FaPhoneAlt />
                      Send OTP
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <InputField
                  icon={<HiOutlineLockClosed />}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(value) =>
                    setOtp(value.replace(/\D/g, "").slice(0, 6))
                  }
                  type="text"
                  autoComplete="one-time-code"
                />

                <button
                  type="button"
                  disabled={verifyingOtp}
                  onClick={handleVerifyPhoneOtp}
                  className="w-full h-[48px] rounded-full text-[15px] font-semibold text-white bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center"
                >
                  {verifyingOtp
                    ? "Verifying..."
                    : "Verify OTP & Create Account"}
                </button>

                <button
                  type="button"
                  disabled={verifyingOtp || sendingOtp}
                  onClick={resetPhoneOtp}
                  className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                  Change phone number
                </button>
              </>
            )}

            <p className="text-xs leading-5 text-slate-500 text-center">
              Enter your Indian mobile number and complete the
              reCAPTCHA verification. Firebase will send an OTP
              before your TalkNet account is created.
            </p>
          </div>

          <div className="my-5 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-[12px] sm:text-[13px] text-slate-400 font-medium">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleRegister}
            className="w-full h-[48px] sm:h-[52px] rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[15px] sm:text-[16px] font-medium text-slate-700 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60"
          >
            <FcGoogle className="text-[20px] sm:text-[22px]" />
            {googleLoading
              ? "Please wait..."
              : "Continue with Google"}
          </button>

          <p className="text-center text-[13px] sm:text-[14px] text-slate-500 mt-6 sm:mt-8 pb-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable input
const InputField = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 group-focus-within:text-blue-600 transition">
      {icon}
    </div>

    <input
      type={type}
      required
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-11 pr-4 py-[14px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
    />
  </div>
);

export default Register;
