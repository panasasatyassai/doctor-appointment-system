const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModels");

const registerDoctorController = async (req, res) => {
  try {
    const doctor = new doctorModel({
      userId: req.user._id,
      name: req.body.name,
      specialization: req.body.specialization,
      experience: req.body.experience,
    });

    await doctor.save();

    res.status(201).send({
      success: true,
      message: "Doctor registered successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Doctor registration failed",
    });
  }
};
// const addDoctorByAdminController = async (req, res) => {
//   try {
//     const { name, specialization, experience } = req.body;
//     if (!name || !specialization || !experience) {
//       return res
//         .status(400)
//         .send({ success: false, message: "All fields are required" });
//     }
//     const email = name.toLowerCase().replace(/\s+/g, "") + "@hospital.com";
//     console.log(email);
//     const existingUser = await userModel.findOne({ email });

//     if (existingUser) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Doctor already exists" });
//     }
//     const plainPassword = "doctor@123";
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "doctor",
//     });
//     const doctor = await doctorModel.create({
//       userId: user._id,
//       name,
//       specialization,
//       experience,
//       status: "approved",
//     });
//     res.status(201).send({
//       success: true,
//       message: "Doctor added successfully",
//       data: doctor,
//       credentials: { email, password: plainPassword },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Failed to add doctor" });
//   }
// };

// const addDoctorByAdminController = async (req, res) => {
//   try {
//     const {
//       name,
//       specialization,
//       experience,
//       bio,
//       about,
//       education,
//       languages,
//       clinicAddress,
//       consultationFee,
//       availability,
//     } = req.body;

//     if (!name || !specialization || !experience) {
//       return res.status(400).send({
//         success: false,
//         message: "Name, specialization and experience are required",
//       });
//     }

//     // auto email
//     const email = name.toLowerCase().replace(/\s+/g, "") + "@hospital.com";

//     // check doctor exists
//     const existingDoctor = await doctorModel.findOne({ name });
//     if (existingDoctor) {
//       return res.status(400).send({
//         success: false,
//         message: "Doctor already exists",
//       });
//     }

//     // auto password
//     const plainPassword = "doctor@123";
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     // create user
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "doctor",
//     });

//     // create doctor profile
//     // const doctor = await doctorModel.create({
//     //   userId: user._id,
//     //   name,
//     //   specialization,
//     //   experience,
//     //   bio,
//     //   about,
//     //   education,
//     //   languages,
//     //   clinicAddress,
//     //   consultationFee,
//     //   availability,
//     //   status: "approved",
//     // });

//     res.status(201).send({
//       success: true,
//       message: "Doctor added successfully",
//       data: doctor,
//       credentials: {
//         email,
//         password: plainPassword, // show once to admin
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Failed to add doctor",
//     });
//   }
// };

const getAllDoctorsController2 = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({ status: "approved" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

// const addDoctorByAdminController = async (req, res) => {
//   try {
//     const {
//       name,
//       specialization,
//       experience,
//       bio,
//       about,
//       education,
//       languages,
//       clinicAddress,
//       consultationFee,
//       availability,
//     } = req.body;

//     if (!name || !specialization || !experience) {
//       return res.status(400).send({
//         success: false,
//         message: "Name, specialization and experience are required",
//       });
//     }

//     // auto email
//     const email = name.toLowerCase().replace(/\s+/g, "") + "@hospital.com";

//     // check doctor exists
//     const existingDoctor = await doctorModel.findOne({ name });
//     if (existingDoctor) {
//       return res.status(400).send({
//         success: false,
//         message: "Doctor already exists",
//       });
//     }

//     // auto password
//     const plainPassword = "doctor@123";
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     // create user
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "doctor",
//     });

//     // create doctor profile
//     const doctor = await doctorModel.create({
//       userId: user._id,
//       name,
//       specialization,
//       experience,
//       bio,
//       about,
//       education,
//       languages,
//       clinicAddress,
//       consultationFee,
//       availability,
//       status: "approved",
//     });

//     res.status(201).send({
//       success: true,
//       message: "Doctor added successfully",
//       data: doctor,
//       credentials: {
//         email,
//         password: plainPassword, // show once to admin
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Failed to add doctor",
//     });
//   }
// };

const addDoctorByAdminController = async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;
    if (!name || !specialization || !experience) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const email = name.toLowerCase().replace(/\s+/g, "") + "@hospital.com";
    console.log(email);
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "Doctor already exists" });
    }
    const plainPassword = "doctor@123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });
    const doctor = await doctorModel.create({
      userId: user._id,
      name,
      specialization,
      experience,
      status: "approved",
    });
    res.status(201).send({
      success: true,
      message: "Doctor added successfully",
      data: doctor,
      credentials: { email, password: plainPassword },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Failed to add doctor" });
  }
};

// GET SINGLE DOCTOR
// const getDoctorByIdController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error fetching doctor details",
//     });
//   }
// };

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({ status: { $in: ["approved", "rejected"] } })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

const getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.user.id,
    });

    res.status(200).send({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctor profile",
    });
  }
};

const updateAvailabilityController = async (req, res) => {
  try {
    const { days, from, to, breaks } = req.body;
    console.log("REQ BODY DAYS:", req.body.days);

    if (!days || !from || !to) {
      return res.status(400).send({
        success: false,
        message: "Days, from and to are required",
      });
    }

    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          availability: {
            days,
            from,
            to,
            breaks: breaks || [],
          },
        },
      },
      { new: true },
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Availability updated successfully",
      data: doctor.availability,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to update availability",
    });
  }
};

// const getDoctorByIdController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       data: doctor,
//     });
//   } catch (e) {
//     res.status(500).send({
//       success: false,
//       message: "Failed to fetch doctor",
//     });
//   }
// };

const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).send({
      success: true,
      message: "Doctor profile updated",
      data: doctor,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Failed to update doctor profile",
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id);

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const safeDoctor = {
      ...doctor._doc,

      bio: doctor.bio || "Senior Medical Consultant",
      about:
        doctor.about ||
        "This doctor is a highly experienced specialist providing quality healthcare services with patient-focused treatment.",
      education:
        doctor.education && doctor.education.length > 0
          ? doctor.education
          : ["MBBS", "MD"],
      languages:
        doctor.languages && doctor.languages.length > 0
          ? doctor.languages
          : ["English"],
      clinicAddress: doctor.clinicAddress || "Clinic address not updated",
      consultationFee: doctor.consultationFee || 500,
      rating: doctor.rating || 4.5,

      totalPatients: doctor.totalPatients || 0,

      availability: {
        days:
          doctor.availability?.days?.length > 0
            ? doctor.availability.days
            : ["Mon", "Tue", "Wed", "Thu", "Fri"],

        from: doctor.availability?.from || "09:00 AM",
        to: doctor.availability?.to || "05:00 PM",

        breaks:
          doctor.availability?.breaks?.length > 0
            ? doctor.availability.breaks
            : [{ from: "01:00 PM", to: "02:00 PM" }],
      },
    };
    res.status(200).send({
      success: true,
      data: safeDoctor,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error fetching doctor details.",
    });
  }
};

const getRelatedDoctorsController = async (req, res) => {
  try {
    const { specialization, doctorId } = req.query;
    const doctors = await doctorModel
      .find({
        specialization,
        _id: { $ne: doctorId },
      })
      .limit(3);
    res.status(200).send({
      success: true,
      data: doctors,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error fetching related doctors",
    });
  }
};

const addDoctorFullProfileController = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      bio,
      about,
      education,
      languages,
      clinicAddress,
      consultationFee,
      availability,
    } = req.body;

    if (!name || !specialization || !experience) {
      return res.status(400).send({
        success: false,
        message: "Name, specialization and experience are required",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getDoctorProfileController,
  registerDoctorController,
  addDoctorByAdminController,
  getAllDoctorsController,
  getAllDoctorsController2,
  getDoctorByIdController,
  updateDoctorProfileController,
  updateAvailabilityController,
  getRelatedDoctorsController,
};
