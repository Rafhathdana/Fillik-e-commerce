const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "users",
    },
    housename: {
      type: String,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pin: {
      type: Number,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", orderSchema);
