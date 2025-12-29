import { useState } from "react";
import { message } from "antd";
import axios from "axios";
// import Modal from "react-modal";

// const customStyles = {
//   content: {
//     top: "50%",
//     width: "500px",
//     height: "500px",
//     left: "50%",
//     right: "auto",
//     bottom: "50%",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };

const BookAppointment = ({ doctor, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");

  const bookHandler = async () => {
    if (!date || !time || !problem) {
      message.error("Please fill all fields");
      return;
    }
    // console.log({doctor , date , time ,name , problem})
    const newOppintment = {
      doctor,
      date,
      time,
      problem,
      name,
    };
    console.log(newOppintment);
    const token = localStorage.getItem("token");
    const url = "http://localhost:5000/api/v2/appointment/book-appointment";
    try {
      const res = await axios.post(url, newOppintment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //   console.log(res.data)
      if (res.data.success) {
        message.success(`Appointment booked with ${doctor.name}`);
        message.success(res.data.message);
        onClose();
        setDate("");
        setTime("");
        setProblem("");
        setName("");
      } else {
        message.error("You already booked this doctor on this date");
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded mt-6">
      <h3 className="font-bold text-lg mb-3">Booking with {doctor.name}</h3>

      <div className="flex flex-col gap-3 w-[300px]">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your medical issue"
          className="border p-2 rounded"
        />

        <button
          onClick={bookHandler}
          className="bg-green-500 text-white py-2 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
