import "../src/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import RegisterUser from "./components/RegisterUser/RegisterUser";
import HomePage from "./components/HomePage/HomePage";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import DoctorsPage from "./components/Doctors/DoctorsPage";
import LogHomePage from "./components/LogHomePage/LogHomePage"; 
import PublicRoute from "./components/publicRoute/PublicRoute";
import NotFound from "./components/NotFound/NotFound";
import RoleProtectedRoute from "./components/RoleProtectedRoute/RoleProtectedRoute"; 
import Notifications from "./components/Notifications/Notifications";
import AllBookedAppointments from "./components/AllBookedAppointments/AllBookedAppointments";
import DoctorDetailPage from "./components/DoctorDetailPage/DoctorDetailPage";
import AddDoctorPage from "./components/AddDoctorPage/AddDoctorPage";
import ReactPractice from "./components/ReactPractice";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/log-home" element={<LogHomePage />} />
          <Route
            path="/doctors/doctor-details-page/:id"
            element={<DoctorDetailPage />}
          />

          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/booked-appointments" element={<Notifications />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-doctor-page" element={<AddDoctorPage />} />
          <Route
            path="/admin-dashboard/view-appointments"
            element={<AllBookedAppointments />}
          />
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
