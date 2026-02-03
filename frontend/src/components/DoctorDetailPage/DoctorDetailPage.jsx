import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiStar,
  FiDollarSign,
  FiUser,
  FiBookOpen,
  FiGlobe,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const formatTime12Hour = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h === 0 ? 12 : h; // 0 -> 12

  return `${h}:${minutes} ${ampm}`;
};

const isDoctorAvailable = (availability) => {
  if (!availability) return false;
  if (!availability.days || availability.days.length === 0) return false;
  if (!availability.from || !availability.to) return false;
  return true;
};

const isDoctorAvailableNow = (availability) => {
  if (!availability) return false;
  const { days, from, to } = availability;
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getDay()];
  if (!days.includes(today)) return false;

  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);

  const fromTime = new Date();
  fromTime.setHours(fh, fm, 0, 0);
  const toTime = new Date();
  toTime.setHours(th, tm, 0, 0);

  return now >= fromTime && now <= toTime;
};

const getNextAvailableDay = (days) => {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const nextDay = week[(todayIndex + i) % 7];
    if (days.includes(nextDay)) return nextDay;
  }
  return null;
};

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);

  // const hasAvailability = isDoctorAvailable(doctor.availability);
  // const isAvailableNow = isDoctorAvailableNow(doctor.availability);
  // const nextDay = getNextAvailableDay(doctor.availability?.days || []);

  console.log("id : ", id);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v2/doctor/get-doctor/${id}`,
      );
      const resData = res.data.data;
      const updatedData = {
        name: resData.name,
        specialization: resData.specialization,
        experience: resData.experience,
        rating: resData.rating,
        totalPatients: resData.totalPatients,
        consultationFee: resData.consultationFee,
        clinicAddress: resData.clinicAddress,
        bio: resData.bio,
        about: resData.about,
        education: resData.education,
        languages: resData.languages,
        availability: {
          days: resData.availability.days,
          from: resData.availability.from,
          to: resData.availability.to,
          breakTime: resData.availability.breaks,
        },
      };
      console.log("Updated data3 : ", updatedData.availability);
      setDoctor(updatedData);
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!doctor) return;
    const fetchRelatedDoctors = async () => {
      const url = "http://localhost:5000/api/v2/doctor/related-doctors";
      const res = await axios.get(url, {
        params: {
          specialization: doctor.specialization,
          doctorId: id,
        },
      });
      const resData = res.data.data;
      const updatedData = resData.map((each) => ({
        id: each._id,
        name: each.name,
        specialization: each.specialization,
        experience: each.experience,
      }));
      console.log(updatedData);
      setRelatedDoctors(updatedData);
    };
    fetchRelatedDoctors();
  }, [doctor]);

  //  const relatedDoctors = [
  //   { id: 1, name: "Dr Rajiv Menon", experience: 11, specialization: "Cardiology" },
  //   { id: 2, name: "Dr Amit Sharma", experience: 9, specialization: "Neurology" },
  //   { id: 3, name: "Dr Neha Kapoor", experience: 7, specialization: "Dermatology" },
  // ];

  console.log("doc", doctor);

  if (!doctor) return <h1>Loading</h1>;

  return (
    <>
      <LogHomeNavbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-100 px-6 lg:px-16 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {doctor.name?.charAt(0)}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800">
                {doctor.name}
              </h1>
              <p className="text-indigo-600 font-semibold mt-1">
                {doctor.specialization}
              </p>
              <p className="text-slate-500 mt-1">{doctor.bio}</p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  {doctor.rating} Rating
                </span>
                {/* <span className="flex items-center gap-1">
                  <FiUser className="text-emerald-500" />
                  {doctor.totalPatients}+ Patients
                </span> */}
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-rose-500" />
                  {doctor.clinicAddress}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow hover:scale-105 transition">
                  Book Appointment
                </button>

                <span className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-semibold">
                  <FiDollarSign />₹{doctor.consultationFee}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              About Doctor
            </h2>
            <p className="text-slate-600 leading-relaxed">{doctor.about}</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FiBookOpen className="text-indigo-500" />
                Education
              </h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {doctor.education.map((edu, i) => (
                  <li key={i}>{edu}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FiGlobe className="text-emerald-500" />
                Languages Spoken
              </h3>
              <div className="flex gap-2 flex-wrap">
                {doctor.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Availability
            </h2>

            <div className="space-y-4 text-slate-600">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-indigo-500" />
                {doctor.availability.days.join(", ")}
              </div>

              <div className="flex items-center gap-2">
                <FiClock className="text-emerald-500" />
                {formatTime12Hour(doctor.availability.from)} –{" "}
                {formatTime12Hour(doctor.availability.to)}
              </div>

              {/* <div className="flex items-center gap-2">
                <FiClock className="text-rose-500" />
                Break: {doctor.availability.breakTime}
              </div> */}

              {doctor.availability?.breakTime?.length > 0 ? (
                doctor.availability.breakTime.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FiClock className="text-rose-500" />
                    Break: {formatTime12Hour(b.from)} – {formatTime12Hour(b.to)}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <FiClock className="text-slate-400" />
                  No Break
                </div>
              )}

              <div className="pt-4">
                <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {doctor.experience}+ Years Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Related Doctors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {doc.name.charAt(0)}
                </div>

                <h3 className="text-lg font-bold text-slate-800">{doc.name}</h3>

                <p className="text-indigo-600 text-sm font-medium">
                  {doc.specialization}
                </p>

                <p className="text-slate-500 text-sm mt-1">
                  Experience: {doc.experience} years
                </p>

                <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-xl hover:bg-indigo-600 transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetailPage;
