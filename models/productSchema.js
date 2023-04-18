const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new Schema(
  {
    productcode: {
      type: String,
      required: true,
    },
    merchantid: {
      type: ObjectId,
      ref: "merchants",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "filterdatas",
    },
    colour: {
      type: ObjectId,
      ref: "filterdatas",
    },
    pattern: {
      type: ObjectId,
      ref: "filterdatas",
    },
    orginalPrice: {
      type: Number,
      required: true,
    },
    ourPrice: {
      type: Number,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },
    sellerPrice: {
      type: Number,
      required: true,
    },
    genderType: {
      type: ObjectId,
      ref: "filterdatas",
    },
    Quantity: {
      type: Object,
      small: {
        type: Number,
      },
      medium: {
        type: Number,
      },
      large: {
        type: Number,
      },
      extraLarge: {
        type: Number,
      },
    },
    moreinfo: {
      type: String,
    },
    images: {
      type: Array,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
