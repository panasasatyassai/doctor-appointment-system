import { useState, useEffect } from "react";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import {message} from 'antd'

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [days, setDays] = useState([]);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("17:00");
  const [editMode, setEditMode] = useState(false);
  const [showLoader , setShowLoader] = useState(false)

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res.data.data);
      const obj = res.data.data;
      const updatedData = {
        name: obj.name,
        specialization: obj.specialization,
        experience: obj.experience,
      };
      setProfile(updatedData);
    } catch (e) {
      console.log(e);
    }
  };

  const getDoctorAppointmentsData = async () => {
    try {
      setShowLoader(true)
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/v2/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const arr = res.data.data;
      console.log(arr);
      const updatedData = arr.map((each) => ({
        id: each._id,
        patient: each.patientId.name,
        date: each.date,
        time: each.time,
        status: each.status,
        problem: each.problem,
      }));
      setShowLoader(false)
      setAppointments(updatedData);
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success(`Appointment ${status}`);

    // update UI instantly
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status } : a
      )
    );
  } catch (err) {
    console.log(err);
    alert("Failed to update appointment");
  }
};


  const RenderAppointments = () => {
    return (
      <> 
          <table className="w-full bg-white shadow rounded mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Problem</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="text-center">
                  <td className="p-2">{appt.patient}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.problem}</td>
                  <td>{appt.status}</td>
                  <td className="flex gap-2 justify-center p-2">
                    <button
                       onClick={() => updateAppointmentStatus(appt.id, "approved")}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, "rejected")}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
    )
  }

  const RenderLoader = () => {
    return (
      <div className="flex justify-center items-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ margin: "20px" }}
          wrapperClass="custom-loader"
          visible={true}
        />
      </div>
    )
  }

  const RenderNoOppentments = () => {
    return (
      <div className="text-center mt-4">
        <h1>No Appoinments Booked</h1>
      </div>
    )
  }

  const RenderRes = () => {
    return (
      <div>
        {appointments.length === 0 ? <RenderNoOppentments /> : <RenderAppointments />}
      </div>
    )
  }

  const updateAvailability = async () => {
    if (to <= from) {
      alert("End time must be greater than start time");
      return;
    }

    try {
      const url = "http://localhost:5000/api/v2/doctor/update-availability";
      const token = localStorage.getItem("token");

      const payload = {
        days: availability.days,
        from,
        to,
      };

      console.log(payload);

      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      message.success("Availability Updated");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update availability");
    }
  };

  const getProfileData2 = async () => {
    const url = "http://localhost:5000/api/v2/doctor/profile";
    const token = localStorage.getItem("token");

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const doctor = res.data.data;

    setDays(doctor.availability?.days ||  ["Mon", "Tue", "Wed", "Thu", "Fri"] );
    setFrom(doctor.availability?.from || "09:00");
    setTo(doctor.availability?.to || "17:00");
  };

  useEffect(() => {
    getDoctorAppointmentsData();
    getProfileData2();
    getProfileData();
    console.log(availability);
    // renderData();
  }, []);

  const updateStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <>
      <AdminandDoctornavbar />

      <div className="p-6">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>
          <div className="flex gap-3 ml-4 ">
            <h1 className="font-bold">Doctor Name : {profile.name} </h1>
            <h2 className="font-bold">
              {" "}
              Specialization : {profile.specialization}{" "}
            </h2>
            <h3 className="font-bold">
              {" "}
              Experience : {profile.experience} years{" "}
            </h3>
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded mb-6">
          <div className="card">
            <h3>Availability</h3>

            {!editMode ? (
              <>
                <p>
                  {days.join(" – ")} | {from} – {to}
                </p>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Available Days</h3>
                </div>

                <button className='bg-blue-500 w-[100px] h-[30px] mt-3 text-white  rounded' onClick={() => setEditMode(true)}>
                  Edit  
                </button>
              </>
            ) : (
              <>
                <div>
                  <label>From:</label>
                  <input
                    type="time"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>

                <div>
                  <label>To:</label>
                  <input
                    type="time"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {ALL_DAYS.map((day) => {
                    const active = availability.days.includes(day);

                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded border
                        ${active ? "bg-green-600 text-white" : "bg-gray-200"}
                      `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <button className='bg-blue-500 w-[100px] h-[30px] mt-3 text-white  rounded' onClick={updateAvailability}>Save  </button>
              </>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">Appointments</h3>
        <div> 
         {showLoader ? <RenderLoader /> : <RenderRes />}

        </div>

        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-bold mb-2">Doctor Notes</h3>
          <textarea
            className="border w-full p-2 rounded"
            placeholder="Observations / Diagnosis / Prescription"
          />
          <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded">
            Save Notes
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
