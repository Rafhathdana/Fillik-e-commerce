const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;
const couponSchema = new Schema(
  {
    offertype: {
      type: String,
      required: true,
    },
    countAccess: {
      type: Number,
      required: true,
    },
    minRupees: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: true,
    },
    maxPercentage: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
