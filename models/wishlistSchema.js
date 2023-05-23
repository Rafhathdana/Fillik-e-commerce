const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const wishlistSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    productId: {
      type: ObjectId,
      ref: "products",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
