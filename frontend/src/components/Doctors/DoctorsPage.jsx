import { useState } from "react";
import DoctorsList from "./DoctorsList";
import Modal from "react-modal";
import BookAppointment from "../BookAppointment/BookAppointment";
import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    width: "520px",
    maxWidth: "95%",
    height: "520px",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "14px",
    padding: "0",
  },
};

const DoctorsPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refreshAppointments, setRefreshAppointments] = useState(0);

  const handleDoctorSelect = (doctor) => {
    setIsModalOpen(true);
    setSelectedDoctor(doctor);
  };

  const closeModel = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      <LogHomeNavbar refreshAppointments={refreshAppointments} />

      <div className="bg-slate-50 min-h-screen">
        <div className=" ">
          {/* <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Our Doctors</h2>
            <p className="text-slate-600 mt-2">
              Choose from our experienced and verified doctors to book your
              appointment.
            </p>
          </div> */}

          <DoctorsList onDoctorSelect={handleDoctorSelect} />
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModel}
          style={customStyles}
          overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div className="relative bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto">
            {selectedDoctor && (
              <BookAppointment
                doctor={selectedDoctor}
                onClose={closeModel}
                onBooked={() => setRefreshAppointments((prev) => prev + 1)}
              />
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DoctorsPage;
