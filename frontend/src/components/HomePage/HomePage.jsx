import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            Your Health,
            <br />
            Our Responsibility
          </h1>

          <p className="mt-6 text-slate-600 text-lg">
            A complete doctor appointment management system designed to help
            patients, doctors, and administrators manage healthcare efficiently
            and securely.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                Book Appointment{" "}
              </button>
            </Link>

            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg"
            alt="Doctor consultation"
            className="rounded-xl shadow-lg w-full max-w-lg"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Why Choose Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Easy Appointments
              </h3>
              <p className="text-slate-600">
                Patients can book doctor appointments easily with real-time
                availability and instant confirmation.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Doctor Dashboard
              </h3>
              <p className="text-slate-600">
                Doctors can manage schedules, approve appointments, and update
                availability from one place.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Admin Control
              </h3>
              <p className="text-slate-600">
                Admins can manage doctors, patients, and appointments with full
                control and visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
            alt="Healthcare team"
            className="rounded-xl shadow-lg w-full max-w-lg"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            About Our System
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed">
            Our Doctor Appointment System is built to modern healthcare
            standards. It simplifies appointment booking, reduces administrative
            workload, and improves patient experience using secure and scalable
            technology.
          </p>

          <p className="text-slate-600 text-lg mt-4 leading-relaxed">
            This platform is ideal for clinics, hospitals, and healthcare
            organizations looking for a reliable digital solution.
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-6 text-center">
        <p>
          © {new Date().getFullYear()} Doctor Appointment System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
