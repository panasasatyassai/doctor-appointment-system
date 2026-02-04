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

  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

   

  const timeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const normalizeDate = (d) => {
    if (!d) return "";
    const parts = d.split("-");
    if (parts[0].length === 2) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm}-${dd}`;
    }
    return d;
  };

  

  const generateSlots = () => {
    if (!doctor?.availability) return [];

    const result = [];
    const { from, to, breaks = [] } = doctor.availability;

    const [fromH, fromM] = from.split(":").map(Number);
    const [toH, toM] = to.split(":").map(Number);

    let start = fromH * 60 + fromM;
    const end = toH * 60 + toM;

    while (start < end) {
      const h = String(Math.floor(start / 60)).padStart(2, "0");
      const m = String(start % 60).padStart(2, "0");
      const slot = `${h}:${m}`;

      const slotMinutes = timeToMinutes(slot);

      
      const isInBreak = breaks.some((b) => {
        const breakFrom = timeToMinutes(b.from);
        const breakTo = timeToMinutes(b.to);
        return slotMinutes >= breakFrom && slotMinutes < breakTo;
      });

      if (!isInBreak) {
        result.push(slot);
      }

      start += SLOT_DURATION;
    }

    return result;
  };

   

  const fetchBookedSlots = async () => {
    if (!date) return;

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/booked-slots",
      {
        params: { doctorId: doctor.id, date },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setBookedSlots(res.data.data || []);
  };

  

  useEffect(() => {
    if (date) {
      setSlots(generateSlots());
      fetchBookedSlots();
    }
  }, [date]);

   

  const bookHandler = async () => {
    if (!date || !time || !problem) {
      message.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/book-appointment",
        { doctor, date, time, problem, name },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      message.success(res.data.message);
      window.dispatchEvent(new Event("appointmentBooked"));

      onClose();
      setDate("");
      setTime("");
      setProblem("");
      setName("");
    } catch (e) {
      message.error(e.response?.data?.message || "Booking failed");
    }
  };

  

  return (
    <div className="h-full flex flex-col">
      <div className="pb-4 border-b">
        <h3 className="text-xl font-semibold text-slate-800">
          Booking with <span className="text-blue-600">{doctor.name}</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Select date & time to confirm your appointment
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs mt-4">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-500 rounded"></span> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-blue-600 rounded"></span> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-slate-300 rounded"></span> Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-slate-200 rounded"></span> Past
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Available Timings
          </h4>
          {date === "" && (
            <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              Please select a date to view available time slots
            </p>
          )}

          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isPast =
                normalizeDate(date) === today &&
                timeToMinutes(slot) < timeToMinutes(currentTime);

              let slotClass = "bg-green-500 text-white hover:bg-green-600";

              if (time === slot && !isBooked && !isPast) {
                slotClass = "bg-blue-600 text-white";
              }

              if (isBooked) {
                slotClass = "bg-slate-300 text-slate-700 cursor-not-allowed";
              }

              if (isPast) {
                slotClass = "bg-slate-200 text-slate-400 cursor-not-allowed";
              }

              return (
                <button
                  key={slot}
                  disabled={isBooked || isPast}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-lg text-sm font-medium ${slotClass}`}
                >
                  <div>{slot}</div>
                  {isBooked && <div className="text-xs">Booked</div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
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

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Medical Issue
          </label>
          <textarea
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="pt-4 border-t mt-4">
        <button
          onClick={bookHandler}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
