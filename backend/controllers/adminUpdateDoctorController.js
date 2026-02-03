const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const {calculateTotalSlots} = require("../utils/calculateSlots")

// const updateDoctorByAdminController = async (req, res) => {
//   try {
//     const { doctorId, name, specialization, availability, status } = req.body;
//     if (!doctorId) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Doctor Id required" });
//     }
//     const doctor = await doctorModel.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     if (name) doctor.name = name;
//     if (specialization) doctor.specialization = specialization;
//     if (status) doctor.status = status;

//     if (availability) {
//         const totalSlots = calculateTotalSlots(
//             availability.from , 
//             availability.to , 
//             availability.breaks || [] , 
//             availability.slotDuration || 30 
//         )
//         doctor.availability = {
//             ...availability , 
//             totalSlots 
//         }
//     }
     

//     await doctor.save();

//     return res.status(200).send({
//       success: true,
//       message: "Doctor updated successfully",
//       data : doctor 
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       success: false,
//       message: "Error updating doctor",
//     });
//   }
// };

// const getBookedSlotsCountController = async (req , res) => {
//   try {
//     const { doctorId } = req.params;

//     const count = await appointmentModel.countDocuments({
//       doctorId,
//       status: "approved",
//     });
//     res.status(200).send({
//       success: true,
//       bookedSlots: count,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       success: false,
//       message: "Error fetching booked slots",
//     });
//   }
// };

const updateDoctorByAdminController = async (req, res) => {
  try {
    const { doctorId, name, specialization, availability, status } = req.body;

    if (!doctorId) {
      return res.status(400).send({
        success: false,
        message: "Doctor Id required",
      });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (status) doctor.status = status;

    if (availability) {
      const totalSlots = calculateTotalSlots(
        availability.from,
        availability.to,
        availability.breaks || [],
        availability.slotDuration || 30
      );

      doctor.availability = {
        ...doctor.availability,
        ...availability,
        totalSlots,  
      };
    }

    await doctor.save();

    return res.status(200).send({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (e) {
    console.error("UPDATE DOCTOR ERROR:", e);
    res.status(500).send({
      success: false,
      message: "Error updating doctor",
    });
  }
};

const getBookedSlotsCountController = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const count = await appointmentModel.countDocuments({
      doctorId,
      status: "approved",
    });

    res.status(200).send({
      success: true,
      bookedSlots: count,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Error fetching booked slots",
    });
  }
};

module.exports = {
    updateDoctorByAdminController , 
    getBookedSlotsCountController
}
