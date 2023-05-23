const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const merchantSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    outletName: {
      type: String,
      required: true,
    },
    regNumber: {
      type: String,
      required: true,
    },
    gpsCoordinates: {
      type: String,
      required: true,
    },
    pin: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    emailverified: {
      type: Boolean,
      required: true,
    },
    mobileverification: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Merchant", merchantSchema);
