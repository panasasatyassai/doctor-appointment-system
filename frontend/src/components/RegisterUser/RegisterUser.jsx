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
        "http://localhost:5000/api/v2/user/register",
        newUser
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

      <div className="min-h-screen flex">
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              Doctor Appointment System
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Create your account and manage appointments, doctors, and patients
              with ease using our secure platform.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Create Account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill in your details to get started
            </p>

            <form onSubmit={onSubmitDetails} className="space-y-4">
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
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
                  required
                  placeholder="email@example.com"
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* PASSWORD */}
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
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={onChangeRole}
                  required
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
              >
                Register
              </button>
            </form>

            <p className="text-sm text-center text-slate-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
