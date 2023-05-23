const mongoose = require("mongoose");
const otp = require("../config/otp");
const {
  Types: { ObjectId },
} = require("mongoose");
const contact = require("../models/contactSchema");

module.exports = {
  addUserComplaint: async (req, res, next) => {
    try {
      const newData = new contact({
        account: "user",
        email: req.session.user.email,
        mobile: req.session.user.mobile,
        subject: req.body.subject,
        message: req.body.message,
        status: true,
      });

      await newData.save();
      req.session.errorout = null;
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  addGuestComplaint: async (req, res, next) => {
    try {
      const newData = new contact({
        account: "Guest",
        email: req.body.email,
        mobile: req.body.mobile,
        subject: req.body.subject,
        message: req.body.message,
        status: true,
      });

      await newData.save();
      req.session.errorout = null;
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
