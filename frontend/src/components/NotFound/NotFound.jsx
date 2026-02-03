import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiLogIn } from "react-icons/fi";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-100 px-4"
    >
      <div
        className="bg-white/80 backdrop-blur-xl
        shadow-2xl rounded-3xl p-10 max-w-md w-full text-center"
      >
        
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-500 p-4 rounded-full">
            <FiAlertTriangle size={40} />
          </div>
        </div>

         
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          404 - Page Not Found
        </h1>

       
        <p className="text-slate-600 mb-6">
          Oops! The page you are looking for doesn’t exist or was moved.
        </p>

         
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5
              bg-indigo-600 hover:bg-indigo-700
              text-white rounded-xl shadow transition"
          >
            <FiHome /> Home
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5
              border border-indigo-600 text-indigo-600
              hover:bg-indigo-50 rounded-xl transition"
          >
            <FiLogIn /> Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
