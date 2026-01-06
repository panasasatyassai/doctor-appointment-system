import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import { Link } from "react-router-dom";

const LogHomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <LogHomeNavbar />

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Your Health, <br />
            <span className="text-blue-600">Our Responsibility</span>
          </h1>

          <p className="mt-6 text-slate-600 text-lg leading-relaxed">
            A modern doctor appointment system that helps patients find the
            right doctors, manage bookings, and track appointments with ease.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/doctors">
              {" "}
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Book Appointment
              </button>{" "}
            </Link>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
            alt="Doctor consultation"
            className="rounded-2xl shadow-xl w-full max-w-lg object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
              alt="Doctor team"
              className="rounded-2xl shadow-lg w-full max-w-lg object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">About Us</h2>

            <p className="text-slate-600 leading-relaxed text-lg">
              We provide a secure and easy-to-use healthcare appointment
              platform that connects patients with trusted doctors. Our goal is
              to simplify appointment scheduling while ensuring transparency,
              efficiency, and quality healthcare services.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
          Why Choose Our Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Easy Appointments
            </h3>
            <p className="text-slate-600">
              Book appointments quickly with real-time availability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Verified Doctors
            </h3>
            <p className="text-slate-600">
              Consult experienced and verified healthcare professionals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Secure Records
            </h3>
            <p className="text-slate-600">
              Your medical data is safe and securely stored.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogHomePage;
