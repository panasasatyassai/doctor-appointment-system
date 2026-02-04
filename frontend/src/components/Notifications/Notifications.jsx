import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { ThreeDots } from "react-loader-spinner";
import { FiArrowUp } from "react-icons/fi";

const SLOT_DURATION = 30;

const Notifications = () => {
  const [appoinments, setAppoinements] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const [showScrollTop, setShowScrollTop] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const generateSlots = () => {
    const slots = [];
    let start = 9 * 60;
    const end = 17 * 60;

    while (start < end) {
      const h = String(Math.floor(start / 60)).padStart(2, "0");
      const m = String(start % 60).padStart(2, "0");
      slots.push(`${h}:${m}`);
      start += SLOT_DURATION;
    }
    return slots;
  };

  const timeSlots = generateSlots();

  const fetchAppointments = async () => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/patient-appointments",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAppoinements(
        res.data.data.map((e) => ({
          id: e._id,
          doctorName: e.doctorId.name,
          date: e.date,
          time: e.time,
          status: e.status,
        })),
      );
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appoinments.filter((a) => {
    if (activeTab === "today") return a.date === today;
    if (activeTab === "upcoming") return a.date > today;
    if (activeTab === "past") return a.date < today;
    return true;
  });

  const openUpdateModal = (item) => {
    setSelectedAppointment(item);
    setEditDate(item.date);
    setEditTime(item.time);
    setShowModal(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/update/${selectedAppointment.id}`,
        { date: editDate, time: editTime },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      message.success("Appointment updated");

      fetchAppointments();
      setShowModal(false);
    } catch {
      message.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success("Appointment deleted");
      fetchAppointments();
    } catch {
      message.error("Delete failed");
    }
  };

  const RenderAllBookedAppointments = () => (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3 text-left">Doctor</th>
            <th className="px-4 py-3 text-center">Date</th>
            <th className="px-4 py-3 text-center">Time</th>
            <th className="px-4 py-3 text-center">Update</th>
            <th className="px-4 py-3 text-center">Delete</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.map((item, index) => {
            const appointmentDateTime = new Date(`${item.date}T${item.time}`);
            const now = new Date();

            const isPastDate = item.date < today;
            const isPastTime =
              item.date === today && appointmentDateTime <= now;

            const isUpdateDisabled = isPastDate || isPastTime;

            return (
              <tr key={item.id} className="border-b hover:bg-blue-50">
                <td className="px-4 py-3 text-center">{index + 1}</td>

                <td className="px-4 py-3 font-medium text-blue-700">
                  {item.doctorName}
                </td>

                <td className="px-4 py-3 text-center">{item.date}</td>

                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                    {item.time}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    disabled={isUpdateDisabled}
                    onClick={() => openUpdateModal(item)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold
                      ${
                        isUpdateDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                  >
                    Update
                  </button>
                </td>

                 
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
                  >
                    Delete
                  </button>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-3 h-7 rounded-full text-xs font-semibold
                      ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <LogHomeNavbar appoinments={appoinments} />

      <div className="bg-gray-100 min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">All Booked Appointments</h2>

          <div className="flex gap-3 mb-6">
            {["today", "upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {showLoader ? (
            <div className="flex justify-center py-20">
              <ThreeDots color="#2563eb" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-500 py-20">
              No appointments found
            </p>
          ) : (
            <RenderAllBookedAppointments />
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[450px] p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Update Appointment
            </h3>

            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              min={today}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium mb-2">
              Select Time
            </label>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setEditTime(slot)}
                  className={`py-2 rounded-md text-xs font-semibold
                    ${
                      editTime === slot
                        ? "bg-blue-600 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 bg-[#7367f0] hover:bg-[#5e50ee] text-white p-3 rounded-full shadow-lg transition"
          >
            <FiArrowUp size={20} />
          </button>
        )}
      </div>
    </>
  );
};

export default Notifications;
