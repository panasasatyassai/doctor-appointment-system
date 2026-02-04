import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const onChangeRole = (e) => setRole(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeName = (e) => setName(e.target.value);

  const onSubmitDetails = async (e) => {
    e.preventDefault();

    const newUser = { name, email, password, role };

    try {
      const response = await axios.post(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/user/register",
        newUser,
      );

      if (response.data.success) {
        message.success("Register Successful");
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      message.error("Registration failed");
    }

    setName("");
    setEmail("");
    setPassword("");
    setRole("");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Join <span className="text-yellow-300">Doccure</span> Today
          </h1>

          <p className="text-lg text-blue-100 max-w-md mb-10">
            Create your account and experience a modern doctor appointment
            system built for patients, doctors, and administrators.
          </p>

          <div className="grid grid-cols-2 gap-6 text-sm max-w-md">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-blue-200">Verified Doctors</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-blue-200">Appointments</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">99%</p>
              <p className="text-blue-200">Patient Trust</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-blue-200">Availability</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Fill in the details below to get started
            </p>

            <form onSubmit={onSubmitDetails} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={onChangeName}
                  required
                  placeholder="John Doe"
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
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
                  onChange={onChangePassword}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Register As
                </label>
                <select
                  value={role}
                  onChange={onChangeRole}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Register As
                </label>

                <select
                  value="patient"
                  disabled
                  className="w-full mt-3 h-11 px-4 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 cursor-not-allowed"
                >
                  <option value="patient">Patient</option>
                </select>

                
                <input type="hidden" name="role" value="patient" />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
              >
                Register
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
