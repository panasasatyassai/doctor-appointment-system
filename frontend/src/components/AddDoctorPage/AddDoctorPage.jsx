import { useState  } from "react";
import AdminandDoctornavbar from "../AdminandDoctornavbar/AdminandDoctornavbar";
import { FiMapPin, FiStar, FiClock, FiBook, FiUser , FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { message } from "antd";
 
 

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const initialFormState = {
  name: "",
  specialization: "",
  experience: "",
  bio: "",
  about: "",
  education: "",
  languages: "",
  clinicAddress: "",
  consultationFee: "",
  days: [],
  from: "",
  to: "",
  breakFrom: "",
  breakTo: "",
};

const AddDoctorPage = () => {
  const [form, setForm] = useState(initialFormState);

   


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      education: form.education.split(","),
      languages: form.languages.split(","),
      availability: {
        days: form.days,
        from: form.from,
        to: form.to,
        breaks: [{ from: form.breakFrom, to: form.breakTo }],
      },
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/v2/doctor/apply-doctor",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      message.success(res.data.message);
      setForm(initialFormState);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <AdminandDoctornavbar />

      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 px-10 py-10">
        <div className="max-w-7xl mx-auto">
           
          <div className="sticky top-[72px] z-20 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-100 backdrop-blur-md border-b border-slate-200 py-4 mb-8">
            <div className="max-w-7xl mx-auto px-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Add New Doctor
              </h1>
              <p className="text-slate-500 mt-1">
                Create a doctor profile and assign availability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {!form.name ? (
              <div className="sticky top-[160px] bg-white rounded-3xl shadow-xl h-[520px] flex flex-col items-center justify-center text-center">
                <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-5xl text-indigo-600 mb-4">
                  <FiUser />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">
                  No Doctor Details Yet
                </h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Fill the form to see a live preview of the doctor profile.
                </p>
              </div>
            ) : (
              <div className="sticky top-[160px] bg-white rounded-3xl shadow-xl p-8 h-[600px]">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {form.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {form.name}
                    </h2>
                    <p className="text-indigo-600 font-semibold">
                      {form.specialization}
                    </p>
                    <p className="text-sm text-slate-500">
                      {form.experience} years experience
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">{form.about}</p>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-indigo-500" />
                    {form.clinicAddress || "Clinic address not set"}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock className="text-indigo-500" />
                    {form.from} – {form.to}
                    {form.breakFrom &&
                      ` (Break ${form.breakFrom}-${form.breakTo})`}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    Rating calculated from patients
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                    <FiBook className="text-indigo-500" />
                    Education
                  </h4>
                  <p className="text-slate-600">{form.education}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700">Languages</h4>
                  <p className="text-slate-600">{form.languages}</p>
                </div>

                <div className="mt-6 text-indigo-600 font-bold text-lg">
                  Consultation Fee: ₹{form.consultationFee}
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Available Days
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {form.days.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

             
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Doctor Information
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Enter doctor profile details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Section title="Basic Info">
                  <Input
                    label="Doctor Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Specialization"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                  />
                  <Input
                    label="Experience (years)"
                    name="experience"
                    type="number"
                    value={form.experience}
                    onChange={handleChange}
                  />
                  <Input
                    label="Short Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                  />
                </Section>

                <Section title="Profile">
                  <Textarea
                    label="About"
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                  />
                  <Input
                    label="Education (comma separated)"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                  />
                  <Input
                    label="Languages (comma separated)"
                    name="languages"
                    value={form.languages}
                    onChange={handleChange}
                  />
                </Section>

                <Section title="Clinic">
                  <Input
                    label="Clinic Address"
                    name="clinicAddress"
                    value={form.clinicAddress}
                    onChange={handleChange}
                  />
                  <Input
                    label="Consultation Fee (₹)"
                    name="consultationFee"
                    type="number"
                    value={form.consultationFee}
                    onChange={handleChange}
                  />
                </Section>

                <Section title="Availability">
                  <div>
                    <label className="text-sm font-semibold text-slate-600">
                      Working Days
                    </label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {ALL_DAYS.map((day) => (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-full text-sm font-medium
                            ${
                              form.days.includes(day)
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Working From"
                      name="from"
                      type="time"
                      value={form.from}
                      onChange={handleChange}
                    />
                    <Input
                      label="Working To"
                      name="to"
                      type="time"
                      value={form.to}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Break From"
                      name="breakFrom"
                      type="time"
                      value={form.breakFrom}
                      onChange={handleChange}
                    />
                    <Input
                      label="Break To"
                      name="breakTo"
                      type="time"
                      value={form.breakTo}
                      onChange={handleChange}
                    />
                  </div>
                </Section>

                <button
                  type="submit"
                  className="sticky bottom-4  w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                >
                  Save Doctor
                </button>
              </form>
            </div>
          </div>

           
         <div className="fixed bottom-6 left-20 z-30">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-5 py-3 rounded-full 
                         bg-white/80 backdrop-blur-lg shadow-xl 
                         border border-slate-200 
                         text-slate-700 font-semibold 
                         hover:bg-indigo-600 hover:text-white 
                         transition-all duration-300"
            >
              <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition" />
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

 

const Section = ({ title, children }) => (
  <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
    <h3 className="font-semibold text-slate-700">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-slate-600">{label}</label>
    <input
      {...props}
      className="w-full mt-1 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-slate-600">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full mt-1 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
    />
  </div>
);

export default AddDoctorPage;
