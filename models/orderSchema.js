const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new Schema(
  {
    productid: {
      type: ObjectId,
      ref: "products",
    },
    merchantid: {
      type: ObjectId,
      ref: "merchants",
    },
    userid: {
      type: ObjectId,
      ref: "users",
    },
    Quantity: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    orginalPrice: {
      type: Number,
      required: true,
    },
    selledPrice: {
      type: Number,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },
    discountRate: {
      type: Number,
      required: true,
    },
    couponUsed: {
      type: String,
      required: true,
    },
    deliveryCharge: {
      type: String,
      required: true,
    },
    address: {
      type: ObjectId,
      ref: "address",
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

module.exports = mongoose.model("Order", orderSchema);
