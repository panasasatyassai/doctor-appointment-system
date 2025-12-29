import { useState } from "react";

const UpdateAppointmentModal = ({ appointment, onClose, onSave }) => {
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-bold mb-4">Update Appointment</h3>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border w-full mb-3 p-1"
        />

        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border w-full mb-4 p-1"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ date, time })}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
