// import Navbar from "../Navbar/Navbar";
// import Navbar3 from "../LogHomeNavbar/Navbar3";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import Modal from "react-modal";
import { IoMdAddCircle } from "react-icons/io";

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
  const [patients , setpatients] = useState([])

  const openModel = () => {
    setIsOpen(true);
  };

  const closeModel = () => {
    setIsOpen(false);
  };

  // sample data
  const stats = {
    doctors: 3,
    patients: 42,
    appointments: 120,
  };

  // const doctors = [
  //   {
  //     id: 1,
  //     name: "Dr. Ramesh",
  //     specialization: "Cardiology",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Dr. Suman",
  //     specialization: "Dermatology",
  //     status: "Pending",
  //   },
  // ];

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
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/v2/admin/update-doctor-status",
      { doctorId, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success(`Doctor ${status}`);
    fetchDoctors(); 
  } catch (err) {
    message.error("Failed to update status");
  }
};


  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/get-all-doctors";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
       console.log(newDoctor)

      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/apply-doctor";
      const res = await axios.post(url, newDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data) 
      fetchDoctors();
      if (res.data.success === true) {
        message.success(res.data.message);
        // if required use navigation later ...
      } else {
        message.error(res.data.message);
      }

      setDoctorName("");
      setSpecialization("");
      setExperience("");
    }
  };

  const fetchPatients = async () => {
    const url = "http://localhost:5000/api/v2/admin/get-all-appointments";
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data) 
      if (res.data.success){
        let arr = res.data.data
        console.log(arr)
        const updatedData = arr.map(each => ({
          id : each._id ,patient : each.patientId.name ,
            doctor : each.doctorId.name , date : each.date , status : each.status 
        }))
         setpatients(updatedData)
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const appointments = [
    {
      id: 1,
      patient: "Anil",
      doctor: "Dr. Ramesh",
      date: "2025-01-20",
      status: "Approved",
    },
    {
      id: 2,
      patient: "Neha",
      doctor: "Dr. Suman",
      date: "2025-01-21",
      status: "Pending",
    },
  ];

  return (
    <>
      <AdminandDoctornavbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-h-[400px] overflow-y-auto">
          <div className="bg-white shadow p-4 rounded">
            <h3>Total Doctors</h3>
            <p className="text-2xl font-bold">{doctors.length}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h3>Total Patients</h3>
            <p className="text-2xl font-bold">{patients.length}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <h3>Total Appointments</h3>
            <p className="text-2xl font-bold">{patients.length}</p>
          </div>
        </div>

        {/* Doctors */}
        <div className="flex gap-4 justify-between">
          <h3 className="text-xl font-bold mb-3">Manage Doctors</h3>
          <div className="m-2 flex gap-3">
            <button
              onClick={openModel}
              className="bg-blue-500 w-[125px] h-[32px] border-0 rounded text-white flex gap-2 p-1"
            >
              <IoMdAddCircle className="h-[20px]" /> Add Doctor
            </button>
            <Modal
              isOpen={modelIsOpen}
              onRequestClose={closeModel}
              contentLabel="Example Model"
              style={customStyles}
            >
              <div className="">
                <h1 className="text-center font-bold text-[25px]">
                  Add a Doctor
                </h1>
                <div className="flex flex-cols justify-center items-center mt-3">
                  <form onSubmit={onSubmitDoctordetails}>
                    <input
                      onChange={onChangeDoctorName}
                      value={name}
                      type="text"
                      required
                      placeholder="Enter Doctor Name"
                      className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
                    />{" "}
                    <br />
                    <input
                      onChange={onChangeSpecialization}
                      value={specialization}
                      type="text"
                      required
                      placeholder="Enter Doctor specialization"
                      className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
                    />{" "}
                    <br />
                    <input
                      onChange={onChangeExperience}
                      value={experience}
                      type="text"
                      required
                      placeholder="Enter Doctor experience"
                      className="bg-amber-100 m-3 w-[300px] h-[45px] pl-3"
                    />{" "}
                    <br />
                    <button
                      type="submit"
                      className="w-[300px] h-[45px] bg-blue-500 m-3 rounded text-white w-[90px] h-[40px]"
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
          </div>
        </div>
        <table className="w-full bg-white shadow rounded mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="text-center">
                <td className="p-2">{doc.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.status}</td>
                <td>
                  <div className="flex gap-3 justify-center items-center">
                    {" "}
                    <button
                      // onClick={() =>
                      //   updateStatus(appt.id, "Approved")
                      // }
                       onClick={() => updateDoctorStatus(doc.id, "approved")}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      // onClick={() =>
                      //   updateStatus(appt.id, "Rejected")
                      // }
                       onClick={() => updateDoctorStatus(doc.id, "rejected")}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Appointments */}
        <h3 className="text-xl font-bold mb-3">All Appointments</h3>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((appt) => (
              <tr key={appt.id} className="text-center">
                <td className="p-2">{appt.patient}</td>
                <td>{appt.doctor}</td>
                <td>{appt.date}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
