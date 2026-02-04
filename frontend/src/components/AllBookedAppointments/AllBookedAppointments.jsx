import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { Link } from "react-router-dom";
 

let allAppointmentsData = null;

const AllBookedAppointments = () => {
  const [patients, setPatients] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");

  const fetchPatients = async () => {
    setShowLoader(true);
    const url = "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/admin/get-all-appointments";
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const updatedData = res.data.data.map((each) => ({
          _id: each._id,
          patient: each.patientId.name,
          doctor: each.doctorId.name,
          date: each.date,
          status: each.status,
        }));

        allAppointmentsData = updatedData;
        setPatients(updatedData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const RenderLoader = () => (
    <div className="flex justify-center items-center h-screen">
      <ThreeDots height="80" width="80" color="#4fa94d" />
    </div>
  );

  const RenderNoAppointments = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-slate-800">
        No Appointments Found
      </h2>
    </div>
  );

  const RenderAllBookedAppointments = () => (
    <div className="bg-white rounded-xl shadow-md overflow-auto mt-3 p-4">
      <table className="w-full">
        <thead className="bg-slate-100 text-slate-600 text-sm">
          <tr>
            <th className="w-2"></th>
            <th className="p-4 text-left">Patient</th>
            <th className="text-left">Doctor</th>
            <th className="text-center">Date</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((appt) => (
            <tr
              key={appt._id}
              className="border-b hover:bg-slate-50 transition"
            >
              <td
                className={`w-2 ${
                  appt.status === "approved"
                    ? "bg-green-500"
                    : appt.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></td>

              <td className="p-4 font-medium text-slate-800">{appt.patient}</td>
              <td className="text-slate-600">{appt.doctor}</td>
              <td className="text-center text-slate-600">{appt.date}</td>

              <td className="text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      appt.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {appt.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const RenderRes = () =>
    patients.length === 0 ? (
      <RenderNoAppointments />
    ) : (
      <RenderAllBookedAppointments />
    );

  const onClickPending = () => {
    setActiveFilter("pending");
    setPatients(allAppointmentsData.filter((e) => e.status === "pending"));
  };

  const onClickApproved = () => {
    setActiveFilter("approved");
    setPatients(allAppointmentsData.filter((e) => e.status === "approved"));
  };

  const onClickReject = () => {
    setActiveFilter("rejected");
    setPatients(allAppointmentsData.filter((e) => e.status === "rejected"));
  };

  const onClearFilters = () => {
    setActiveFilter("");
    setPatients(allAppointmentsData);
  };

  return (
    <>
      <AdminandDoctornavbar />
      <h1 className="text-2xl font-bold text-center m-6">
        All Booked Appointments
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-sm m-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">
          Filter Appointments
        </h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-slate-300 hover:bg-slate-100"
          >
             All 
          </button>

          <button
            onClick={onClickPending}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            Pending
          </button>

          <button
            onClick={onClickApproved}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "approved"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            Approved
          </button>

          <button
            onClick={onClickReject}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {showLoader ? <RenderLoader /> : <RenderRes />}

      <div className="m-5 sticky bottom-5 left-5">
        <Link to="/admin-dashboard">
          <button className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600">
            Back
          </button>
        </Link>
      </div>
    </>
  );
};

export default AllBookedAppointments;
