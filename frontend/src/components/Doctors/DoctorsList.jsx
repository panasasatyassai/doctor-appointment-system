import DoctorCard from "./DoctorCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const DoctorsList = ({ onDoctorSelect }) => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

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

      setShowLoader(false);
      const arr = res.data.data;

      const updatedAllDoctorsList = arr.map((eachDoctor) => ({
        id: eachDoctor._id,
        name: eachDoctor.name,
        specialization: eachDoctor.specialization,
        experience: eachDoctor.experience,
        availability: eachDoctor.availability || null,
      }));

      setDoctorsData(updatedAllDoctorsList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const DoctorsList = ({ onDoctorSelect }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctorsData.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={onDoctorSelect}
          />
        ))}
      </div>
    );
  };

  const RenderLoader = () => {
    return (
      <div className="flex flex-col justify-center items-center h-[400px] gap-4">
        <ThreeDots
          height="70"
          width="70"
          radius="9"
          color="#2563eb"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  };

  const RenderNoDoctors = () => {
    return (
      <div className="flex flex-col justify-center items-center h-[350px] bg-white rounded-xl shadow-sm border">
        <h1 className="text-lg font-semibold text-slate-700">
          No doctors available
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Please check back later or try again soon.
        </p>
      </div>
    );
  };

  const RenderRes = () => {
    return (
      <div className="mt-4">
        {doctorsData.length === 0 ? (
          <RenderNoDoctors />
        ) : (
          <DoctorsList onDoctorSelect={onDoctorSelect} />
        )}
      </div>
    );
  };

  return <>{showLoader ? <RenderLoader /> : <RenderRes />}</>;
};

export default DoctorsList;
