var Merchant = require("../models/merchantSchema");
var Product = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Order = require("../models/orderSchema");
const otp = require("../controllers/otp");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const multer = require("multer");
const mongoose = require("mongoose");
module.exports = {
  getLogin: (req, res, next) => {
    res.render("merchant/signin2", {
      title: "merchant",
      merchantLoggedin: null,
      noShow: true,
    });
  },
  getSignIn: (req, res, next) => {
    res.render("merchant/signup", {
      title: "merchant",
      err_msg: req.session.merchanterrmsg,
      merchantLoggedin: null,
      noShow: true,
    });
    req.session.merchanterrmsg = null;
  },
  getDashBoard: (req, res, next) => {
    res.render("merchant/index", {
      title: "merchant",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      author: "Merchant#123!",
      weekreport: req.weekreport,
      totalresult: req.totalresult,
      monthlyData: req.monthlyData,
    });
  },

  postSignup: async (req, res) => {
    try {
      const vMerchant = await Merchant.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (!vMerchant) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newMerchant = new Merchant({
          brandName: req.body.brandName,
          outletName: req.body.outletName,
          regNumber: req.body.regNumber,
          email: req.body.email,
          gpsCoordinates: req.body.gpsCoordinates,
          pin: req.body.pin,
          password: hashedPassword,
          mobile: req.body.mobile,
          status: false,
          emailverified: false,
          mobileverification: true,
          isActive: true,
        });

        await Merchant.create(newMerchant);
        req.session.merchanterrmsg = null;
        console.log(newMerchant);
        res.redirect("/merchant/login");
      } else {
        // User exists
        req.session.merchanterrmsg = "email or mobile phone exists Already";
        res.redirect("/merchant/signup");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/signup");
    }
  },
  postSignin: async (req, res) => {
    try {
      const newMerchant = await Merchant.findOne({ email: req.body.email });
      console.log(newMerchant);
      if (newMerchant) {
        if (newMerchant.isActive === true) {
          bcrypt
            .compare(req.body.password, newMerchant.password)
            .then((status) => {
              console.log("hai");
              if (status) {
                console.log("user exist");
                req.session.merchant = newMerchant;
                req.session.merchantLoggedIn = true;
                console.log(newMerchant);
                res.redirect("/merchant/");
              } else {
                console.log("password is not matching");
                req.session.merchanterrmsg = "Invalid Username or Password";
                res.status(401).redirect("/merchant/login");
              }
            });
        } else {
          req.session.merchanterrmsg = "Account was Blocked Contact US";
          res.status(402).redirect("/merchant/login");
        }
      } else {
        req.session.merchanterrmsg = "Invalid Username or Password";
        res.status(401).redirect("/merchant/login");
      }
    } catch (error) {
      console.log(error);
    }
  },
  logout: (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },
  deleteProduct: async (req, res, next) => {
    try {
      let productdetails = await Product.findById(req.params.Id);
      if (
        productdetails.Orders.small.length == 1 &&
        productdetails.Orders.medium.length == 1 &&
        productdetails.Orders.large.length == 1 &&
        productdetails.Orders.extraLarge.length == 1
      ) {
        Product.deleteOne({ _id: req.params.Id })
          .then((response) => {
            if (response) {
              res.sendStatus(204);
            } else {
              res.status(400).json({ message: "unable to delete Product" });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
          });
      } else {
        res.status(500).json({ message: "Can't able to delete" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  statusProductUpdate: async (req, res, next) => {
    try {
      const datainuser = await Product.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.isActive) {
        value = false;
      } else {
        value = true;
      }
      Merchant.findOneAndUpdate(
        { _id: req.params.userId },
        { isActive: value },
        { new: true }
      )
        .then((updatedUser) => {
          res.sendStatus(204);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
    }
  },
  getProfile: async (req, res, next) => {
    res.render("merchant/profile", {
      title: "profile",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      merchantData: req.session.merchant,
    });
  },
  getEditProfile: async (req, res, next) => {
    res.render("merchant/editProfile", {
      title: "Edit Profile",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      merchantEdit: req.session.merchant,
    });
  },
  postEditProfile: async (req, res) => {
    try {
      const vMerchant = await Merchant.findOne({
        _id: req.session.merchant._id,
      }).exec();
      const existingMerchant = await Merchant.findOne({
        $or: [{ email: req.body.email }, { mobilePhone: req.body.mobilePhone }],
      });
      if (!existingMerchant || existingMerchant._id.equals(vMerchant._id)) {
        vMerchant.brandName = req.body.brandName;
        vMerchant.outletName = req.body.outletName;
        vMerchant.regNumber = req.body.regNumber;
        vMerchant.email = req.body.email;
        vMerchant.mobilePhone = req.body.mobilePhone;
        vMerchant.gpsCoordinates = req.body.gpsCoordinates;
        vMerchant.pin = req.body.pin;
        await vMerchant.save();
        req.session.merchanterrmsg = null;
        console.log(vMerchant);
        res.redirect("/merchant/dashboard");
      } else {
        // User exists
        req.session.merchanterrmsg = "Email or mobile phone already exists";
        res.redirect("/merchant/editprofile");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/editprofile");
    }
  },

  emailMobileVerify: async (req, res, next) => {
    const response = {};
    try {
      const vMerchant = await Merchant.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (vMerchant) {
        response.success = false;
        res.status(200).send({
          response,
          success: false,
          message: "Merchant found",
        });
      } else {
        res.status(500).send({ success: true, message: "No Merchant found" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Error verifying Merchant" });
    }
  },
  emailPasswordVerify: async (req, res, next) => {
    const response = {};
    try {
      const vMerchant = await Merchant.findOne({ email: req.body.email });
      if (vMerchant) {
        if (vMerchant.isActive === true) {
          bcrypt
            .compare(req.body.password, vMerchant.password)
            .then((status) => {
              console.log("hai");
              if (status) {
                console.log("user exist");
                response.success = true;
                res.status(200).send({
                  response,
                  success: true,
                  mobile: vMerchant.mobile,
                  message: "User found",
                });
              } else {
                console.log("password is not matching");
                req.session.merchanterrmsg = "Invalid Username or Password";
                res.status(401).send({
                  response,
                  success: false,
                  message: req.session.merchanterrmsg,
                });
              }
            });
        } else {
          req.session.merchanterrmsg = "Account was Blocked Contact US";
          res.status(402).send({
            response,
            success: false,
            message: req.session.merchanterrmsg,
          });
        }
      } else {
        req.session.merchanterrmsg = "Invalid Username or Password";
        res.status(401).send({
          response,
          success: false,
          message: req.session.merchanterrmsg,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Error verifying Merchant" });
    }
  },

  sendOtp: async (req, res, next) => {
    try {
      const Otp = Math.floor(100000 + Math.random() * 871037);
      req.session.otP = Otp;
      otp
        .OTP(req.body.mobile, req.session.otP)
        .then((response) => {
          response.success = true;
          res.status(200).send({
            response,
            success: true,
            message: "OTP Sent successfully",
          });
        })
        .catch((error) => {
          res
            .status(500)
            .send({ success: false, message: "Error sending OTP" });
        });
    } catch (error) {
      console.log(error);
    }
  },
  verifyOtp: async (req, res, next) => {
    try {
      if (parseInt(req.body.userOtp) === req.session.otP) {
        res.status(200).send({
          success: true,
          response,
          message: "OTP verified successfully",
        });
      } else {
        req.session.errmsg = "Invalid Otp";
        res.status(500).send({ success: false, message: "Invalid Otp" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  orderList: async (req, res, next) => {
    res.render("merchant/orderList", {
      title: "merchant",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      author: "Merchant#123!",
      pagination: req.pagination,
      merchantData: req.session.merchant,
      orderList: req.orderList,
    });
  },

  adminMerchantyDashboard: async (req, res, next) => {
    const weekMerchantData = await Merchant.aggregate([
      {
        $group: {
          _id: {
            week: { $isoWeek: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 },
      },
    ]);
    // Get month-wise new Merchants Merchantdata
    const monthMerchantData = await Merchant.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get year-wise new Merchants Merchantdata
    const yearMerchantData = await Merchant.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);
    req.MerchantReport = [
      weekMerchantData,
      monthMerchantData,
      yearMerchantData,
    ];
    console.log(req.MerchantReport);
    next();
  },
};
