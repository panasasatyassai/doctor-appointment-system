import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-slate-600 hover:text-blue-600";

  return (
    <header className="bg-amber-50/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg"
            alt="Doccure"
            className="h-9"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className={`text-sm ${isActive("/")}`}>
            Home
          </Link>

          <Link
            to="/login"
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              location.pathname === "/login"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Login
          </Link>

          <Link
            to="/register"
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              location.pathname === "/register"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
