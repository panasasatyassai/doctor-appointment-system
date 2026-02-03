import { Link, useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const LogHomeNavbar = () => {
  const [appoinments, setAppoinements] = useState([]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [patientName, setPatientName] = useState("");
  const [user1, setUser] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/v2/user/profile3",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const arr = res.data.data;
      const updatedData = {
        name: arr.name,
        email: arr.email,
      };
      console.log("Updated Data : ", updatedData);
      setUser(updatedData);
      setShowLoader(false);
    } catch (e) {
      console.log(e);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/v2/appointment/patient-appointments",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedData = res.data.data.map((e) => ({
        id: e._id,
        doctorName: e.doctorId.name,
        date: e.date,
        time: e.time,
        status: e.status,
      }));

      setAppoinements(updatedData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => fetchAppointments();
    window.addEventListener("appointmentBooked", handler);
    return () => window.removeEventListener("appointmentBooked", handler);
  }, []);

  const onClickLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login", { replace: true });
  };

  const saveProfile = async () => {
    if (!editName || !editEmail) {
      message.error("Name and Email are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/v2/user/update-profile3",
        {
          name: editName,
          email: editEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      message.success(res.data.message);

      setUser(res.data.data);

      setEditMode(false);
    } catch (error) {
      console.log(error);
      message.error("Profile update failed");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItem = (path) =>
    `relative pb-2 text-sm font-medium transition ${
      location.pathname === path
        ? "text-blue-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  console.log("State Data", user1);
  const RenderLoader = () => {
    return (
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    );
  };
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <img
            src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg"
            alt="Doccure"
            className="h-8"
          />

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/log-home" className={navItem("/log-home")}>
              Home
            </Link>

            <Link to="/doctors" className={navItem("/doctors")}>
              Doctors
            </Link>

            <Link
              to="/booked-appointments"
              className={`${navItem("/booked-appointments")} flex items-center gap-2`}
            >
              <span>Appointments</span>
              {appoinments.length > 0 && (
                <span className="px-2 py-[2px] text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                  {appoinments.length}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="relative" ref={menuRef}>
          {showLoader ? (
            <RenderLoader />
          ) : (
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setEditName(user1?.name || "");
                setEditEmail(user1?.email || "");
              }}
              className="flex items-center gap-3 hover:bg-slate-100 px-3 py-2 rounded-lg transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold uppercase">
                {user1?.name?.[0] || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {user1?.name || "Loading..."}
                </p>
                <p className="text-xs text-slate-500">Patient</p>
              </div>
            </button>
          )}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-4">
              {!editMode ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {user1?.name || ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user1?.email || ""}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full py-2 mb-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={onClickLogOut}
                    className="w-full py-2 text-sm rounded-md text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <label className="text-xs text-slate-500">Full Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm mb-3"
                  />

                  <label className="text-xs text-slate-500">Email</label>
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm mb-3"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2 text-sm rounded-md bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="flex-1 py-2 text-sm rounded-md bg-blue-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LogHomeNavbar;
