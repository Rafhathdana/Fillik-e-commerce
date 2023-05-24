var Merchant = require("../models/merchantSchema");
var Product = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Order = require("../models/orderSchema");
const otp = require("../config/otp");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const multer = require("multer");
const mongoose = require("mongoose");
const emailconnect = require("../config/emailconnect");
module.exports = {
  getLogin: (req, res, next) => {
    res.render("merchant/signin", {
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
  getSignOtpIn: (req, res, next) => {
    res.render("merchant/otpLogin", {
      title: "user",
      err_msg: req.session.errmsg,
      loggedin: false,
      noShow: true,
    });
    req.session.errmsg = null;
  },

  postSignin: async (req, res) => {
    try {
      const newMerchant = await Merchant.findOne({ email: req.body.email });

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
  verifyMobileOtp: async (req, res, next) => {
    try {
      if (parseInt(req.body.userOtp) === req.session.otP) {
        const newUser = await Merchant.findOne({ mobile: req.body.mobile });
        if (newUser) {
          if (newUser.isActive === true) {
            console.log("user exists");
            req.session.merchant = newUser;
            req.session.merchantLoggedIn = true;
          } else {
            req.session.errmsg = "Account was Blocked. Contact Us.";
            res.status(402).redirect("/login");
          }
        } else {
          req.session.errmsg = "Invalid Username or Password";
          res.status(400).redirect("/login");
        }
      } else {
        req.session.errmsg = "Invalid OTP";
        res.status(500).send({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  forgetPassword: async (req, res, next) => {
    res.render("merchant/forgetPassword", {
      title: "merchant",
      noShow: true,
      err_msg: req.session.errmsg,
      loggedin: false,
    });
    req.session.errmsg = null;
  },
  sendOtpEmail: (req, res, next) => {
    try {
      const verifiedUser = Merchant.findOne({
        email: req.body.email,
        isActive: true,
      });

      if (verifiedUser) {
        const otp = Math.floor(100000 + Math.random() * 871037);
        req.session.otP = otp;
        emailconnect
          .EMAILRESETOTP(req.body.email, req.session.otP)
          .then((response) => {
            response.Success = true;
            res.status(200).send({
              response,
              Success: true,
              message: "OTP Sent successfully",
            });
          })
          .catch((error) => {
            res
              .status(500)
              .send({ Success: false, message: "Error sending OTP" });
          });
      } else {
        res.status(200).send({
          Success: false,
          noEmail: true,
          message: "Enter proper Account",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  verifyedOtp: async (req, res, next) => {
    try {
      if (parseInt(req.body.userOtp) === req.session.otP) {
        req.session.emailVerified = true;
        req.session.emailname = req.body.email;
        res.status(200).send({
          success: true,
          response,
          message: "OTP verified successfully",
        });
      } else {
        req.session.emailVerified = false;
        req.session.errmsg = "Invalid Otp";
        res.status(500).send({ success: false, message: "Invalid Otp" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      if (req.session.emailVerified) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await Merchant.findOneAndUpdate(
          { email: req.session.emailname },
          { password: hashedPassword }
        );
        res.status(200).send({
          success: true,
        });
      } else {
        req.session.emailVerified = false;
        res.status(500).send({ success: false });
      }
    } catch (error) {
      console.log(error);
    }
  },

  statusProductUpdate: async (req, res, next) => {
    try {
      const datainuser = await Product.findById(req.params.userId);
 
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
        res.status(201).send({
          response,
          success: false,
          message: "Merchant found",
        });
      } else {
        res.status(200).send({ success: true, message: "No Merchant found" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Error verifying Merchant" });
    }
  },
  mobileVerify: async (req, res, next) => {
    const response = {};
    try {
      const newUser = await Merchant.findOne({ mobile: req.body.mobile });
      if (newUser) {
        response.success = true;
        res.status(200).send({
          response,
          success: true,
          message: "User found",
        });
      } else {
        res.status(500).send({ success: false, message: "No user found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Error verifying user" });
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
  orderFilterList: async (req, res, next) => {
    res.render("merchant/orderListFilter", {
      title: "merchant",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      author: "Merchant#123!",
      pagination: req.pagination,
      merchantData: req.session.merchant,
      orderList: req.orderList,
    });
  },
  salesList: async (req, res, next) => {
    res.render("merchant/salesReport", {
      title: "merchant",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      author: "Merchant#123!",
      pagination: req.pagination,
      salesList: req.salesList,
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
    req.merchantReport = [
      weekMerchantData,
      monthMerchantData,
      yearMerchantData,
    ];
    next();
  },
  salesReport: async (req, res, next) => {
    const selector = req.body.selector;

    // Extracting the relevant parts based on the selector
    let year, month, weekStart, weekEnd, day;
    if (selector.startsWith("year")) {
      year = parseInt(selector.slice(5));
    } else if (selector.startsWith("month")) {
      const parts = selector.split("-");
      year = parseInt(parts[1]);
      month = parseInt(parts[2]);
    } else if (selector.startsWith("week")) {
      const today = new Date();
      weekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      weekEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 6
      );
    
    } else if (selector.startsWith("day")) {
      day = new Date(selector.slice(4));
      day.setHours(0, 0, 0, 0);
    }

    if (weekStart && weekEnd) {
      const orderThisWeek = await Order.find({
        createdAt: { $gte: weekStart, $lte: weekEnd },
      })
        .populate({
          path: "userId",
          model: "User",
          select: "name email", // select the fields you want to include from the User document
        })
        .populate({
          path: "products.item",
          model: "Product",
        })
        .exec();
      req.session.admin.orderThisWeek = orderThisWeek;
      return res.redirect("/admin/sales-report");
    }

    if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      const orderThisMonth = await Order.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate({
          path: "userId",
          model: "User",
          select: "name email", // select the fields you want to include from the User document
        })
        .populate({
          path: "products.item",
          model: "Product",
        })
        .exec();
      req.session.admin.orderThisMonth = orderThisMonth;
      return res.redirect("/admin/sales-report");
    }

    if (day) {
      const startOfDay = new Date(day);
      const endOfDay = new Date(day);
      endOfDay.setDate(endOfDay.getDate() + 1);
      endOfDay.setSeconds(endOfDay.getSeconds() - 1);
      const orderThisDay = await Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate({
          path: "userId",
          model: "User",
          select: "name email", // select the fields you want to include from the User document
        })
        .populate({
          path: "products.item",
          model: "Product",
        })
        .exec();
      req.session.admin.orderThisDay = orderThisDay;
      return res.redirect("/admin/sales-report");
    }
    if (year) {
      const orderThisYear = await Order.find({
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      })
        .populate({
          path: "userId",
          model: "User",
          select: "name email", // select the fields you want to include from the User document
        })
        .populate({
          path: "products.item",
          model: "Product",
        })
        .exec();
      req.session.admin.orderThisYear = orderThisYear;
      return res.redirect("/admin/sales-report");
    }
  },
  changePhoto: async (req, res, next) => {
    try {
      const merchantId = req.session.merchant._id;

      if (req.files && req.files.image) {
        const file = req.files.image;
        const filePath = `public/images/merchantImages/`;
        const fileName = `${merchantId}.${file.name.split(".").pop()}`;

        file.mv(filePath + fileName, async (err) => {
          if (err) {
            throw err;
          }
          console.log("File moved to the destination");

          let updatedUser = await Merchant.findById(merchantId);

          if (!updatedUser.image) {
            // If the field doesn't exist, create it
            updatedUser.image = fileName;
          } else {
            // If the field exists, update it
            updatedUser.image = fileName;
          }

          updatedUser = await updatedUser.save();

          req.session.user = updatedUser;
          res.status(200).json({
            message: "Profile updated successfully",
            status: 200,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
