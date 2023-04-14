const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filterSchema = new Schema({
  categoryname: {
    type: String,
    required: true,
  },
  values: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("filterdata", filterSchema);
