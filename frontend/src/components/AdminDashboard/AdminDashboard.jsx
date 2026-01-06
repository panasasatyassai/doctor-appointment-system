// import Navbar from "../Navbar/Navbar";
// import Navbar3 from "../LogHomeNavbar/Navbar3";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import Modal from "react-modal";
import { IoMdAddCircle } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";
import { FiInfo } from "react-icons/fi";

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

let allTotalDoctors = [];

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
      allTotalDoctors = updatedAllDoctorsList;
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
        console.log(res.data);
        // console.log("Doc : ", error.response.data.message);
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
        console.log(e.response);
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
    const [searchName, setSearchName] = useState("");
    const [filterSpecialization, setFilterSpecialization] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredDoctors = allTotalDoctors.filter((doc) => {
      const matchName =
        searchName === "" ||
        doc.name.toLowerCase().includes(searchName.toLowerCase());

      const matchSpecialization =
        filterSpecialization === "" ||
        doc.specialization === filterSpecialization;

      const matchStatus = filterStatus === "" || doc.status === filterStatus;

      return matchName && matchSpecialization && matchStatus;
    });
    return (
      <>
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium text-slate-600">
                Specialization
              </label>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="block h-10 px-3 mt-1 rounded-md border border-slate-300"
              >
                <option value="">All</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="ENT">ENT</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block h-10 px-3 mt-1 rounded-md border border-slate-300"
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <input
            type="search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search doctor..."
            className="h-10 px-4 rounded-full border border-slate-300 w-[240px]"
          />
        </div>
        <div>
          {filteredDoctors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
              {!filterSpecialization && !filterStatus && !searchName && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiInfo className="text-blue-600 text-xl" />
                    </div>

                    <div>
                      <p className="text-slate-800 font-medium">
                        No filters applied
                      </p>
                      <p className="text-slate-500 text-sm">
                        Showing all doctors. Use filters to narrow down results.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    All Records
                  </span>
                </div>
              )}

              {(filterSpecialization || filterStatus || searchName) && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Filters applied:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {filterSpecialization && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Specialization: {filterSpecialization}
                      </span>
                    )}

                    {filterStatus && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Status: {filterStatus}
                      </span>
                    )}

                    {searchName && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        Search: {searchName}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
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
                  {filteredDoctors.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td
                        className={`w-2 ${
                          doc.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></td>

                      <td className="p-4 font-medium text-slate-800">
                        {doc.name}
                      </td>

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
                            onClick={() =>
                              updateDoctorStatus(doc.id, "approved")
                            }
                            className="text-green-600 hover:text-green-800 font-semibold"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateDoctorStatus(doc.id, "rejected")
                            }
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
          )}
        </div>
      </>
    );
  };

  const RenderAllAppointments = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mt-3">
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
