var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
const otp = require("../controllers/otp");
var filterproduct = require("../models/filterSchema");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  getAddCategory: (req, res, next) => {
    res.render("admin/addCategory", {
      title: "addCategory",
      fullName: req.session.admin.fullName,
      adminLoggedin: req.session.adminLoggedIn,
      author: "Admin#1233!",
      categoryout: req.session.categoryout,
    });
    req.session.categoryout = null;
  },
  getAllCategory: async (req, res, next) => {
    try {
      req.category = await filterproduct.find({ categoryname: "Category" });
      req.colour = await filterproduct.find({ categoryname: "Colour" });
      req.pattern = await filterproduct.find({ categoryname: "Pattern" });
      req.genderType = await filterproduct.find({
        categoryname: "GenderType",
      });
      next();
    } catch (error) {
      console.log(error);
    }
  },
  getViewCategory: async (req, res, next) => {
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
};
