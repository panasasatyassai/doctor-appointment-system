import DoctorCard from "./DoctorCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { FiArrowUp, FiSearch } from "react-icons/fi";

const DoctorsList = ({ onDoctorSelect }) => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [allDoctorsData, setAllDoctorsData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [userBookedDoctorIds, setUserBookedDoctorIds] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const fetchUserBookedDoctorsToday = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/patient-appointments",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("DATA", res.data);
      const todaysAppointments = res.data.data.filter(
        (appt) => appt.date === today,
      );
      setUserBookedDoctorIds(todaysAppointments.map((a) => a.doctorId._id));
    } catch (err) {
      console.log(err);
    }
  };

  const checkDoctorAvailabilityFromBackend = async (doctorId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/appointment/doctor-availability",
        {
          params: { doctorId, date: today },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data?.data?.isFullyBooked || false;
    } catch {
      return false;
    }
  };

  const fetchDoctors = async () => {
    try {
      setShowLoader(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://doctor-appointment-system-1-rlfr.onrender.com/api/v2/doctor/get-all-doctors2",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updated = await Promise.all(
        res.data.data.map(async (d) => ({
          id: d._id,
          name: d.name,
          specialization: d.specialization,
          experience: d.experience,
          availability: d.availability || null,
          isBookedByUserToday: userBookedDoctorIds.includes(d._id),
          isDoctorFullyBookedToday: await checkDoctorAvailabilityFromBackend(
            d._id,
          ),
        })),
      );

      setAllDoctorsData(updated);
      setDoctorsData(updated);
      setShowLoader(false);
    } catch (e) {
      console.log(e);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchUserBookedDoctorsToday();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [userBookedDoctorIds]);

  useEffect(() => {
    let filtered = allDoctorsData;

    if (activeFilter !== "All") {
      filtered = filtered.filter((d) => d.specialization === activeFilter);
    }

    if (searchText) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    setDoctorsData(filtered);
  }, [activeFilter, searchText, allDoctorsData]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FilterButton = ({ label }) => (
    <button
      onClick={() => setActiveFilter(label)}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition
        ${
          activeFilter === label
            ? "bg-white text-indigo-700 shadow"
            : "bg-indigo-500/30 text-white hover:bg-indigo-500/40"
        }`}
    >
      {label}
    </button>
  );

  if (showLoader) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <ThreeDots color="#4f46e5" height={70} width={70} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 lg:px-10 pb-20 bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-100">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-slate-800">Our Doctors</h1>
        <p className="text-slate-600 mt-1">
          Choose from our experienced and verified doctors
        </p>
      </div>

      {showScrollTop && (
        <div className="sticky top-[70px] z-40 flex justify-end mb-6">
          <div className="relative w-full max-w-sm backdrop-blur-xl bg-white/90 border border-slate-200 shadow-xl rounded-2xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search doctor by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-transparent text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}

      <div className="mb-12 rounded-3xl p-6 shadow-lg backdrop-blur-xl bg-white/60 border border-indigo-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Filter Doctors
            </h2>
            <p className="text-sm text-slate-600">
              Available Monday to Friday (09:00 – 17:00)
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search doctor by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <FilterButton label="All" />
          <FilterButton label="ENT" />
          <FilterButton label="Orthopedic" />
          <FilterButton label="Dermatology" />
          <FilterButton label="Cardiology" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {doctorsData.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={onDoctorSelect}
          />
        ))}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg"
        >
          <FiArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default DoctorsList;
