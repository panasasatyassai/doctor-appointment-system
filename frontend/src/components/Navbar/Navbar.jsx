//import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'
const Navbar = () => {
   

  return (
    <div className="bg-amber-50 p-4 flex justify-between text-white">
      <h1 className="font-bold text-black">Doctor Appointment System</h1>

      <div className="p-3 flex gap-3">
        <h3 className="text-black"><Link to="/">Home</Link></h3>
        <button className='bg-blue-500 w-[70px] h-[28px] border-0 rounded '> 
          <Link to="/login">Login</Link>
           </button>
        <button className="bg-blue-500 w-[70px] h-[28px] border-0 rounded "> <Link to="/register">Register</Link> </button>
      </div>
    </div>
  );
};

export default Navbar