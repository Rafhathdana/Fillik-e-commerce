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
      required: true,
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
      required: true,
    },
    colour: {
      type: ObjectId,
      ref: "filterdatas",
      required: true,
    },
    pattern: {
      type: ObjectId,
      ref: "filterdatas",
      required: true,
    },
    orginalPrice: {
      type: Number,
      required: true,
    },
    ourPrice: {
      type: Number,
      required: true,
    },
    sellerPrice: {
      type: Number,
      required: true,
    },
    genderType: {
      type: ObjectId,
      ref: "filterdatas",
      required: true,
    },
    Quantity: {
      type: Object,
      small: {
        type: Number,
        required: true,
      },
      medium: {
        type: Number,
        required: true,
      },
      large: {
        type: Number,
        required: true,
      },
      extraLarge: {
        type: Number,
        required: true,
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
