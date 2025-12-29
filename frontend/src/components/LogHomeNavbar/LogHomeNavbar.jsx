import { Link , useNavigate } from "react-router-dom";
import {message} from 'antd'

const LogHomeNavbar = () => {

  const navigate = useNavigate()

  const onClickLogOut = () => {
    localStorage.removeItem("token") 
    localStorage.removeItem("role")
    message.success("Logout SuccessFully")
    navigate("/login", {replace : true})
  }
  return (
    <div>
      <div className="bg-amber-50 p-4 flex justify-between text-white">
        <h1 className="font-bold text-black">Doctor Appointment System</h1>

        <div className="p-3 flex gap-3 text-black text-[15px]">
           <h1 className="cursor-pointer">
            <Link to="/log-home">Home</Link>
           </h1>
           <h1 className="cursor-pointer"> 
            <Link to="/doctors">Doctors</Link>
           </h1>
           <h1 className="cursor-pointer">
            <Link to="/booked-appointments">Booked Appointments</Link>
           </h1>
          <button className="bg-blue-500 w-[90px] h-[32px] border-0 rounded text-white" onClick={onClickLogOut} >
            Logout 
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogHomeNavbar;
