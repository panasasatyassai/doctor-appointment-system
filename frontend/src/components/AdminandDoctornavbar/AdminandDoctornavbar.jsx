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

  const role = localStorage.getItem("user");
  const updatedData = JSON.parse(role);

  return (
    <div className="sticky top-0 z-50 bg-slate-50 border-b">
      <div
        className="max-w-7xl mx-auto px-6 py-3
                    flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <img src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg" />
        </div>

        <div className="flex items-center gap-5">
          {updatedData.role === "admin" && (
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {updatedData.name}
                </p>
                <p className="text-xs text-slate-500">{updatedData.email}</p>
              </div>

              <div
                className="w-9 h-9 rounded-full bg-indigo-600
                            text-white flex items-center justify-center
                            font-bold"
              >
                {updatedData.name[0].toUpperCase()}
              </div>
            </div>
          )}

          <button
            onClick={onClickLogOut}
            className="text-sm font-medium text-red-600
                     hover:text-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminandDoctornavbar;
