import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-center text-white">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Your Health,
              <br />
              <span className="text-yellow-300">Our Responsibility</span>
            </h1>

            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              A complete doctor appointment management system that connects
              patients, doctors, and administrators with speed, security, and
              simplicity.
            </p>

            <div className="mt-8 flex gap-4">
              <Link to="/register">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Book Appointment
                </button>
              </Link>

              <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Learn More
              </button>
            </div>

           
            <div className="mt-10 flex gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-blue-100">Appointments</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-blue-100">Verified Doctors</p>
              </div>
              <div>
                <p className="text-2xl font-bold">99%</p>
                <p className="text-blue-100">Patient Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
              alt="Doctor consultation"
              className="rounded-3xl shadow-2xl w-full max-w-lg object-cover"
            />
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-14">
            Why Choose Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Easy Appointments
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Book appointments instantly with real-time doctor availability
                and seamless confirmation.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Doctor Dashboard
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Doctors can manage schedules, breaks, and appointments from a
                single intuitive dashboard.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Admin Control
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Full control over doctors, patients, and bookings with powerful
                admin tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
              alt="Healthcare team"
              className="rounded-3xl shadow-xl w-full max-w-lg object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              About Our System
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              Our Doctor Appointment System is built with modern healthcare
              standards in mind. It reduces waiting time, improves coordination,
              and ensures transparency for everyone involved.
            </p>

            <p className="text-slate-600 text-lg mt-4 leading-relaxed">
              Perfect for clinics, hospitals, and healthcare organizations
              looking to digitize appointment workflows.
            </p>
          </div>
        </div>
      </section>

       
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-10">
            Trusted by Patients & Doctors
          </h2>

          <div className="bg-slate-50 rounded-2xl p-10 shadow-sm">
            <p className="text-lg text-slate-600 italic">
              “This platform made booking appointments incredibly easy.
              Everything is clear, fast, and reliable. Highly recommended!”
            </p>

            <p className="mt-6 font-semibold text-slate-800">— Happy Patient</p>
          </div>
        </div>
      </section>

      
      <footer className="bg-slate-900 text-slate-300 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Doctor Appointment System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
