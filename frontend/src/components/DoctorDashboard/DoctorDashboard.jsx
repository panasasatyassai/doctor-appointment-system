import { useState, useEffect } from "react";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { message } from "antd";
import { FiCalendar, FiClock, FiLoader, FiAlertCircle } from "react-icons/fi";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_DURATION_MINUTES = 30;

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({});
  const [days, setDays] = useState([]);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("17:00");
  const [breaks, setBreaks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [, forceTick] = useState(0);
  const [doctorStatus, setDoctorStatus] = useState("Active");
  const [statusLoader, setStatusLoader] = useState({
    id: null,
    action: null,
  });

  const token = localStorage.getItem("token");

  const getDateTime = (date, time) => {
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    return new Date(y, m - 1, d, h, min);
  };

  const isSlotActive = (date, time) => {
    const start = getDateTime(date, time);
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
    return new Date() < end;
  };

  const fetchProfile = async () => {
    const res = await axios.get("https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const d = res.data.data;
    setDoctorStatus(d.status === "approved" ? "Active" : "InActive");
    setProfile(d);
    setDays(d.availability?.days || []);
    setFrom(d.availability?.from || "09:00");
    setTo(d.availability?.to || "17:00");
    setBreaks(d.availability?.breaks || []);
  };

  const fetchAppointments = async () => {
    try {
      //  setLoading(true);
      const res = await axios.get(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/appointments",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAppointments(
        res.data.data.map((a) => ({
          id: a._id,
          patient: a.patientId.name,
          date: a.date,
          time: a.time,
          problem: a.problem,
          status: a.status,
        })),
      );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setStatusLoader({ id, action: status });
    const res = await axios.post(
      "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/update-status",
      { appointmentId: id, status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log(res.data);
    message.success(`Appointment ${status}`);
    setStatusLoader(false);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter((a) => {
    const now = new Date();
    const start = getDateTime(a.date, a.time);
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

    if (activeTab === "today")
      return start.toDateString() === now.toDateString() && now < end;
    if (activeTab === "upcoming") return start > now;
    if (activeTab === "past") return end <= now;
    return true;
  });

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const saveAvailability = async () => {
    if (to <= from) return message.error("Invalid working time range");
    if (breaks.length > 0 && breaks[0].from >= breaks[0].to)
      return message.error("Invalid break time");

    try {
      await axios.post(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/update-availability",
        { days, from, to, breaks },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      message.success("Availability updated successfully");
      setEditMode(false);
      fetchProfile();
    } catch {
      message.error("Failed to update availability");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    const interval = setInterval(() => forceTick((v) => v + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AdminandDoctornavbar profile={profile} />

      <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#ecfeff] to-[#fef3c7] p-10 space-y-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">
              Doctor Availability
            </h2>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                doctorStatus === "Active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {doctorStatus}
            </span>
          </div>

          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Available Days
                </p>
                <div className="flex gap-2 flex-wrap">
                  {days.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Working Hours
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {from} – {to}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Break Time
                </p>
                {breaks.length > 0 ? (
                  breaks.map((b, i) => (
                    <p key={i} className="text-lg font-bold text-slate-800">
                      {b.from} – {b.to}
                    </p>
                  ))
                ) : (
                  <p className="italic text-slate-400">No breaks</p>
                )}
              </div>

              <div className="md:col-span-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-xl shadow hover:scale-105 transition"
                >
                  Edit Availability
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Working From
                </label>
                <input
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Working To
                </label>
                <input
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Break From
                </label>
                <input
                  type="time"
                  value={breaks[0]?.from || ""}
                  onChange={(e) =>
                    setBreaks([{ ...breaks[0], from: e.target.value }])
                  }
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Break To
                </label>
                <input
                  type="time"
                  value={breaks[0]?.to || ""}
                  onChange={(e) =>
                    setBreaks([{ ...breaks[0], to: e.target.value }])
                  }
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Working Days
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ALL_DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        days.includes(day)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  onClick={saveAvailability}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-slate-300 px-6 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-rose-600 mb-6">
            Appointments
          </h2>

          <div className="flex gap-3 mb-6">
            {["today", "upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  activeTab === tab ? "bg-rose-500 text-white" : "bg-slate-200"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <ThreeDots height="60" width="60" color="#6366f1" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-center text-slate-500 py-10">
              No appointments found
            </p>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((a) => (
                <div
                  key={a.id}
                  className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className={`absolute -top-3 right-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow ${
                      a.status === "approved"
                        ? "bg-green-500 text-white"
                        : a.status === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-400 text-slate-900"
                    }`}
                  >
                    {a.status}
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {a.patient.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">
                        {a.patient}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-indigo-500" />
                          {a.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="text-rose-500" />
                          {a.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 rounded-xl px-4 py-3 mb-4">
                    <p className="text-sm flex items-center gap-2">
                      <FiAlertCircle className="text-amber-500" />
                      <span className="font-semibold text-slate-600">
                        Problem:
                      </span>
                      {a.problem}
                    </p>
                  </div>

                  {activeTab !== "past" && isSlotActive(a.date, a.time) ? (
                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        onClick={() => updateStatus(a.id, "approved")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg"
                      >
                        {statusLoader.id === a.id &&
                        statusLoader.action === "approved" ? (
                          <div className="flex justify-center items-center gap-2">
                            <FiLoader className="animate-spin" />
                            Approving
                          </div>
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "rejected")}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl shadow-lg"
                      >
                        {statusLoader.id === a.id &&
                        statusLoader.action === "rejected" ? (
                          <div className="flex justify-center items-center gap-2">
                            <FiLoader className="animate-spin" />
                            Rejecting
                          </div>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3">
                      <p className="text-sm text-slate-400 italic flex items-center gap-2">
                        <FiClock className="text-slate-400" />
                        Time completed — action disabled
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div> */}

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-100">
         
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl font-bold text-indigo-600">Appointments</h2>

            
            <div className="flex gap-3 mt-4 sm:mt-0">
              {["today", "upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
            ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg scale-105"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

           
          {loading ? (
            <div className="flex justify-center py-16">
              <ThreeDots height="60" width="60" color="#6366f1" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((a) => (
                <div
                  key={a.id}
                  className="relative group bg-white rounded-2xl p-6 shadow-lg 
          hover:shadow-2xl transition-all duration-300
          border border-slate-100"
                >
                  
                  <div
                    className={`absolute -top-3 right-6 px-4 py-1.5 rounded-full 
            text-xs font-semibold shadow-lg
            ${
              a.status === "approved"
                ? "bg-emerald-500 text-white"
                : a.status === "rejected"
                  ? "bg-rose-500 text-white"
                  : "bg-amber-400 text-slate-900"
            }`}
                  >
                    {a.status.toUpperCase()}
                  </div>

                  
                  <div className="flex items-start gap-4 mb-4">
                    
                    <div
                      className="w-14 h-14 rounded-full 
              bg-gradient-to-br from-indigo-500 to-violet-500
              flex items-center justify-center 
              text-white font-bold text-xl shadow"
                    >
                      {a.patient.charAt(0).toUpperCase()}
                    </div>

                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">
                        {a.patient}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-indigo-500" />
                          {a.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="text-violet-500" />
                          {a.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  <div className="bg-indigo-50/60 rounded-xl px-4 py-3 mb-4">
                    <p className="text-sm flex items-center gap-2 text-slate-700">
                      <FiAlertCircle className="text-amber-500" />
                      <span className="font-semibold text-indigo-600">
                        Problem:
                      </span>
                      {a.problem}
                    </p>
                  </div>

                  
                  {activeTab !== "past" && isSlotActive(a.date, a.time) ? (
                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        onClick={() => updateStatus(a.id, "approved")}
                        className="bg-emerald-500 hover:bg-emerald-600
                text-white px-6 py-2 rounded-xl shadow-lg 
                hover:scale-105 transition"
                      >
                        {statusLoader.id === a.id &&
                        statusLoader.action === "approved" ? (
                          <div className="flex items-center gap-2">
                            <FiLoader className="animate-spin" />
                            Approving
                          </div>
                        ) : (
                          "Approve"
                        )}
                      </button>

                      <button
                        onClick={() => updateStatus(a.id, "rejected")}
                        className="bg-rose-500 hover:bg-rose-600
                text-white px-6 py-2 rounded-xl shadow-lg 
                hover:scale-105 transition"
                      >
                        {statusLoader.id === a.id &&
                        statusLoader.action === "rejected" ? (
                          <div className="flex items-center gap-2">
                            <FiLoader className="animate-spin" />
                            Rejecting
                          </div>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3">
                      <p className="text-sm text-slate-400 italic flex items-center gap-2">
                        <FiClock className="text-slate-400" />
                        Time completed — action disabled
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
         
      </div>
    </>
  );
};

export default DoctorDashboard;
