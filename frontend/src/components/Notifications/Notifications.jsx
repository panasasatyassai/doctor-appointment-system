import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";

const SLOT_DURATION = 30;

const Notifications = () => {
  const [appoinments, setAppoinements] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/v2/appointment/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Appointment deleted");
      setAppoinements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      message.error("Delete failed");
    }
  };

  const openUpdateModal = (item) => {
    setSelectedAppointment(item);
    setEditDate(item.date);
    setEditTime(item.time);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v2/appointment/update/${selectedAppointment.id}`,
        { date: editDate, time: editTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Appointment updated");

      setAppoinements((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id
            ? { ...a, date: editDate, time: editTime }
            : a
        )
      );

      setShowModal(false);
    } catch {
      message.error("Update failed");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setShowLoader(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/v2/appointment/patient-appointments",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(res.data);

        setAppoinements(
          res.data.data.map((e) => ({
            id: e._id,
            doctorName: e.doctorId.name,
            date: e.date,
            time: e.time,
            status: e.status,
          }))
        );
        console.log(appoinments);
      } finally {
        setShowLoader(false);
      }
    };

    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const RenderAllBookedAppointments = () => {
    return (
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Time</th>
              <th className="px-4 py-3 text-center">Update</th>
              <th className="px-4 py-3 text-center">Delete</th>
              <th className="px-4 py-3 text-center">status</th>
            </tr>
          </thead>

          <tbody>
            {appoinments.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-3 text-center font-medium">
                  {index + 1}
                </td>

                <td className="px-4 py-3 font-medium text-blue-700">
                  {item.doctorName}
                </td>

                <td className="px-4 py-3 text-center">{item.date}</td>

                <td className="px-4 py-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                    {item.time}
                  </span>
                </td>

                {/* <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openUpdateModal(item)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold"
                  >
                    Update
                  </button>
                </td> */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openUpdateModal(item)}
                    disabled={item.status === "cancelled"}
                    className={`px-3 py-1.5 rounded text-xs font-semibold
      ${
        item.status === "cancelled"
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
                  {item.status === "approved" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Approved
                    </span>
                  )}

                  {item.status === "cancelled" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  )}

                  {item.status === "pending" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const RenderNoBookedAppointments = () => {
    return (
      <div className="flex items-center justify-center h-[420px]">
        <div className="bg-white rounded-xl shadow-md px-10 py-12 text-center max-w-md">
          <div className="flex justify-center items-center">
            <img
              src="https://media.istockphoto.com/id/1278801008/vector/calendar-and-check-mark-vector-icon.jpg?s=612x612&w=0&k=20&c=mb3TThoC0BJiFFB3JcwMPkTZULhSn5osrHK3o3gDUxg="
              className="h-[100px]"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Booked Appointments
          </h3>

          <p className="text-gray-500 text-sm mb-6">
            You haven’t booked any appointments yet. Once you book, they’ll
            appear here.
          </p>

          <div className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm">
            Go to{" "}
            <Link to="/doctors">
              {" "}
              <span className="underline">Doctors</span>{" "}
            </Link>{" "}
            to book
          </div>
        </div>
      </div>
    );
  };

  const RenderRes = () => {
    return (
      <>
        {appoinments.length === 0 ? (
          <RenderNoBookedAppointments />
        ) : (
          <RenderAllBookedAppointments />
        )}
      </>
    );
  };

  return (
    <>
      <LogHomeNavbar appoinments={appoinments} />

      <div className="bg-gray-100 min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Booked Appointments
          </h2>

          {showLoader ? (
            <div className="flex justify-center py-20">
              <ThreeDots color="#2563eb" />
            </div>
          ) : (
            <RenderRes />
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
    </>
  );
};

export default Notifications;
