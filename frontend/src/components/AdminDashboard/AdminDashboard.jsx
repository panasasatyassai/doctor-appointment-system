// import Navbar from "../Navbar/Navbar";
// import Navbar3 from "../LogHomeNavbar/Navbar3";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import Modal from "react-modal";
import { IoMdAddCircle } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";

const customStyles = {
  content: {
    top: "50%",
    width: "500px",
    height: "500px",
    left: "50%",
    right: "auto",
    bottom: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const AdminDashboard = () => {
  const [modelIsOpen, setIsOpen] = useState(false);
  const [name, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setpatients] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const openModel = () => {
    setIsOpen(true);
  };

  const closeModel = () => {
    setIsOpen(false);
  };

  const onChangeDoctorName = (e) => {
    setDoctorName(e.target.value);
  };

  const onChangeSpecialization = (e) => {
    setSpecialization(e.target.value);
  };

  const onChangeExperience = (e) => {
    setExperience(e.target.value);
  };

  const updateDoctorStatus = async (doctorId, status) => {
    setShowLoader(false);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/v2/admin/update-doctor-status",
        { doctorId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      message.success(`Doctor ${status}`);
      setShowLoader(false);
      fetchDoctors();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const fetchDoctors = async () => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/get-all-doctors";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowLoader(false);
      console.log("All Doctors List : ", res.data);
      const arr = res.data.data;

      const updatedAllDoctorsList = arr.map((eachDoctor) => ({
        id: eachDoctor._id,
        name: eachDoctor.name,
        specialization: eachDoctor.specialization,
        status: eachDoctor.status,
      }));

      setDoctors(updatedAllDoctorsList);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitDoctordetails = async (e) => {
    e.preventDefault();
    if (
      (!name && !specialization && !experience) ||
      parseInt(experience) <= 0
    ) {
      alert("Please Enter Valid Details");
      setExperience("");
    } else {
      const newDoctor = {
        name,
        specialization,
        experience: parseInt(experience),
      };
      console.log(newDoctor);

      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/apply-doctor";
      try {
        const res = await axios.post(url, newDoctor, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Doc : ", error.response.data.message);
        fetchDoctors();
        if (res.data.success === true) {
          message.success(res.data.message);
          // if required use navigation later ...
        } else {
          message.error("ok");
        }
        setDoctorName("");
        setSpecialization("");
        setExperience("");
      } catch (e) {
        message.error(e.response.data.message);
        setDoctorName("");
      }
    }
  };

  const fetchPatients = async () => {
    const url = "http://localhost:5000/api/v2/admin/get-all-appointments";
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      if (res.data.success) {
        let arr = res.data.data;
        //console.log(arr)
        // const updatedData = arr.map((each) => ({
        //   id: each._id,
        //   patient: each.patientId.name,
        //   doctor: each.doctorId.name,
        //   date: each.date,
        //   status: each.status,
        // }));

        const updatedData = arr
          // .filter((each) => each.status === "approved")
          .map((each) => ({
            _id: each._id,
            patient: each.patientId.name,
            doctor: each.doctorId.name,
            date: each.date,
            status: each.status,
          }));
        console.log("ok", updatedData);
        setpatients(updatedData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const RenderAddedDoctors = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-slate-800">
            Manage Doctors
          </h3>
        </div>

        <table className="w-full">
          <thead className="bg-slate-100 text-slate-600 text-sm">
            <tr>
              <th className="w-2"></th>
              <th className="p-4 text-left">Name</th>
              <th className="text-left">Specialization</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr
                key={doc.id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td
                  className={`w-2 ${
                    doc.status === "approved" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></td>

                <td className="p-4 font-medium text-slate-800">{doc.name}</td>

                <td className="text-slate-600">{doc.specialization}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                doc.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                  >
                    {doc.status}
                  </span>
                </td>

                <td className="text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => updateDoctorStatus(doc.id, "approved")}
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateDoctorStatus(doc.id, "rejected")}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const RenderAllAppointments = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-slate-800">
            All Appointments
          </h3>
        </div>

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
                      : "bg-yellow-500"
                  }`}
                ></td>

                <td className="p-4 font-medium text-slate-800">
                  {appt.patient}
                </td>

                <td className="text-slate-600">{appt.doctor}</td>

                <td className="text-center text-slate-600">{appt.date}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                             bg-green-100 text-green-700  ${
                               appt.status === "approved"
                                 ? "bg-green-100 text-green-700"
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
  };

  const RenderAdminHeader = () => {
    return (
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-slate-500">Total Doctors</p>
            <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-slate-500">Total Patients</p>
            <p className="text-3xl font-bold text-green-600">
              {patients.length}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <p className="text-slate-500">Total Appointments</p>
            <p className="text-3xl font-bold text-purple-600">
              {patients.length}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-slate-800">
            Manage Doctors
          </h3>

          <button
            onClick={openModel}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
               text-white px-4 py-2 rounded-lg shadow"
          >
            <IoMdAddCircle className="text-xl" />
            Add Doctor
          </button>
        </div>
      </div>
    );
  };

  const RenderNoDoctorsAdded = () => {
    return (
      <>
        <RenderAdminHeader />
        <div
          className="flex flex-col items-center justify-center
                    h-[60vh] bg-white mb-4 rounded-xl shadow-md"
        >
          <div
            className="w-16 h-16 rounded-full bg-blue-100
                      text-blue-600 flex items-center justify-center
                      text-2xl font-bold mb-4"
          >
            D
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            No Doctors Added
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            You haven’t added any doctors yet.
          </p>

          <p className="text-slate-400 mt-1 text-sm">
            Click <span className="font-medium">“Add Doctor”</span> to get
            started.
          </p>
        </div>
        <RenderAllAppointments />
      </>
    );
  };

  const RenderLoader = () => {
    return (
      <div className="flex justify-center items-center h-screen">
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

  const RenderNoAppointments = () => {
    return (
      <div
        className="flex flex-col items-center justify-center
                 h-[60vh] bg-white rounded-xl shadow-md"
      >
        <div
          className="w-16 h-16 rounded-full bg-purple-100
                   text-purple-600 flex items-center justify-center
                   text-2xl font-bold mb-4"
        >
          A
        </div>

        <h2 className="text-xl font-semibold text-slate-800">
          No Appointments Found
        </h2>

        <p className="text-slate-500 mt-2 text-sm">
          There are no appointments scheduled yet.
        </p>

        <p className="text-slate-400 mt-1 text-sm">
          Appointments will appear once patients start booking.
        </p>
      </div>
    );
  };

  const RenderData = () => {
    return (
      <>
        <RenderAdminHeader />
        <RenderAddedDoctors />
        {patients.length === 0 ? (
          <RenderNoAppointments />
        ) : (
          <RenderAllAppointments />
        )}
      </>
    );
  };

  const RenderRes = () => {
    return (
      <div>
        {doctors.length === 0 ? <RenderNoDoctorsAdded /> : <RenderData />}
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={modelIsOpen}
        onRequestClose={closeModel}
        contentLabel="Example Model"
        style={customStyles}
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <div className="">
          <h1 className="text-center font-bold text-[25px]">Add a Doctor</h1>
          <div className="flex flex-col justify-center items-center mt-3">
            <form onSubmit={onSubmitDoctordetails}>
              <input
                onChange={onChangeDoctorName}
                type="text"
                value={name}
                required
                placeholder="Enter Doctor Name"
                className="bg-slate-100 border border-slate-300 rounded-lg
             px-3 py-2 w-[300px] focus:outline-none
             focus:ring-2 focus:ring-blue-400"
              />{" "}
              <br />
              <br />
              <input
                onChange={onChangeSpecialization}
                value={specialization}
                type="text"
                required
                placeholder="Enter Doctor specialization"
                className="bg-slate-100 border border-slate-300 mt-5  rounded-lg
             px-3 py-2 w-[300px] focus:outline-none
             focus:ring-2 focus:ring-blue-400"
              />{" "}
              <br />
              <input
                onChange={onChangeExperience}
                value={experience}
                type="text"
                required
                placeholder="Enter Doctor experience"
                className="bg-slate-100 border border-slate-300 mt-5 rounded-lg
             px-3 py-2 w-[300px] focus:outline-none
             focus:ring-2 focus:ring-blue-400"
              />
              <br />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-5
                   text-white py-2 rounded-lg shadow"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="text-end mt-[50px]">
            <button
              onClick={closeModel}
              className="bg-blue-500 w-[100px] h-[32px] border-0 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <AdminandDoctornavbar />

      <div className="min-h-screen bg-slate-100 p-6">
        <div>{showLoader ? <RenderLoader /> : <RenderRes />}</div>
      </div>
    </>
  );
};

export default AdminDashboard;
