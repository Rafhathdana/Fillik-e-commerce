var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
const otp = require("../controllers/otp");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  getHome: async (req, res, next) => {
    const userslist = await users.find().limit(10);
    res.render("admin/users", {
      title: "users",
      fullName: req.session.admin.fullName,
      adminLoggedin: req.session.adminLoggedIn,
      author: "Admin#1233!",
      userslist,
    });
  },
  getUser: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const usersList = await users
        .find()
        .skip((page - 1) * count)
        .limit(count)
        .lean();

      const totalUsers = await users.countDocuments();
      const totalPages = Math.ceil(totalUsers / count);
      const startIndex = 0;

      const endIndex = Math.min(startIndex + usersList.length, totalUsers);

      res.render("admin/users", {
        title: "Users List",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        usersList,
        count,
        page,
        totalPages,
        startIndex,
        endIndex,
      });
    } catch (error) {
      next(error);
    }
  },
  getMerchant: async (req, res, next) => {
    const merchantslist = await merchants.find().limit(10);
    res.render("admin/merchants", {
      title: "admin",
      fullName: req.session.admin.fullName,
      adminLoggedin: req.session.adminLoggedIn,
      merchantslist,
    });
  },
  getLogin: (req, res, next) => {
    res.render("admin/signin2", {
      title: "admin",
      err_msg: req.session.adminerrmsg,
      adminLoggedin: null,
      author: "Admin#1233!",
      noShow: true,
    });
    req.session.adminerrmsg = null;
  },
  getSignUp: (req, res, next) => {
    res.render("admin/signup", {
      title: "admin",
      err_msg: req.session.adminerrmsg,
      adminLoggedin: null,
      author: "Admin#1233!",
      noShow: true,
    });
    req.session.adminerrmsg = null;
  },
  
  postSignin: async (req, res) => {
    try {
      const newAdmin = await Admin.findOne({ email: req.body.email });
      console.log(req.body.email);
      if (newAdmin) {
        if (newAdmin.isActive === true) {
          bcrypt
            .compare(req.body.password, newAdmin.password)
            .then((status) => {
              if (status) {
                console.log("user exist");
                req.session.admin = newAdmin;
                req.session.adminLoggedIn = true;
                console.log(newAdmin);
                res.redirect("/admin/home");
              } else {
                console.log("password is not matching");
                req.session.adminerrmsg = "Invalid Username or Password";
                res.status(400).redirect("/admin/login");
              }
            });
        } else {
          req.session.adminerrmsg = "Account was Blocked Contact US";
          res.status(402).redirect("/admin/login");
        }
      } else {
        req.session.adminerrmsg = "Invalid Username or Password";
        res.status(400).redirect("/admin/login");
      }
    } catch (error) {
      console.log(error);
    }
  },
  postSignup: async (req, res) => {
    try {
      const vAdmin = await Admin.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (!vAdmin) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newAdmin = new Admin({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hashedPassword,
          mobile: req.body.mobile,
          status: false,
          emailverified: false,
          mobileverification: true,
          isActive: true,
        });

        await Admin.create(newAdmin);
        req.session.adminerrmsg = null;
        console.log(newAdmin);
        res.redirect("/admin/login");
      } else {
        // User exists
        req.session.adminerrmsg = "email or mobile phone exists Already";
        console.log(error);
        res.redirect("/admin/signup");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/admin/signup");
    }
  },
  emailMobileVerify: async (req, res, next) => {
    const response = {};
    try {
      const vAdmin = await Admin.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (vAdmin) {
        response.success = false;
        res.status(200).send({
          response,
          success: false,
          message: "Admin found",
        });
      } else {
        res.status(500).send({ success: true, message: "No Admin found" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Error verifying Admin" });
    }
  },
  emailPasswordVerify: async (req, res, next) => {
    const response = {};
    try {
      const vAdmin = await Admin.findOne({ email: req.body.email });
      if (vAdmin) {
        if (vAdmin.isActive === true) {
          bcrypt.compare(req.body.password, vAdmin.password).then((status) => {
            console.log("hai");
            if (status) {
              console.log("user exist");
              response.success = true;
              res.status(200).send({
                response,
                success: true,
                mobile: vAdmin.mobile,
                message: "User found",
              });
            } else {
              console.log("password is not matching");
              req.session.adminerrmsg = "Invalid Username or Password";
              res.status(401).send({
                response,
                success: false,
                message: req.session.adminerrmsg,
              });
            }
          });
        } else {
          req.session.adminerrmsg = "Account was Blocked Contact US";
          res.status(402).send({
            response,
            success: false,
            message: req.session.adminerrmsg,
          });
        }
      } else {
        req.session.adminerrmsg = "Invalid Username or Password";
        res.status(401).send({
          response,
          success: false,
          message: req.session.adminerrmsg,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Error verifying Admin" });
    }
  },

  sendOtp: async (req, res, next) => {
    try {
      const Otp = Math.floor(100000 + Math.random() * 909997);
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
  statusUserUpdate: async (req, res, next) => {
    try {
      const datainuser = await users.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.isActive) {
        value = false;
      } else {
        value = true;
      }
      users
        .findOneAndUpdate(
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
 
  statusMerchantUpdate: async (req, res, next) => {
    try {
      const datainuser = await merchants.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.isActive) {
        value = false;
      } else {
        value = true;
      }
      merchants
        .findOneAndUpdate(
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
  getUserProfile: async (req, res, next) => {
    try {
      const datainuser = await users.findById(req.params.userId);
      res.render("admin/userProfile", {
        title: "profile",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        userData: datainuser,
      });
    } catch (err) {
      console.error(err);
    }
  },
  getMerchantProfile: async (req, res, next) => {
    try {
      const datainuser = await merchants.findById(req.params.userId);
      res.render("admin/merchantProfile", {
        title: "profile",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        merchantData: datainuser,
      });
    } catch (err) {
      console.error(err);
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
};
