import { Link, useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";

const LogHomeNavbar = ({ appoinments = [] }) => {
  const appointmentLength = appoinments.length;
  const navigate = useNavigate();
  const location = useLocation();

  const onClickLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login", { replace: true });
  };

  const UserProfile = () => {
    const parsedData = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase">
          {parsedData.name[0]}
        </div>
        <div className="hidden md:block leading-tight">
          <p className="text-sm font-semibold text-slate-800">
            {parsedData.name}
          </p>
          <p className="text-xs text-slate-500">{parsedData.email}</p>
        </div>
      </div>
    );
  };

  const navItem = (path) =>
    `relative pb-1 transition ${
      location.pathname === path
        ? "text-blue-600 font-semibold after:w-full"
        : "text-slate-700 hover:text-blue-600 after:w-0 hover:after:w-full"
    }
    after:content-[''] after:absolute after:left-0 after:-bottom-1
    after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`;

  return (
    <header className="bg-amber-50 border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <img
          src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg"
          alt="Doccure"
          className="h-9"
        />

        <div className="flex items-center gap-6">
          <UserProfile />

          <Link to="/log-home" className={navItem("/log-home")}>
            Home
          </Link>

          <Link to="/doctors" className={navItem("/doctors")}>
            Doctors
          </Link>

          <Link
            to="/booked-appointments"
            className={`${navItem(
              "/booked-appointments"
            )} flex items-center gap-2`}
          >
            <span>Booked Appointments</span>

            {appointmentLength > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                {appointmentLength}
              </span>
            )}
          </Link>

          <button
            onClick={onClickLogOut}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default LogHomeNavbar;
