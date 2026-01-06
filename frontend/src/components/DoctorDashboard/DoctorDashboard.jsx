import { useState, useEffect } from "react";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { message } from "antd";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [days, setDays] = useState([]);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("17:00");
  const [editMode, setEditMode] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [availability, setAvailability] = useState({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    from: "09:00",
    to: "17:00",
  });

  const toggleDay = (day) => {
    setAvailability((prev) => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter((d) => d !== day) : [...prev.days, day],
      };
    });
  };

  const [profile, setProfile] = useState([]);

  const getProfileData = async () => {
    const url = "http://localhost:5000/api/v2/doctor/profile";
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const obj = res.data.data;
      setProfile({
        name: obj.name,
        specialization: obj.specialization,
        experience: obj.experience,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getDoctorAppointmentsData = async () => {
    try {
      setShowLoader(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/v2/doctor/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const arr = res.data.data;
      const updatedData = arr.map((each) => ({
        id: each._id,
        patient: each.patientId.name,
        date: each.date,
        time: each.time,
        status: each.status,
        problem: each.problem,
      }));
      setAppointments(updatedData);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/v2/appointment/update-status",
        { appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Appointment ${status}`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update appointment");
    }
  };

  const RenderAppointments = () => (
    <table className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <thead className="bg-slate-100 text-slate-600 text-sm">
        <tr>
          <th className="p-4 text-left">Patient</th>
          <th>Date</th>
          <th>Time</th>
          <th>Problem</th>
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt) => (
          <tr
            key={appt.id}
            className="border-b hover:bg-slate-50 transition text-center"
          >
            <td className="p-4 text-left font-medium">{appt.patient}</td>
            <td>{appt.date}</td>
            <td>{appt.time}</td>
            <td>{appt.problem}</td>
            <td>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  appt.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {appt.status}
              </span>
            </td>
            <td>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => updateAppointmentStatus(appt.id, "approved")}
                  className="text-green-600 font-medium hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateAppointmentStatus(appt.id, "rejected")}
                  className="text-red-600 font-medium hover:underline"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const RenderLoader = () => (
    <div className="flex justify-center items-center h-[200px]">
      <ThreeDots height="80" width="80" color="#2563eb" />
    </div>
  );

  const RenderNoOppentments = () => (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <h1 className="text-lg font-semibold text-slate-700">
        No Appointments Booked
      </h1>
    </div>
  );

  const RenderRes = () => (
    <div>
      {appointments.length === 0 ? (
        <RenderNoOppentments />
      ) : (
        <RenderAppointments />
      )}
    </div>
  );

  const getProfileData2 = async () => {
    const url = "http://localhost:5000/api/v2/doctor/profile";
    const token = localStorage.getItem("token");
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const doctor = res.data.data;
    setDays(doctor.availability?.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setFrom(doctor.availability?.from || "09:00");
    setTo(doctor.availability?.to || "17:00");
  };

  const updateAvailability = async () => {
    if (to <= from) {
      alert("End time must be greater than start time");
      return;
    }
    try {
      const url = "http://localhost:5000/api/v2/doctor/update-availability";
      const token = localStorage.getItem("token");
      await axios.post(
        url,
        { days: availability.days, from, to },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Availability Updated");
      await getProfileData2();
      setEditMode(false);
    } catch (error) {
      message.error("Failed to update availability");
    }
  };

  useEffect(() => {
    getDoctorAppointmentsData();
    getProfileData2();
    getProfileData();
  }, []);

  return (
    <>
      <AdminandDoctornavbar />

      <div className="min-h-screen bg-slate-100 p-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Doctor Dashboard
          </h2>
          <div className="text-right space-y-1">
            <p className="text-slate-800 font-semibold">
              Doctor Name : {profile.name}
            </p>
            <p className="text-slate-500 text-sm">
              Specialization : {profile.specialization}
            </p>
            <p className="text-slate-500 text-sm">
              Experience : {profile.experience} years
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Availability
          </h3>

          {!editMode ? (
            <>
              <p className="text-slate-600">
                {days.join(" – ")} | {from} – {to}
              </p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="text-sm">From</label>
                  <input
                    type="time"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="border rounded p-1 ml-2"
                  />
                </div>
                <div>
                  <label className="text-sm">To</label>
                  <input
                    type="time"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="border rounded p-1 ml-2"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {ALL_DAYS.map((day) => {
                  const active = availability.days.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded border text-sm ${
                        active ? "bg-green-600 text-white" : "bg-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={updateAvailability}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Save
              </button>
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          Appointments
        </h3>
        {showLoader ? <RenderLoader /> : <RenderRes />}
      </div>
    </>
  );
};

export default DoctorDashboard;
