import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

const LogHomePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <LogHomeNavbar />

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Your Health,
              <br />
              <span className="text-blue-600">Our Responsibility</span>
            </h1>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
              Book appointments with trusted doctors, manage schedules, and
              track your healthcare journey — all in one platform.
            </p>

            <div className="mt-10 flex gap-4">
              <Link to="/doctors">
                <button className="bg-blue-600 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                  Book Appointment
                </button>
              </Link>

              <button className="border border-blue-600 text-blue-600 px-7 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
              alt="Doctor consultation"
              className="rounded-3xl shadow-xl w-full max-w-lg object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600">500+</h3>
            <p className="text-slate-600 mt-1">Verified Doctors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">10k+</h3>
            <p className="text-slate-600 mt-1">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
            <p className="text-slate-600 mt-1">Support</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">99%</h3>
            <p className="text-slate-600 mt-1">Success Rate</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
            alt="Medical team"
            className="rounded-3xl shadow-lg w-full max-w-lg object-cover"
          />
        </div>

        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-5">
            About Our Platform
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed">
            We provide a secure and easy-to-use healthcare appointment platform
            that connects patients with experienced and verified doctors. Our
            mission is to simplify appointment scheduling while maintaining
            transparency, efficiency, and trust.
          </p>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Why Choose Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Easy Appointments
              </h3>
              <p className="text-slate-600">
                Book appointments instantly with real-time doctor availability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Verified Doctors
              </h3>
              <p className="text-slate-600">
                Consult only trusted and certified healthcare professionals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Secure Records
              </h3>
              <p className="text-slate-600">
                Your personal and medical data is fully protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Find the right doctor and book your appointment in minutes.
          </p>

          <Link to="/doctors">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
              Find Doctors
            </button>
          </Link>
        </div>
      </section>

      <div>
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 bg-[#7367f0] hover:bg-[#5e50ee] text-white p-3 rounded-full shadow-lg transition"
          >
            <FiArrowUp size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LogHomePage;
