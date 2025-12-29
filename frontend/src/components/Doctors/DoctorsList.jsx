import DoctorCard from "./DoctorCard";
//import doctorsData from "../../data/doctorsData";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

 


const DoctorsList = ({ onDoctorSelect }) => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

   //const available = isDoctorAvailable(doctor.availability);

  const fetchDoctors = async () => {
    try {
      setShowLoader(true);
      const token = localStorage.getItem("token");
      const url = "http://localhost:5000/api/v2/doctor/get-all-doctors";
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowLoader(false);
      const arr = res.data.data;
      //console.log(arr);
      const updatedAllDoctorsList = arr.map((eachDoctor) => ({
        id: eachDoctor._id,
        name: eachDoctor.name,
        specialization: eachDoctor.specialization,
        experience: eachDoctor.experience,
        availability: eachDoctor.availability ||  null 
      }));
      //console.log(updatedAllDoctorsList)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      {showLoader ? (
        <RenderLoader />
      ) : (
        <DoctorsList onDoctorSelect={onDoctorSelect} />
      )}
    </>
  );
};

export default DoctorsList;
