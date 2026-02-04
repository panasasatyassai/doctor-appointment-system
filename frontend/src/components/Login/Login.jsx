import Navbar from "../Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const onSubmitDetails = async (e) => {
    e.preventDefault();
    const newUser = { email, password, role };

    try {
      const res = await axios.post(
        `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/user/login`,
        newUser
      );

      const userProfile = res.data.user;
      localStorage.setItem("user", JSON.stringify(userProfile));

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        message.success("Login Successfully");

        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else if (res.data.user.role === "doctor") {
          navigate("/doctor-dashboard", { replace: true });
        } else {
          navigate("/log-home", { replace: true });
        }
      } else {
        message.error(res.data.message);
      }
    } catch (e) {
      message.error(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Welcome Back to <br />
            <span className="text-yellow-300">Doccure</span>
          </h1>

          <p className="text-lg text-blue-100 max-w-md mb-10">
            Manage appointments, doctors, and patients securely with a modern
            healthcare platform built for speed and reliability.
          </p>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-blue-200">Appointments</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-blue-200">Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold">99%</p>
              <p className="text-blue-200">Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Enter your credentials to continue
            </p>

            <form onSubmit={onSubmitDetails} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

               
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Login As
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

               
              <button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
              >
                Login
              </button>
            </form>

             
            <p className="text-center text-sm text-slate-600 mt-8">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
