var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
var coupon = require("../models/couponSchema");
const otp = require("./otp");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  getAddCoupon: (req, res, next) => {
    res.render("admin/addCoupon", {
      title: "addCoupon",
      fullName: req.session.admin.fullName,
      adminLoggedin: req.session.adminLoggedIn,
      author: "Admin#1233!",
      category: req.category,
      colour: req.colour,
      pattern: req.pattern,
      genderType: req.genderType,
      errorout: req.session.errorout,
    });
    req.session.errorout = null;
  },
  getViewCoupon: async (req, res, next) => {
    try {
      res.render("admin/viewCategory", {
        title: "addCategory",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        category: req.category,
        colour: req.colour,
        pattern: req.pattern,
        genderType: req.genderType,
      });
    } catch (error) {
      console.log(error);
    }
  },

  postAddCoupon: async (req, res, next) => {
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
};
