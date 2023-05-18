var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
const otp = require("../config/otp");
var filterproduct = require("../models/filterSchema");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  getAddCategory: async (req, res, next) => {
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
      req.category = await filterproduct.find({
        categoryname: "Category",
        isActive: true,
      });
      req.colour = await filterproduct.find({
        categoryname: "Colour",
        isActive: true,
      });
      req.pattern = await filterproduct.find({
        categoryname: "Pattern",
        isActive: true,
      });
      req.genderType = await filterproduct.find({
        categoryname: "GenderType",
        isActive: true,
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
          isActive: true,
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
  getFilter: async (req, res, next) => {
    console.log(req.body, "body");
    try {
      const { minPrice, maxPrice, sizes } = req.query;
      const genderType = req.query.genderType;
      const sorted = req.query.sorted;

      let sort = { createdAt: -1 };

      if (sorted) {
        let sortField = "ourPrice";
        let sortOrder = 1;

        if (sorted == "htl") {
          sortOrder = -1;
        } else if (sorted == "lth") {
          sortOrder = 1;
        } else if (sorted == "popularity") {
          sortOrder = 1;
        } else {
          sortField = "createdAt";
          sortOrder = -1;
        }
        sort = { [sortField]: sortOrder };
      }
      // Construct the filter object
      req.sort = sort;
      const filter = {};
      if (minPrice && maxPrice) {
        filter.ourPrice = {
          $gte: parseInt(minPrice),
          $lte: parseInt(maxPrice),
        };
      } else if (minPrice) {
        filter.ourPrice = { $gte: parseInt(minPrice) };
      } else if (maxPrice) {
        filter.ourPrice = { $lte: parseInt(maxPrice) };
      }

      if (genderType) {
        try {
          const genderTypeid = await filterproduct.findOne({
            values: genderType,
          });
          if (genderTypeid) {
            filter.genderType = genderTypeid._id;
          } else {
            // handle null case
            console.log("Gender type not found");
          }
        } catch (err) {
          // handle error
          console.error(err);
          res.sendStatus(500);
        }
      }

      if (sizes) {
        filter.sizes = { $in: sizes };
      }

      req.filterData = filter;
      console.log(filter, "filter");
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  postFilter: async (req, res, next) => {
    console.log(req.body, "body");
    try {
      const { minPrice, maxPrice, sizes } = req.body;
      const category = req.body["category[]"];
      const colour = req.body["colour[]"];
      const pattern = req.body["pattern[]"];
      const genderType = req.body.genderType;
      const sorted = req.body.sorted;

      let sort = { createdAt: -1 };

      if (sorted) {
        let sortField = "ourPrice";
        let sortOrder = 1;

        if (sorted == "htl") {
          sortOrder = -1;
        } else if (sorted == "lth") {
          sortOrder = 1;
        } else if (sorted == "popularity") {
          sortOrder = 1;
        } else {
          sortField = "createdAt";
          sortOrder = -1;
        }
        sort = { [sortField]: sortOrder };
      }
      // Construct the filter object
      req.sort = sort;
      const filter = {};
      if (minPrice && maxPrice) {
        filter.ourPrice = {
          $gte: parseInt(minPrice),
          $lte: parseInt(maxPrice),
        };
      } else if (minPrice) {
        filter.ourPrice = { $gte: parseInt(minPrice) };
      } else if (maxPrice) {
        filter.ourPrice = { $lte: parseInt(maxPrice) };
      }

      if (category) {
        filter.category = { $in: category };
      }

      if (genderType) {
        filter.genderType = genderType;
      }

      if (colour) {
        filter.colour = { $in: colour };
      }
      if (pattern) {
        filter.colour = { $in: pattern };
      }

      if (sizes) {
        filter.sizes = { $in: sizes };
      }

      req.filterData = filter;
      console.log(filter, "filter");
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  statusFilterUpdate: async (req, res, next) => {
    try {
      const datainuser = await filterproduct.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.isActive) {
        value = false;
      } else {
        value = true;
      }
      filterproduct
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
};
