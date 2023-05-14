var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var Address = require("../models/addressSchema");
var coupon = require("../models/couponSchema");
const otp = require("./otp");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  postAddress: async (req, res, next) => {
    try {
      console.log(req.body);
      const newAddress = new Address({
        userId: req.session.user._id,
        name: req.body.name,
        mobile: req.body.mobile,
        houseName: req.body.houseName,
        place: req.body.place,
        landMark: req.body.landMark,
        postOffice: req.body.postOffice,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        country: req.body.country,
        pinCode: req.body.pinCode,
        status: true,
      });

      await Address.create(newAddress);
      req.session.Addresserrmsg = null;
      console.log(newAddress);
      res.status(200).send((success = true));
    } catch (error) {
      console.log(error);
      res.status(400).send((success = false));
    }
  },
  getAddress: async (req, res, next) => {
    try {
      req.userAddressess = await Address.find({
        userId: new mongoose.Types.ObjectId(req.session.user._id),
      });
      next();
    } catch (error) {
      console.log(error);
    }
  },

};
