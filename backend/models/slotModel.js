const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      required: true,
    },
    date: String,
    time: String,
    status: {
      type: String,
      default: "available",  
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("slots", slotSchema);
