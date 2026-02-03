import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const AdminandDoctornavbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [displayUser, setDisplayUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showLoader, setLoader] = useState(true);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const onClickLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login", { replace: true });
  };

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v2/doctor-details/get-doctor-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);

      setDisplayUser(res.data.data);
      setEditName(res.data.data.name);
      setEditEmail(res.data.data.email);
      setLoader(false);
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/v2/doctor-details/update-doctor-profile",
        {
          name: editName,
          email: editEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDisplayUser(res.data.data);
      message.success("Profile Updated");
      fetchDoctorProfile();
      setEditMode(false);
      setOpen(false);
    } catch (e) {
      console.log(e);
      message.error("Update failed");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <img
          src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg"
          alt="Doccure"
          className="h-9"
        />

        <div className="relative" ref={menuRef}>
          {showLoader ? (
            <RenderLoader />
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full border hover:bg-slate-50 transition"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {displayUser?.name?.[0]?.toUpperCase()}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {displayUser?.name}
                </p>
                <p className="text-xs text-slate-500">{displayUser?.email}</p>
              </div>
            </button>
          )}

          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border p-4">
              {!editMode ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                      {displayUser?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {displayUser?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {displayUser?.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full mb-2 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={onClickLogOut}
                    className="w-full py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Edit Profile
                  </h4>

                  <label className="text-xs text-slate-500">Full Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <label className="text-xs text-slate-500">Email</label>
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2 rounded-md bg-slate-200 hover:bg-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="flex-1 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
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

export default AdminandDoctornavbar;
