var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var users = require("../models/userSchema");
var merchants = require("../models/merchantSchema");
var coupon = require("../models/couponSchema");
const otp = require("../config/otp");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const orderControllers = require("./orderControllers");
const order = require("../models/orderSchema");
const cart = require("../models/cartSchema");
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
    const coupons = await coupon.find();

    try {
      res.render("admin/viewCoupons", {
        title: "addCategory",
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        coupon: coupons,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getEditCoupon: async (req, res, next) => {
    try {
      const coupons = await coupon.find({ _id: req.params.Id });
      res.render("admin/editCoupons", {
        title: "editCoupons",
        coupon: coupons,
        fullName: req.session.admin.fullName,
        adminLoggedin: req.session.adminLoggedIn,
        author: "Admin#1233!",
        errorout: req.session.errorout,
      });
      req.session.errorout = null;
    } catch (error) {
      console.log(error);
    }
  },
  postAddCoupon: async (req, res, next) => {
    let couponCode = req.body.couponcode.toUpperCase();
    try {
      const newCoupon = await coupon.findOne({
        couponCode: couponCode,
      });
      if (!newCoupon) {
        const newData = new coupon({
          offertype: req.body.offertype,
          countAccess: parseInt(req.body.countAccess),
          minRupees: parseInt(req.body.minRupees),
          expiryDate: req.body.expirydate,
          maxPercentage: req.body.maxPercentage,
          maxDiscount: req.body.maxDiscount,
          countAccess: req.body.countAccess,
          couponCode: couponCode,
          status: true,
        });
        coupon.create(newData);
        req.session.errorout = "Added";
        res.status(204).redirect("/admin/addcoupon");
      } else {
        req.session.errorout = "already value found";
        res.status(400).redirect("/admin/addcoupon");
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  statusCodeUpdate: async (req, res, next) => {
    try {
      const datainuser = await coupon.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.status) {
        value = false;
      } else {
        value = true;
      }
      coupon
        .findOneAndUpdate(
          { _id: req.params.userId },
          { status: value },
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
  getCouponsList: async (req, res, next) => {
    try {
      const currentDateTime = new Date();
      const couponsList = await coupon.find({
        status: true,
        expiryDate: { $gte: currentDateTime },
      });
      req.couponsList = couponsList;
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  applyCoupon: async (req, res, next) => {
    try {
      const currentDateTime = new Date();
      const code = await coupon.findOne({
        couponCode: req.body.couponCode,
        status: true,
        expiryDate: { $gte: currentDateTime },
      });
      console.log(code);
      if (code) {
        const userUsedCount = await order.countDocuments({
          userId: req.session.user._id,
          "coupons.couponsId": code._id,
        });
        const CartCount = await cart.countDocuments({
          userId: req.session.user._id,
          "coupons.couponsId": code._id,
        });
        const cartList = await cart.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.session.user._id),
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
        ]);

        let total = 0;
        let discountAmount = 0;

        cartList.forEach((cartItem) => {
          const product = cartItem.product[0];
          const itemTotal = product.ourPrice * cartItem.quantity;
          total += itemTotal;
        });

        total = parseFloat(total.toFixed(2));
        let percentageAmount = (total / 100) * code.maxPercentage;
        if (total >= code.minRupees && percentageAmount > code.maxDiscount) {
          discountAmount = code.maxDiscount;
        } else if (
          total >= code.minRupees &&
          percentageAmount < code.maxDiscount
        ) {
          discountAmount = percentageAmount;
        } else {
          res.send({ getMinRupees: true });
        }

        if (userUsedCount < code.countAccess) {
          res.send({ getCode: true, code, discountAmount });
        } else {
          res.send({ getCode: false });
        }
      } else {
        res.send({ getCode: false });
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
};
