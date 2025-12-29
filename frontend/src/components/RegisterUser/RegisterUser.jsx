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

  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onSubmitDetails = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      role,
    };
    console.log(newUser);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/user/register",
        newUser
      );
      console.log(response.data);
      if (response.data.success) {
        navigate("/login");
        message.success("Register SuccessFull");
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.log("Error at ", e);
    }

    setName("");
    setEmail("");
    setPassword("");
    setRole("");
  };

  return (
    <div className="bg-white-500">
      <Navbar />
      <div className="bg-white-500 h-[510px] flex flex-cols justify-center items-center text-center">
        <div>
          <h1 className="font-bold text-[30px]">Register</h1>
          <form onSubmit={onSubmitDetails}>
            <input
              onChange={onChangeName}
              value={name}
              type="text"
              required
              placeholder="Enter your Name"
              className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
            />{" "}
            <br />
            <input
              onChange={onChangeEmail}
              value={email}
              type="mail"
              required
              placeholder="Enter your email"
              className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
            />{" "}
            <br />
            <input
              onChange={onChangePassword}
              value={password}
              type="password"
              className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
              required
              placeholder="Enter your password"
            />{" "}
            <br />
            <select
              onChange={onChangeRole}
              value={role}
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
                Register
              </button>
            </div>
          </form>
          <p>
            Already User ?{" "}
            <span>
              {" "}
              <Link to="/login" className="text-blue-500 font-bold">
                Login
              </Link>{" "}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
