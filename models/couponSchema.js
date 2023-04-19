const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;
const couponSchema = new Schema(
  {
    offertype: {
      type: String,
      required: true,
    },
    category: [
      {
        type: Types.ObjectId,
        ref: "filterdatas",
      },
    ],
    colour: [
      {
        type: Types.ObjectId,
        ref: "filterdatas",
      },
    ],
    pattern: [
      {
        type: Types.ObjectId,
        ref: "filterdatas",
      },
    ],
    code: {
      type: String,
      required: true,
    },
    ExpireDate: {
      type: Date,
      required: true,
    },
    Status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
