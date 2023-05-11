const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        merchantId: {
          type: Schema.Types.ObjectId,
          ref: "merchants",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        items: [
          {
            quantity: {
              type: Number,
              required: true,
            },
            size: {
              type: String,
              required: true,
            },
          },
        ],
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
        status: [
          {
            currentStatus: {
              type: String,
              required: true,
            },
            dateTimeOn: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    address: {
      addressId: {
        type: Schema.Types.ObjectId,
        ref: "addresses",
        required: true,
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
    },
    gst: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    coupons: {
      couponsId: {
        type: Schema.Types.ObjectId,
        ref: "coupons",
      },
      discountAmount: {
        type: Number,
        required: true,
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
    status: [
      {
        currentStatus: {
          type: String,
          required: true,
        },
        dateTimeOn: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", orderSchema);
