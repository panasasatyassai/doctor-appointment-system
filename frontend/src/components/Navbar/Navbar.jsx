import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
           
          <div className="flex items-center gap-10">
            
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://doccure-wp.dreamstechnologies.com/wp-content/uploads/2024/06/logo-01.svg"
                alt="Doccure"
                className="h-9"
              />
            </Link>

            
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Register
              </Link>
            </nav>
          </div>

           
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
