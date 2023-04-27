var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var Users = require("../models/userSchema");
var Address = require("../models/addressSchema");
var Cart = require("../models/cartSchema");
var Order = require("../models/orderSchema");
var coupon = require("../models/couponSchema");
const otp = require("./otp");
const razorPay = require("./payementController");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const cartSchema = require("../models/cartSchema");
const payementController = require("./payementController");
module.exports = {
  postOrder: async (req, res, next) => {
    const userId = req.session.user._id;
    const cartList = await Cart.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

    const userAddress = await Address.findById(req.body.addressId);
    let total = 0;
    const discountAmount = 0;
    const discountper = discountAmount / 3;
    const products = [];

    cartList.forEach((cartItem) => {
      const product = cartItem.product[0];
      const itemTotal = product.ourPrice * cartItem.quantity;
      total += itemTotal;

      products.push({
        productId: product._id,
        name: product.name,
        items: [
          {
            quantity: cartItem.quantity,
            size: cartItem.size,
          },
        ],
        sellRate: product.ourPrice,
        actualRate: product.sellerPrice,
        mrp: product.sellerPrice,
        payableAmount: itemTotal - discountper,
        status: "received",
      });
    });

    total = parseFloat(total.toFixed(2));
    const gst = parseFloat((total / 100) * 18).toFixed(2);
    const deliveryCharge = 0;
    total =
      parseFloat(total) +
      parseFloat(gst) +
      parseFloat(deliveryCharge) -
      parseFloat(discountAmount);
    total = parseFloat(total.toFixed(2));

    const newOrder = new Order({
      userId: req.session.user._id,
      products,
      address: {
        addressId: userAddress._id,
        houseName: userAddress.houseName,
        mobile: userAddress.mobile,
        place: userAddress.place,
        landMark: userAddress.landMark,
        city: userAddress.city,
        pinCode: userAddress.pinCode,
      },
      totalAmount: total,
      gst,
      deliveryCharge,
      coupons: {
        couponsId: "fghvjcfgcncg",
        discountAmount,
      },
      paymentMethod: req.body.paymentMethod,
      paymentStatus: "pending",
      status: true,
    });

    try {
      const response = await newOrder.save();
      const orderId = response._id;

      await Cart.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });

      req.order = {
        _id: orderId,
        totalAmount: total,
      }; // Add orderId and totalAmount to the request object

      next();
    } catch (err) {
      res.status(400).send({ success: false });
      return next(err);
    }
  },

  payment: async (req, res, next) => {
    const total = req.order.totalAmount * 100; // Get total from the order object
    const orderId = req.order._id; // Get orderId from the order object

    if (req.body.paymentMethod === "COD") {
      res.json({ codStatus: true });
    } else if (req.body.paymentMethod === "paypal") {
      payementController.genaretePaypal(orderId, total).then((link) => {
        payementController.changePaymentStatus(orderId).then(() => {
          res.json({ link, paypal: true });
        });
      });
    } else if (req.body.paymentMethod === "razorpay") {
      console.log("Reached RazorPay");
      payementController.generateRazorpay(orderId, total).then((response) => {
        console.log(response, "responsee");
        console.log(orderId, "ordeereeee");
        res.json(response);
      });
    }
  },

  getOrdersList: async (req, res, next) => {
    try {
      console.log(req.params.id);
      const userOrdersList = await Order.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
      ]);

      req.ordersList = userOrdersList;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getUserOrdersList: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const startIndex = (page - 1) * count;

      const userOrdersList = await Order.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.session.user._id),
          },
        },
        {
          $skip: startIndex,
        },
        {
          $limit: count,
        },
      ]);
      const totalOrdersCount = await Order.countDocuments({
        userId: new mongoose.Types.ObjectId(req.session.user._id),
      });

      const totalPages = Math.ceil(totalOrdersCount / count);

      const endIndex = Math.min(startIndex + count, totalOrdersCount);

      req.ordersList = userOrdersList;
      req.pagination = {
        totalCount: totalOrdersCount,
        totalPages: totalPages,
        currentPage: page,
        perPage: count,
        startIndex: startIndex,
        endIndex: endIndex,
      };

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.body.id,
        { $set: { status: req.body.orderStatus } },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
};

// // Get all orders
// router.get("/", async (req, res) => {
//     try {
//       const orders = await Order.find();
//       res.json(orders);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

//   // Get an order by ID
//   router.get("/:id", getOrder, (req, res) => {
//     res.json(res.order);
//   });

//   // Create a new order
//   router.post("/", async (req, res) => {
//     const order = new Order({
//       userid: req.body.userid,
//       merchantid: req.body.merchantid,
//       products: req.body.products,
//       address: req.body.address,
//       totalAmount: req.body.totalAmount,
//       gst: req.body.gst,
//       deliveryCharge: req.body.deliveryCharge,
//       coupons: req.body.coupons,
//       paymentMethod: req.body.paymentMethod,
//       paymentStatus: req.body.paymentStatus,
//       status: req.body.status,
//     });

//     try {
//       const newOrder = await order.save();
//       res.status(201).json(newOrder);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

//   // Update an order by ID
//   router.patch("/:id", getOrder, async (req, res) => {
//     if (req.body.userid != null) {
//       res.order.userid = req.body.userid;
//     }
//     if (req.body.merchantid != null) {
//       res.order.merchantid = req.body.merchantid;
//     }
//     if (req.body.products != null) {
//       res.order.products = req.body.products;
//     }
//     if (req.body.address != null) {
//       res.order.address = req.body.address;
//     }
//     if (req.body.totalAmount != null) {
//       res.order.totalAmount = req.body.totalAmount;
//     }
//     if (req.body.gst != null) {
//       res.order.gst = req.body.gst;
//     }
//     if (req.body.deliveryCharge != null) {
//       res.order.deliveryCharge = req.body.deliveryCharge;
//     }
//     if (req.body.coupons != null) {
//       res.order.coupons = req.body.coupons;
//     }
//     if (req.body.paymentMethod != null) {
//       res.order.paymentMethod = req.body.paymentMethod;
//     }
//     if (req.body.paymentStatus != null) {
//       res.order.paymentStatus = req.body.paymentStatus;
//     }
//     if (req.body.status != null) {
//       res.order.status = req.body.status;
//     }

//     try {
//       const updatedOrder = await res.order.save();
//       res.json(updatedOrder);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

//   // Delete an order by ID
//   router.delete("/:id", getOrder, async (req, res) => {
//     try {
//       await res.order.remove();
//       res.json({ message: "Order deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

//   // Middleware function to get an order by ID
//   async function getOrder(req, res, next) {
//     try {
//       const order = await Order.findById(req.params.id);
//       if (order == null) {
//         return res.status(404).json({ message: "
