import DoctorCard from "./DoctorCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

let allDoctorsData1 = null;

const DoctorsList = ({ onDoctorSelect }) => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchDoctors = async () => {
    try {
      setShowLoader(true);
      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/get-all-doctors2";
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
        experience: eachDoctor.experience,
        availability: eachDoctor.availability || null,
      }));

      allDoctorsData1 = updatedAllDoctorsList;
      setDoctorsData(updatedAllDoctorsList);
      setShowLoader(false);
    } catch (e) {
      console.log(e);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onClickAll = () => {
    setActiveFilter("All");
    setDoctorsData(allDoctorsData1);
  };

  const onClickEnt = () => {
    setActiveFilter("ENT");
    setDoctorsData(
      allDoctorsData1.filter((each) => each.specialization === "ENT")
    );
  };

  const onClickOrthopedic = () => {
    setActiveFilter("Orthopedic");
    setDoctorsData(
      allDoctorsData1.filter((each) => each.specialization === "Orthopedic")
    );
  };

  const onClickDermatology = () => {
    setActiveFilter("Dermatology");
    setDoctorsData(
      allDoctorsData1.filter((each) => each.specialization === "Dermatology")
    );
  };

  const onClickCardiology = () => {
    setActiveFilter("Cardiology");
    setDoctorsData(
      allDoctorsData1.filter((each) => each.specialization === "Cardiology")
    );
  };

  const FilterButton = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition
        ${
          activeFilter === label
            ? "bg-blue-600 text-white shadow"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
    >
      {label}
    </button>
  );

  const DoctorsGrid = () => (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Filter by Specialization
        </h2>
        <p className="text-sm text-gray-500">
          Showing doctors available Monday to Friday (09:00 – 17:00)
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <FilterButton label="All" onClick={onClickAll} />
        <FilterButton label="ENT" onClick={onClickEnt} />
        <FilterButton label="Orthopedic" onClick={onClickOrthopedic} />
        <FilterButton label="Dermatology" onClick={onClickDermatology} />
        <FilterButton label="Cardiology" onClick={onClickCardiology} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctorsData.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={onDoctorSelect}
          />
        ))}
      </div>
    </>
  );

  const RenderLoader = () => (
    <div className="flex justify-center items-center h-[400px]">
      <ThreeDots color="#2563eb" height={70} width={70} />
    </div>
  );

  const RenderNoDoctors = () => (
    <div className="flex flex-col justify-center items-center h-[350px] bg-white rounded-2xl shadow-sm border border-gray-200 px-6">
      <div className="mb-4">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 14.99 3 13.53 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-gray-800">No doctors found</h1>

      <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
        We’re working on making doctors available for booking. Please visit
        again soon.
      </p>
    </div>
  );

  const RenderRes = () => (
    <div className="mt-4">
      {doctorsData.length === 0 ? <RenderNoDoctors /> : <DoctorsGrid />}
    </div>
  );

  return <>{showLoader ? <RenderLoader /> : <RenderRes />}</>;
};

export default DoctorsList;
