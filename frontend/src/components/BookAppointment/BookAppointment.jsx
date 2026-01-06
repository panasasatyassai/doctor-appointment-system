import { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";

const SLOT_DURATION = 30;

const BookAppointment = ({ doctor, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");

  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const generateSlots = () => {
    const result = [];
    const [fromH, fromM] = doctor.availability.from.split(":").map(Number);
    const [toH, toM] = doctor.availability.to.split(":").map(Number);

    let start = fromH * 60 + fromM;
    const end = toH * 60 + toM;

    while (start < end) {
      const h = String(Math.floor(start / 60)).padStart(2, "0");
      const m = String(start % 60).padStart(2, "0");
      result.push(`${h}:${m}`);
      start += SLOT_DURATION;
    }
    return result;
  };

  const fetchBookedSlots = async () => {
    if (!date) return;

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/v2/appointment/booked-slots",
      {
        params: { doctorId: doctor._id, date },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setBookedSlots(res.data.data);
  };

  useEffect(() => {
    setSlots(generateSlots());
    fetchBookedSlots();
  }, [date]);

  const bookHandler = async () => {
    if (!date || !time || !problem) {
      message.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v2/appointment/book-appointment",
        { doctor, date, time, problem, name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(res.data.message);
      onClose();
      setDate("");
      setTime("");
      setProblem("");
      setName("");
    } catch (e) {
      message.error(e.response?.data?.message || "Booking failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="pb-4 border-b">
        <h3 className="text-xl font-semibold text-slate-800">
          Booking with <span className="text-blue-600">{doctor.name}</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Select date & time to confirm your appointment
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 mt-4">
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Slots */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              Available Timings
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isBooked = bookedSlots.some((b) => b.time === slot);

                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setTime(slot)}
                    className={`text-sm py-2 rounded-lg transition font-medium
                      ${
                        isBooked
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : time === slot
                          ? "bg-blue-600 text-white"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Time */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Selected Time
            </label>
            <input
              type="time"
              value={time}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-slate-100"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Problem */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Medical Issue
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your medical issue"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t mt-4">
        <button
          onClick={bookHandler}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
