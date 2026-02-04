import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  FiUser,
  FiEdit,
  FiArrowUp,
  FiTrash2,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiX,FiSearch
} from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
const API = import.meta.env.VITE_API_URL;

import { MdOutlineSearchOff } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { message } from "antd";
import {
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
} from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    width: "100%",
    maxWidth: "460px",
    maxHeight: "70vh",
    height: "520px",

    borderRadius: "26px",
    padding: "10px",
    background: "#ffffff",
  },
};

const customStyles2 = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "560px",
    height: "520px",
    borderRadius: "16px",
    padding: "0px",
  },
};

const AdminDashboard = () => {
  const [modelIsOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [name, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const [filterSpec, setFilterSpec] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [editName, setEditName] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editDays, setEditDays] = useState([]);
  const [editFrom, setEditFrom] = useState("");
  const [editTo, setEditTo] = useState("");
  const [editBreaks, setEditBreaks] = useState([{ from: "", to: "" }]);
  const [editStatus, setEditStatus] = useState("approved");

  const token = localStorage.getItem("token");

  const onChangeDoctorName = (e) => {
    setDoctorName(e.target.value);
  };

  const onChangeSpecialization = (e) => {
    setSpecialization(e.target.value.toUpperCase());
  };

  const onChangeExperience = (e) => {
    setExperience(e.target.value);
  };

  const fetchDoctors = async () => {
    setShowLoader(true);
    const res = await axios.get(
      `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/get-all-doctors`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const updated = await Promise.all(
      res.data.data.map(async (doc) => {
        const slotRes = await axios.get(
          `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/admin/doctor-booked-slots/${doc._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        return {
          ...doc,
          bookedSlots: slotRes.data.bookedSlots,
          availableSlots:
            (doc.availability?.totalSlots || 0) - slotRes.data.bookedSlots,
        };
      }),
    );

    setDoctors(updated);
    setShowLoader(false);
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
      const url = `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/apply-doctor`;
      try {
        const res = await axios.post(url, newDoctor, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);

        fetchDoctors();
        if (res.data.success === true) {
          message.success(res.data.message);
          setIsOpen(false);
          // if required use navigation later ...
        } else {
          message.error("ok");
        }
        setDoctorName("");
        setSpecialization("");
        setExperience("");
        setIsOpen(false);
      } catch (e) {
        message.error(e.response.data.message);
        console.log(e.response);
        setDoctorName("");
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSaveDoctor = async () => {
    await axios.post(
      `https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/admin/update-doctor`,
      {
        doctorId: selectedDoctor._id,
        name: editName,
        specialization: editSpecialization,
        status: editStatus,
        availability: {
          days: editDays,
          from: editFrom,
          to: editTo,
          breaks: editBreaks,
        },
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    message.success("Doctor updated successfully");
    setEditModalOpen(false);
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchSpec = filterSpec === "" || doc.specialization === filterSpec;
    const matchStatus = filterStatus === "" || doc.status === filterStatus;
    const matchSearch =
      searchName.trim() === "" ||
      doc.name.toLowerCase().includes(searchName.toLowerCase());
    return matchSpec && matchStatus && matchSearch;
  });

  const openEditModal = (doc) => {
    setSelectedDoctor(doc);
    setEditName(doc.name);
    setEditSpecialization(doc.specialization);
    setEditDays(doc.availability?.days || []);
    setEditFrom(doc.availability?.from || "");
    setEditTo(doc.availability?.to || "");
    setEditBreaks(
      doc.availability?.breaks?.length
        ? doc.availability.breaks
        : [{ from: "", to: "" }],
    );
    setEditStatus(doc.status);
    setEditModalOpen(true);
  };

  if (showLoader) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff1f2]">
        <ThreeDots height="80" width="80" color="#fb7185" />
      </div>
    );
  }

  const total = doctors.length;
  const available = doctors.filter((d) => d.status === "approved").length;
  const unavailable = doctors.filter((d) => d.status === "rejected").length;
  const bookings = doctors.reduce((a, b) => a + b.bookedSlots, 0);

  const onClickClearFilters = () => {
    setFilterSpec("");
    setFilterStatus("");
    setSearchName("");
  };

  const RenderNoDoctors = () => {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 max-w-md w-full text-center border border-slate-200">
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-5 rounded-full text-white text-4xl shadow-lg">
              <FaUserMd />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No Doctors Found
          </h2>

          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            We couldn’t find any doctors matching your selected
            <span className="font-medium text-slate-700">
              {" "}
              filters or search
            </span>
            . Try adjusting filters or add a new doctor.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onClickClearFilters}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              <MdOutlineSearchOff className="text-lg" />
              Clear Filters
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="px-5 flex gap-2 justify-center items-center py-2.5 rounded-xl w-[160px] bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition shadow"
            >
              <IoMdAddCircle /> Add Doctor1
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AdminandDoctornavbar />

      <div className="min-h-screen bg-gradient-to-br from-[#fff1f2] via-[#ecfeff] to-[#fef9c3] p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-rose-600">
              Admin Control Board
            </h1>
            <p className="text-slate-500">Hospital performance overview</p>
          </div>
           
          <button
            onClick={() => setIsOpen(true)} 
            className="bg-rose-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition"
          >
            <IoMdAddCircle /> Add Doctor
          </button>
          
        </div>

        {showScrollTop && (
        <div className="sticky top-[80px] z-40 flex justify-end mb-6">
          <div className="relative w-full max-w-sm backdrop-blur-xl bg-white/90 border border-slate-200 shadow-xl rounded-2xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="search"
              placeholder="Search doctor by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-transparent text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}

         

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="">
            <div className=" sticky top-[110px] h-fit bg-white rounded-3xl shadow-xl p-8 space-y-8">
              <h2 className="text-2xl font-bold text-slate-700">
                Live Analytics
              </h2>

              {[
                {
                  label: "Total Doctors",
                  value: total,
                  icon: <FaUserMd />,
                  color: "bg-emerald-400",
                },
                {
                  label: "Available",
                  value: available,
                  icon: <FaCheckCircle />,
                  color: "bg-teal-400",
                },
                {
                  label: "Unavailable",
                  value: unavailable,
                  icon: <FaTimesCircle />,
                  color: "bg-rose-400",
                },
                {
                  label: "Bookings",
                  value: bookings,
                  icon: <FaCalendarCheck />,
                  color: "bg-violet-400",
                },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${c.color} text-white flex items-center justify-center text-xl`}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-slate-500">{c.label}</p>
                    <p className="text-2xl font-bold text-slate-700">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
              <div>
                <Link
                  to="/admin-dashboard/view-appointments"
                  className="block mt-6 text-center bg-indigo-500 text-white py-3 rounded-xl hover:scale-105 transition"
                >
                  View Appointments →
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="  bg-white/80 backdrop-blur rounded-2xl shadow-md p-5">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Filter Doctors
                </h2>
                <p className="text-sm text-slate-500">
                  Narrow down doctors by specialization, status, or name
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-[200px]">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Specialization
                  </label>
                  <select
                    value={filterSpec}
                    onChange={(e) => setFilterSpec(e.target.value)}
                    className="w-[150px] appearance-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">All Specializations</option>
                    <option value="ENT">ENT</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Cardiology">Cardiology</option>
                  </select>
                </div>

                <div className="w-full sm:w-[180px]">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Availability
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">All Status</option>
                    <option value="approved">Available</option>
                    <option value="rejected">Unavailable</option>
                  </select>
                </div>

                <div className="w-full relative">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Search Doctor
                  </label>
                  <input
                    type="search"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <svg
                    className="absolute right-3 top-9 h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              {filteredDoctors.length === 0 ? (
                <RenderNoDoctors />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {" "}
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
                    >
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(doc)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition"
                      >
                        <FiEdit className="text-rose-600 text-lg" />
                      </button>

                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {doc.specialization}
                        </p>
                      </div>

                      {/* Info */}
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-[70px_1fr]">
                          <span className="font-medium text-slate-600">
                            Days
                          </span>
                          <span className="text-slate-700">
                            {doc.availability?.days?.join(", ") || "—"}
                          </span>
                        </div>

                        <div className="grid grid-cols-[70px_1fr]">
                          <span className="font-medium text-slate-600">
                            Time
                          </span>
                          <span className="text-slate-700">
                            {doc.availability?.from} – {doc.availability?.to}
                          </span>
                        </div>

                        <div className="grid grid-cols-[70px_1fr] items-start">
                          <span className="font-medium text-slate-600">
                            Breaks
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {doc.availability?.breaks?.length ? (
                              doc.availability.breaks.map((b, i) => (
                                <span
                                  key={i}
                                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {b.from} – {b.to}
                                </span>
                              ))
                            ) : (
                              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-medium">
                                No doctor break
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Spacer */}
                      <div className="flex-grow" />

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                        <div className="bg-sky-50 border border-sky-100 text-sky-700 px-3 py-2 rounded-xl text-center">
                          <p className="text-xs text-sky-500">Booked slots</p>
                          <p className="text-lg font-semibold">
                            {doc.bookedSlots}
                          </p>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 text-amber-700 px-3 py-2 rounded-xl text-center">
                          <p className="text-xs text-amber-500">
                            Remaining slots
                          </p>
                          <p className="text-lg font-semibold">
                            {doc.availableSlots}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div
                        className={`mt-4 text-center py-2 rounded-full text-sm font-semibold ${
                          doc.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {doc.status === "approved"
                          ? "Available"
                          : "Unavailable"}
                      </div>
                    </div>
                  ))}{" "}
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-rose-500 text-white p-3 rounded-full shadow-lg"
        >
          <FiArrowUp />
        </button>
      )}

      <Modal
        isOpen={modelIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        ariaHideApp={false}
        overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] flex items-center justify-center"
      >
        <div className="bg-white rounded-3xl w-full shadow-2xl border border-slate-100 flex flex-col">
          <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-t-3xl">
            <h2 className="text-xl font-bold text-white text-center">
              Add New Doctor
            </h2>
            <p className="text-sm text-rose-100 text-center">
              Enter doctor basic details
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-5 w-9 h-9 rounded-full bg-white/30 backdrop-blur hover:bg-white/50 text-white flex items-center justify-center transition shadow"
            >
              <FiX size={18} />
            </button>
          </div>

          <form onSubmit={onSubmitDoctordetails}>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
                  Doctor Name
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    onChange={onChangeDoctorName}
                    placeholder="Enter doctor name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                  <FiUser className="absolute left-3 top-3 text-rose-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 uppercase tracking-wide">
                  Specialization
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    onChange={onChangeSpecialization}
                    placeholder="ENT, Cardiology..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-pink-400 outline-none"
                  />
                  <FiBriefcase className="absolute left-3 top-3 text-pink-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Experience
                </label>
                <div className="relative mt-1">
                  <input
                    required
                    type="text"
                    onChange={onChangeExperience}
                    placeholder="Eg: 5 years"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <FiClock className="absolute left-3 top-3 text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 rounded-b-3xl">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        style={customStyles2}
        ariaHideApp={false}
        overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] flex items-center justify-center"
      >
        <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col h-full">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl flex-shrink-0">
            <h2 className="text-xl font-bold text-white text-center">
              Edit Doctor Profile
            </h2>
            <p className="text-sm text-indigo-100 text-center mt-1">
              Manage doctor details and availability
            </p>
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-5 w-9 h-9 rounded-full bg-white/30 backdrop-blur hover:bg-white/50 text-white flex items-center justify-center transition shadow"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Doctor name
              </label>
              <div className="relative mt-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Enter doctor name"
                />
                <FiUser className="absolute left-3 top-3 text-indigo-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Specialization
              </label>
              <div className="relative mt-1">
                <input
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="ENT, Cardiology..."
                />
                <FiBriefcase className="absolute left-3 top-3 text-indigo-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Available days
              </label>
              <div className="relative mt-1">
                <input
                  value={editDays.join(", ")}
                  onChange={(e) =>
                    setEditDays(e.target.value.split(",").map((d) => d.trim()))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Mon, Tue, Wed"
                />
                <FiCalendar className="absolute left-3 top-3 text-indigo-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Working hours
              </label>
              <div className="mt-1 flex gap-3">
                <div className="relative w-1/2">
                  <input
                    type="time"
                    value={editFrom}
                    onChange={(e) => setEditFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400"
                  />
                  <FiClock className="absolute left-3 top-3 text-indigo-400" />
                </div>

                <div className="relative w-1/2">
                  <input
                    type="time"
                    value={editTo}
                    onChange={(e) => setEditTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-400"
                  />
                  <FiClock className="absolute left-3 top-3 text-indigo-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Break timings
              </label>

              {editBreaks.map((b, i) => (
                <div
                  key={i}
                  className="mt-2 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-2"
                >
                  <input
                    type="time"
                    value={b.from}
                    onChange={(e) => {
                      const arr = [...editBreaks];
                      arr[i].from = e.target.value;
                      setEditBreaks(arr);
                    }}
                    className="w-1/2 rounded-lg border border-slate-300 px-3 py-2"
                  />
                  <input
                    type="time"
                    value={b.to}
                    onChange={(e) => {
                      const arr = [...editBreaks];
                      arr[i].to = e.target.value;
                      setEditBreaks(arr);
                    }}
                    className="w-1/2 rounded-lg border border-slate-300 px-3 py-2"
                  />
                  <button
                    onClick={() =>
                      setEditBreaks(editBreaks.filter((_, idx) => idx !== i))
                    }
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setEditBreaks([...editBreaks, { from: "", to: "" }])
                }
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
              >
                <FiPlusCircle className="text-lg" />
                Add another break
              </button>
            </div>

            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Doctor availability
                </p>
                <p className="text-xs text-emerald-600">Toggle active status</p>
              </div>

              <button
                onClick={() =>
                  setEditStatus(
                    editStatus === "approved" ? "rejected" : "approved",
                  )
                }
                className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
                  editStatus === "approved" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              >
                <span
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition ${
                    editStatus === "approved"
                      ? "translate-x-7"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-slate-50 rounded-b-2xl flex-shrink-0">
            <button
              onClick={onSaveDoctor}
              disabled={!editName || !editSpecialization}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg transition"
            >
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboard;
