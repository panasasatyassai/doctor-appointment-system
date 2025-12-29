import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
 

const AdminandDoctornavbar = () => {
  const navigate = useNavigate();

  const onClickLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    message.success("Logout SuccessFully");
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <div className="bg-amber-50 p-4 flex justify-between text-white">
        <h1 className="font-bold text-black">Doctor Appointment System</h1>

        <div className="p-3 flex gap-3">
          <button
            className="bg-blue-500 w-[90px] h-[32px] border-0 rounded "
            onClick={onClickLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminandDoctornavbar;
