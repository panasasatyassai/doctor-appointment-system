import { useState } from "react";
import DoctorsList from "./DoctorsList";
import Modal from "react-modal";
import BookAppointment from "../BookAppointment/BookAppointment";
import Navbar from "../Navbar/Navbar";
import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    width: "500px",
    height: "500px",
    left: "50%",
    right: "auto",
    bottom: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const DoctorsPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <LogHomeNavbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Our Doctors</h2>

        <DoctorsList onDoctorSelect={handleDoctorSelect} />
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModel}
          className="bg-white p-6 rounded shadow-md w-[400px] mx-auto mt-20"
         overlayClassName="fixed inset-0 bg-transparent bg-opacity-40"
        >
          {selectedDoctor && (
            <BookAppointment
              doctor={selectedDoctor}
              onClose={closeModel}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default DoctorsPage;
