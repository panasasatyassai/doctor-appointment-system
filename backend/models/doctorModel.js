const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    availability: {
      days: {
        type: [String],
        default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      },
      from: {
        type: String,
        default: "09:00",
      },
      to: {
        type: String,
        default: "17:00",
      },
      breaks: [
        {
          from: String,
          to: String,
        },
      ],
      totalSlots: {
        type: Number,
        default: 0,
      },
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("doctors", doctorSchema);
