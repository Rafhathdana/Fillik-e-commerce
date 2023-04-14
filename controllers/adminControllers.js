var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
var filterproduct = require("../models/filterSchema");
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

      const totalPages = Math.ceil((await users.countDocuments()) / count);
      const startIndex = (page - 1) * count;

      const endIndex = Math.min(
        startIndex + count,
        await users.countDocuments()
      );

      res.render("admin/users", {
        title: "Users List",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
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
    res.render("admin/login", {
      title: "admin",
      err_msg: req.session.adminerrmsg,
      adminLoggedin: null,
    });
    req.session.adminerrmsg = null;
  },
  getSignUp: (req, res, next) => {
    res.render("admin/signup", {
      title: "admin",
      err_msg: req.session.adminerrmsg,
      adminLoggedin: null,
    });
    req.session.adminerrmsg = null;
  },
  getAddCategory: (req, res, next) => {
    res.render("admin/addCategory", {
      title: "addCategory",
      fullName: req.session.admin.fullName,
      adminLoggedin: req.session.adminLoggedIn,
      categoryout: req.session.categoryout,
    });
    req.session.categoryout = null;
  },
  getViewCategory: async (req, res, next) => {
    try {
      const category = await filterproduct.find({ categoryname: "Category" });
      const colour = await filterproduct.find({ categoryname: "Colour" });
      const pattern = await filterproduct.find({ categoryname: "Pattern" });
      const genderType = await filterproduct.find({
        categoryname: "GenderType",
      });

      res.render("admin/viewCategory", {
        title: "addCategory",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        category,
        colour,
        pattern,
        genderType,
      });
    } catch (error) {
      console.log(error);
    }
  },

  postAddCategory: async (req, res, next) => {
    try {
      let categoryValuein = req.body.categoryvalue;
      categoryValuein = categoryValuein
        .toLowerCase()
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
      const newCategory = await filterproduct.findOne({
        categoryname: req.body.categorytype,
        values: categoryValuein,
      });
      if (!newCategory) {
        const newData = new filterproduct({
          categoryname: req.body.categorytype,
          values: categoryValuein,
        });
        filterproduct.create(newData);
        req.session.categoryout = "Added";
        res.status(204).redirect("/admin/addcategory");
      } else {
        req.session.categoryout = "already value found";
        res.status(400).redirect("/admin/addcategory");
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
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
  deleteCategory: async (req, res, next) => {
    try {
      filterproduct
        .deleteOne({ _id: req.params.Id })
        .then((response) => {
          if (response) {
            console.log("hai");
            res.sendStatus(204);
          } else {
            res.status(400).json({ message: "unable to delete Category" });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal server error" });
        });
    } catch (error) {
      console.log(error);
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
