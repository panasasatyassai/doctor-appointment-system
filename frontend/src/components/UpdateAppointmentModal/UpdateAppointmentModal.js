import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { ThreeDots } from "react-loader-spinner";
import UpdateAppointmentModal from "../components/UpdateAppointmentModal";
import {
  updateAppointment,
  deleteAppointment,
} from "../appointmentApi/appointmentApi";

const Notifications = () => {
  const [appoinments, setAppoinements] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");

  const handleUpdate = async (data) => {
    await updateAppointment(selected._id, data, token);

    setAppointments((prev) =>
      prev.map((a) => (a._id === selected._id ? { ...a, ...data } : a))
    );

    setSelected(null);
  };

  useEffect(() => {
    const getAppoinements = async () => {
      setShowLoader(true);
      try {
        const url =
          "http://localhost:5000/api/v2/appointment/patient-appointments";
        const token = localStorage.getItem("token");
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        const arr = res.data.data;
        console.log(arr);
        const updatedData = arr.map((eachPatient) => ({
          id: eachPatient._id,
          doctorName: eachPatient.doctorId.name,
          date: eachPatient.date,
          time: eachPatient.time,
        }));
        setShowLoader(false);
        setAppoinements(updatedData);
        console.log(updatedData.num);
      } catch (e) {
        console.log(e);
      }
    };
    getAppoinements();
  }, []);
  const data = [
    {
      id: 1,
      content: "You booked an appointment with Dr. Amin Khan for",
      date: "2025-12-21",
      time: "06:48:09",
    },
    {
      id: 2,
      content: "You booked an appointment with Dr. Amin Khan for",
      date: "2025-12-21",
      time: "06:48:09",
    },
  ];

  const RenderNoNotifications = () => {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <h1 className="text-[22px]">No Booked Appointments</h1>
      </div>
    );
  };

  const RenderNotifications = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          {/* Header */}
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                S.No
              </th>
              <th className="border border-gray-300 px-4 py-3 font-semibold">
                Content
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Time
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Update1
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {appoinments.map((item, index) => (
              <tr key={item.id} className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-blue-700">
                  You booked an appointment with {item.doctorName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {item.date}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {item.time}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  <button className="bg-green-500 text-white px-2 rounded">
                    Update
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  <button className="bg-red-500 text-white px-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const RenderRes = () => {
    return (
      <div>
        {appoinments.length === 0 ? (
          <RenderNoNotifications />
        ) : (
          <RenderNotifications />
        )}
      </div>
    );
  };

  const RenderLoader = () => {
    return (
      <div className="flex justify-center items-center h-[500px]">
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
    );
  };

  return (
    <>
      <LogHomeNavbar />
      {showLoader ? <RenderLoader /> : <RenderRes />}
    </>
  );
};

export default Notifications;
