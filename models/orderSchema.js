const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    merchantid: {
      type: Schema.Types.ObjectId,
      ref: "merchants",
    },
    products: [
      {
        productid: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        sellRate: {
          type: String,
          required: true,
        },
        actualRate: {
          type: String,
          required: true,
        },
        mrp: {
          type: String,
          required: true,
        },
        payableAmount: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
      },
    ],
    address: {
      AddressId: {
        type: Schema.Types.ObjectId,
        ref: "addresses",
      },
      houseName: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
      place: {
        type: String,
        required: true,
      },
      landMark: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },
    gst: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },
    deliveryCharge: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },
    coupons: {
      couponsId: {
        type: Schema.Types.ObjectId,
        ref: "coupons",
      },
      discountAmount: {
        type: Number,
        required: true,
        get: (v) => (v / 100).toFixed(2),
        set: (v) => Math.round(v * 100),
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
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
module.exports = mongoose.model("Order", orderSchema);
