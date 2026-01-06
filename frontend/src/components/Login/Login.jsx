import Navbar from "../Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/v2/user/login",
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

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-10">
          <h1 className="text-4xl font-bold mb-4">Doctor Appointment System</h1>
          <p className="text-lg text-blue-100 text-center max-w-md">
            Securely manage appointments, doctors, and patients from one
            powerful dashboard.
          </p>
        </div>

        <div className="flex items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign In</h2>
            <p className="text-sm text-slate-500 mb-6">
              Enter your credentials to continue
            </p>

            <form onSubmit={onSubmitDetails} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="w-full h-11 mt-1 px-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full h-11 mt-1 px-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full h-11 mt-1 px-4 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
