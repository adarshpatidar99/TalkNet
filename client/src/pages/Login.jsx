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
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import logo from "../assets/TalkNet2.png";
import Spinner from "../components/Spinner";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

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
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  if (!API_URL) {
    return toast.error("API URL is not configured");
  }

  try {
    setGoogleLoading(true);

    const result = await signInWithPopup(auth, provider);

    // Get Firebase ID token.
    const idToken = await result.user.getIdToken();

    // Send token to backend.
    const { data } = await axios.post(
      `${API_URL}/api/v1/user/google/login`,
      { idToken },
      { withCredentials: true }
    );

    dispatch(setUser(data.user));

    toast.success("Google login successful 🎉");
    navigate("/");
  } catch (error) {
    console.error("[Google login]", error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Google login failed"
    );
  } finally {
    setGoogleLoading(false);
  }
};
  
  const handleSendOtp = async () => {
    const digits = phoneNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(digits)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setPhoneLoading(true);

    try {
      let verifier = window.recaptchaVerifier;

      if (!verifier) {
        verifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );

        window.recaptchaVerifier = verifier;
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${digits}`,
        verifier
      );

      setConfirmationResult(result);
      toast.success("OTP sent successfully");
    } catch (error) {
      console.error("Send OTP error:", error);

      toast.error(
        error.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : error.message || "Unable to send OTP"
      );

      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      toast.error("Please request an OTP first");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setPhoneLoading(true);

    try {
      const credential = await confirmationResult.confirm(otp.trim());
      const idToken = await credential.user.getIdToken();

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/phone/login`,
        { idToken },
        { withCredentials: true }
      );

      dispatch(setUser(data.user));

      toast.success("Phone login successful 🎉");
      navigate("/");
    } catch (error) {
      console.error("Phone verification error:", error);

      toast.error(
        error.response?.data?.message ||
          (error.code === "auth/invalid-verification-code"
            ? "Incorrect OTP. Please try again."
            : error.message) ||
          "OTP verification failed"
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleChangePhone = () => {
    window.recaptchaVerifier?.clear();
    window.recaptchaVerifier = null;

    setConfirmationResult(null);
    setOtp("");
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#F6F7F9] px-4 py-6 sm:py-8 relative overflow-hidden">
     
      <div className="absolute -top-24 -left-24 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-[60px] sm:blur-[80px]" />

      <div className="absolute -bottom-24 -right-24 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-br from-violet-200/40 to-sky-200/40 rounded-full blur-[60px] sm:blur-[80px]" />

      <div className="hidden sm:flex absolute top-4 left-4 items-center gap-2.5 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm z-20">
        <img
          src={logo}
          alt="TalkNet"
          className="w-8 h-8 object-contain"
          draggable={false}
        />
        <span className="text-[15px] font-semibold text-slate-900">
          TalkNet
        </span>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:shadow-[0_16px_48px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10">
        <div className="h-[4px] w-full bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600" />

        <div className="p-5 sm:p-9">
          <div className="flex justify-center">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
              <FaUser className="text-white text-[20px] sm:text-[22px]" />
            </div>
          </div>

          <h2 className="text-center text-[22px] sm:text-[24px] font-bold text-slate-900 mt-4 sm:mt-5 leading-tight">
            Welcome back
          </h2>

          <p className="text-center text-[13px] sm:text-[15px] text-slate-500 mt-1.5 sm:mt-2">
            Sign in to continue to TalkNet
          </p>

          <form
            className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
            onSubmit={handleLogin}
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[12px] sm:text-[13px] font-semibold tracking-wide text-slate-500 uppercase ml-1">
                Email
              </label>

              <div className="relative group">
                <HiOutlineMail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[18px] sm:text-[20px] text-slate-400 group-focus-within:text-blue-600 transition" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-[13px] sm:py-[14px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[12px] sm:text-[13px] font-semibold tracking-wide text-slate-500 uppercase ml-1">
                Password
              </label>

              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[18px] sm:text-[20px] text-slate-400 group-focus-within:text-blue-600 transition" />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-[13px] sm:py-[14px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading || phoneLoading}
              className="w-full mt-1 h-[48px] sm:h-[52px] rounded-full text-[16px] sm:text-[17px] font-semibold text-white bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 active:scale-[0.98] shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? <Spinner /> : "Continue"}
            </button>

            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[12px] sm:text-[13px] text-slate-400 font-medium">
                OR LOGIN WITH PHONE
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              required={false}
              placeholder="10-digit mobile number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              disabled={phoneLoading || Boolean(confirmationResult)}
              className="w-full px-4 py-[13px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <div id="recaptcha-container" />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={phoneLoading || Boolean(confirmationResult)}
              className="w-full h-[48px] rounded-full border border-blue-200 text-blue-700 font-semibold disabled:opacity-60"
            >
              {phoneLoading ? "Please wait..." : "Send OTP"}
            </button>

            {confirmationResult && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="w-full px-4 py-[13px] rounded-xl bg-[#F8F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={phoneLoading}
                  className="w-full h-[48px] rounded-full text-white font-semibold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 disabled:opacity-60"
                >
                  {phoneLoading ? "Verifying..." : "Verify OTP & Login"}
                </button>

                <button
                  type="button"
                  onClick={handleChangePhone}
                  disabled={phoneLoading}
                  className="w-full text-sm text-blue-600 font-medium"
                >
                  Change phone number
                </button>
              </>
            )}

            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[12px] sm:text-[13px] text-slate-400 font-medium">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading || phoneLoading}
              className="w-full h-[48px] sm:h-[52px] rounded-full border border-slate-200 bg-white text-[15px] sm:text-[16px] font-medium text-slate-700 flex items-center justify-center gap-2.5 sm:gap-3 transition disabled:opacity-60 shadow-sm active:scale-[0.98]"
            >
              <FcGoogle className="text-[20px] sm:text-[22px]" />
              {googleLoading ? "Please wait..." : "Continue with Google"}
            </button>
          </form>

          <p className="text-center text-[13px] sm:text-[14px] text-slate-500 mt-6 sm:mt-8 pb-1">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-semibold text-blue-600 cursor-pointer"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
