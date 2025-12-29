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

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  const onSubmitDetails = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
      role,
    };
    // console.log(newUser)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v2/user/login",
        newUser)
        console.log(res.data) 

    
      if (res.data.success) {
      const backendToken =   res.data.token
      const role = res.data.user.role 
      localStorage.setItem("token", backendToken)
      localStorage.setItem("role", role)
      message.success("Login SuccessFully");
      if (res.data.success) {
        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard", {replace : true});
           
        } else if (res.data.user.role === "doctor") {
          navigate("/doctor-dashboard", {replace : true});
        } else {
          navigate("/log-home" , {replace : true});
        }
      } else {
        message.error(res.data.message);
      }
    }
    } catch (e) {
      console.log(`Error at : ${e}`);
    }
  };
  return (
    <div className="bg-white-500">
      <Navbar />
      <div className="bg-white-500 h-[510px] flex flex-cols justify-center items-center text-center">
        <div>
          <h1 className="font-bold text-[30px]">Log In</h1>
          <form onSubmit={onSubmitDetails}>
            <input
              type="mail"
              value={email}
              onChange={onChangeEmail}
              required
              placeholder="Enter your email"
              className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
            />{" "}
            <br />
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
              className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
              required
              placeholder="Enter your password"
            />{" "}
            <br />
            <select
              value={role}
              onChange={onChangeRole}
              className=" w-[300px] h-[45px] m-3 border border-gray-300 rounded px-3 py-2 text-gray-700"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
            <div className="">
              <button
                type="submit"
                className="w-[300px] h-[45px] bg-blue-500 m-3 rounded text-white w-[90px] h-[40px]"
              >
                Sign In
              </button>
            </div>
          </form>
          <p>
            Not a User ?{" "}
            <span>
              {" "}
              <Link to="/register" className="text-blue-500 font-bold">
                Register
              </Link>{" "}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
