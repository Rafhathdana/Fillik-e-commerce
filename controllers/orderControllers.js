var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var Users = require("../models/userSchema");
var Merchants = require("../models/merchantSchema");
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
const { order } = require("paypal-rest-sdk");
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
        merchantId: product.merchantid,
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
        status: [
          {
            currentStatus: "initiated",
          },
        ],
      });
    });

    total = parseFloat(total.toFixed(2));
    console.log(total + "hfgvb");
    const gst = parseFloat(total * 18).toFixed(2);
    console.log(total + "hfjogvb");
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
        name: userAddress.name,
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
      status: [
        {
          currentStatus: "initiated",
        },
      ],
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
    console.log(total);
    if (req.body.paymentMethod === "COD") {
      res.json({ codStatus: true });
    } else if (req.body.paymentMethod === "paypal") {
      payementController.genaretePaypal(orderId, total).then((link) => {
        Order.findOneAndUpdate(
          { _id: orderId },
          {
            $push: {
              status: {
                currentStatus: "placed",
              },
            },
            paymentStatus: "success",
          }
        ).then(() => {
          res.json({ link, paypal: true });
        });
      });
    } else if (req.body.paymentMethod === "razorpay") {
      console.log("Reached RazorPay");
      payementController.generateRazorpay(orderId, total).then((response) => {
        console.log(response, "responsee");
        console.log(orderId, "ordeereeee");
        res.json({ razorpay: true, response });
      });
    }
  },
  returnCartItem: (req, res, next) => {},
  verifyPaymentPost: (req, res) => {
    try {
      payementController
        .verifyPayment(req.body)
        .then(() => {
          console.log(req.body, "req.body");
          const orderId = req.body.order.receipt; // get the orderId from the request body
          Order.findOneAndUpdate(
            { _id: orderId },
            {
              $push: {
                status: {
                  currentStatus: "placed",
                },
              },
              paymentStatus: "success",
            }
          )
            .exec()
            .then(() => {
              console.log("Successfully updated payment status");
              res.json({ status: true });
            });
        })
        .catch((err) => {
          console.log(err, "Error in verifying payment");
          res.json({ status: false, erMsg: "Payment failed" });
        });
    } catch (error) {
      console.log("Something went wrong in payment verification");
      res.redirect("/SomethingWentWrong");
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
          $sort: {
            createdAt: -1,
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
        page,
        count,
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
      const { oid, pid, size } = req.body;
      console.log(oid, pid, size);

      const order = await Order.findOne({
        _id: new mongoose.Types.ObjectId(oid),
        "products._id": new mongoose.Types.ObjectId(pid),
      });
      console.log(order);
      // Check if the latest status is initiated
      const latestStatus = order.status[order.status.length - 1].currentStatus;
      if (latestStatus === "initiated") {
        throw new Error("Unable to update cart when the status is initiated");
      }
      console.log(oid, pid, size, "rafhath");

      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(oid),
          "products._id": new mongoose.Types.ObjectId(pid),
        },
        {
          $push: {
            "products.$[elem].status": {
              currentStatus: req.body.orderStatus,
              dateTimeOn: Date.now(),
            },
          },
        },
        {
          arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(pid) }],
        }
      );

      console.log(oid, pid, size, "rafhath");

      console.log("Successfully updated order status");
      res.json({ status: true });
    } catch (error) {
      console.log(req.body);
      next(error);
    }
  },

  //merchant
  merchantOrderList: async (req, res, next) => {
    const mid = req.session.merchant._id;
    const count = parseInt(req.query.count) || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;

    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $project: {
                _id: "$_id",
                products: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$products",
                        as: "product",
                        cond: {
                          $eq: [
                            "$$product.merchantId",
                            new mongoose.Types.ObjectId(mid),
                          ],
                        },
                      },
                    },
                    in: {
                      id: "$$this._id",
                      productId: "$$this.productId",
                      items: "$$this.items",
                      currentStatus: "$$this.status",
                      status: "$status",
                      amount: "$$this.actualRate",
                      name: "$$this.name",
                    },
                  },
                },
              },
            },
            { $skip: startIndex },
            { $limit: count },
          ],
          totalCount: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $group: {
                _id: "$_id",
              },
            },
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);

    const orderList = result.orders;
    const totalOrdersCount = result.totalCount[0]
      ? result.totalCount[0].totalCount
      : 0;

    const totalPages = Math.ceil(totalOrdersCount / count);

    const endIndex = Math.min(startIndex + count, totalOrdersCount);

    req.orderList = orderList;

    req.pagination = {
      totalCount: totalOrdersCount,
      totalPages: totalPages,
      page: page,
      count: count,
      startIndex: startIndex,
      endIndex: endIndex,
    };
    console.log(req.pagination);
    next();
  },
  merchantProductOrder: async (req, res, next) => {
    const mid = req.session.merchant._id;
    const pid = req.params.id;

    const [result] = await Order.aggregate([
      {
        $match: {
          "products.merchantId": new mongoose.Types.ObjectId(mid),
          "products._id": new mongoose.Types.ObjectId(pid),
        },
      },
      {
        $project: {
          _id: "$_id",
          products: {
            $map: {
              input: {
                $filter: {
                  input: "$products",
                  as: "product",
                  cond: {
                    $and: [
                      {
                        $eq: [
                          "$$product.merchantId",
                          new mongoose.Types.ObjectId(mid),
                        ],
                      },
                      {
                        $eq: [
                          "$$product._id",
                          new mongoose.Types.ObjectId(pid),
                        ],
                      },
                    ],
                  },
                },
              },
              in: {
                id: "$$this._id",
                productId: "$$this.productId",
                items: "$$this.items",
                status: "$status",
                amount: "$$this.actualRate",
                name: "$$this.name",
                address: "$address",
                orderId: "$_id",
              },
            },
          },
        },
      },
    ]);

    const orderList =
      result && result.products && result.products.length > 0
        ? result.products[0]
        : [];
    console.log(orderList);
    req.orderList = orderList;
    res.render("merchant/orderProductView", {
      title: "merchant",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      author: "Merchant#123!",
      merchantData: req.session.merchant,
      orderList: req.orderList,
    });
  },

  OrderStatusUpdate: async (req, res, next) => {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.body.oid),
          "products.productId": new mongoose.Types.ObjectId(req.body.pid),
          "products.items.size": req.body.size,
        },
        { $set: { "products.$.status": req.body.data } },
        { new: true }
      );
      console.log(updatedOrder);
      res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false });
    }
  },

  //admin

  adminOrderList: async (req, res, next) => {
    const count = parseInt(req.query.count) || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;

    const result = await Promise.all([
      Order.aggregate([
        {
          $project: {
            totalAmount: "$totalAmount",
            totalProduct: { $size: "$products" },
            paymentStatus: "$paymentStatus",
            userId: "$userId",
            paymentMethod: "$paymentMethod",
            status: "$status",
          },
        },
        { $skip: startIndex },
        { $limit: count },
        { $sort: { lastModified: -1 } },
      ]).exec(),
      Order.countDocuments(),
    ]);

    const orderList = result[0];
    const totalOrdersCount = result[1];

    const totalPages = Math.ceil(totalOrdersCount / count);

    const endIndex = Math.min(startIndex + count, totalOrdersCount);
    console.log(orderList);
    req.orderList = orderList;
    req.pagination = {
      totalCount: totalOrdersCount,
      totalPages: totalPages,
      currentPage: page,
      perPage: count,
      startIndex: startIndex,
      endIndex: endIndex,
    };
    next();
  },

  productcount: async (productId, size) => {
    try {
      let canceled = "canceled"; // Replace with the actual value of the canceled status
      console.log("productId:", productId, "size:", size);
      const saleCount = await Order.aggregate([
        { $unwind: "$products" },
        {
          $match: {
            "products.productId": new mongoose.Types.ObjectId(productId),
            "products.items": {
              $elemMatch: {
                size: size,
              },
            },
            "products.status.currentStatus": { $ne: canceled },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: {
              $sum: {
                $reduce: {
                  input: "$products.items",
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.quantity"] },
                },
              },
            },
          },
        },
      ]);

      console.log("saleCount:", saleCount); // Log the output to see if it contains any data

      if (saleCount && saleCount.length > 0) {
        return saleCount[0].totalQuantity;
      } else {
        console.log("No sale count found");
        return 0;
      }
    } catch (error) {
      console.error(error); // Log any errors
      throw error;
    }
  },
  dashboard: async (req, res, next) => {
    const mid = req.session.merchant._id;

    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $project: {
                _id: "$_id",
                products: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$products",
                        as: "product",
                        cond: {
                          $eq: [
                            "$$product.merchantId",
                            new mongoose.Types.ObjectId(mid),
                          ],
                        },
                      },
                    },
                    in: {
                      id: "$$this._id",
                      productId: "$$this.productId",
                      items: "$$this.items",
                      currentStatus: "$$this.status",
                      status: "$status",
                      amount: "$$this.actualRate",
                      name: "$$this.name",
                    },
                  },
                },
              },
            },
          ],
          totalCount: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $group: {
                _id: "$_id",
              },
            },
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);

    const orderList = result.orders;

    req.orderList = orderList;

    let totalCompleteAmount = 0;
    let totalCancelledAmount = 0;
    let totalReturnedAmount = 0;
    let totalReturnedPendingAmount = 0;
    let pendingAmount = 0;
    let totalCompleteOrder = 0;
    let totalCancelledOrder = 0;
    let totalReturnedOrder = 0;
    let totalReturnedPendingOrder = 0;
    let pendingOrder = 0;
    orderList.forEach((order) => {
      order.products.forEach((product) => {
        console.log(
          product.currentStatus[product.currentStatus.length - 1].currentStatus
        );
        if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "Completed"
        ) {
          product.items.forEach((item) => {
            totalCompleteAmount += item.quantity * product.amount;
          });
          totalCompleteOrder += 1;
          console.log(totalCompleteAmount + "totalCompleteAmount");
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "adminCancel" ||
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "merchantCancel" ||
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "usercancel"
        ) {
          product.items.forEach((item) => {
            totalCancelledAmount += item.quantity * product.amount;
          });
          totalCancelledOrder += 1;
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "recievedBack"
        ) {
          product.items.forEach((item) => {
            totalReturnedAmount += item.quantity * product.amount;
          });
          totalReturnedOrder += 1;
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "Returned"
        ) {
          product.items.forEach((item) => {
            totalReturnedPendingAmount += item.quantity * product.amount;
          });
          totalReturnedPendingOrder += 1;
        } else {
          product.items.forEach((item) => {
            pendingAmount += item.quantity * product.amount;
          });
          pendingOrder += 1;
        }
      });
    });

    req.totalresult = {
      totalCompleteAmount,
      totalCancelledAmount,
      totalReturnedAmount,
      totalReturnedPendingAmount,
      pendingAmount,
      totalCancelledOrder,
      totalReturnedOrder,
      totalCompleteOrder,
      totalReturnedPendingOrder,
      pendingOrder,
    };
    console.log(req.totalresult);
    const [resulte] = await Order.aggregate([
      {
        $match: {
          "products.merchantId": new mongoose.Types.ObjectId(mid),
        },
      },
      {
        $project: {
          orderDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          products: {
            $map: {
              input: {
                $filter: {
                  input: "$products",
                  as: "product",
                  cond: {
                    $eq: [
                      "$$product.merchantId",
                      new mongoose.Types.ObjectId(mid),
                    ],
                  },
                },
              },
              in: {
                id: "$$this._id",
                productId: "$$this.productId",
                items: "$$this.items",
                currentStatus: "$$this.status",
                status: "$status",
                amount: {
                  $convert: {
                    input: "$$this.actualRate",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                name: "$$this.name",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%U", date: { $toDate: "$orderDate" } },
          },
          orders: { $push: "$$ROOT" },
          totalAmount: {
            $sum: {
              $reduce: {
                input: "$products",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $sum: {
                        $map: {
                          input: "$$this.items",
                          as: "item",
                          in: {
                            $multiply: ["$$item.quantity", "$$this.amount"],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    req.weekreport = resulte;
    console.log(req.weekreport);

    next();
    // Get the orders with status 'Completed' and 'Returned' for a specific merchant
  },
  monthWise: async (req, res, next) => {
    const mid = req.session.merchant._id;
    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $project: {
                _id: "$_id",
                date: { $month: "$createdAt" },
                products: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$products",
                        as: "product",
                        cond: {
                          $eq: [
                            "$$product.merchantId",
                            new mongoose.Types.ObjectId(mid),
                          ],
                        },
                      },
                    },
                    in: {
                      id: "$$this._id",
                      productId: "$$this.productId",
                      items: "$$this.items",
                      currentStatus: "$$this.status",
                      status: "$status",
                      amount: "$$this.actualRate",
                      name: "$$this.name",
                    },
                  },
                },
              },
            },
          ],
          totalCount: [
            {
              $match: {
                "products.merchantId": new mongoose.Types.ObjectId(mid),
              },
            },
            {
              $group: {
                _id: "$_id",
              },
            },
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);

    const orderList = result.orders;

    req.orderList = orderList;
    const monthlyData = {};

    orderList.forEach((order) => {
      order.products.forEach((product) => {
        if (!monthlyData[order.date]) {
          monthlyData[order.date] = {
            totalCompleteAmount: 0,
            totalCancelledAmount: 0,
            totalReturnedAmount: 0,
            totalReturnedPendingAmount: 0,
            pendingAmount: 0,
            totalCompleteOrder: 0,
            totalCancelledOrder: 0,
            totalReturnedOrder: 0,
            totalReturnedPendingOrder: 0,
            pendingOrder: 0,
            totalCompleteQuantity: 0,
            totalCancelledQuantity: 0,
            totalReturnedQuantity: 0,
            totalReturnedPendingQuantity: 0,
            pendingQuantity: 0,
          };
        }

        if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "Completed"
        ) {
          product.items.forEach((item) => {
            monthlyData[order.date].totalCompleteAmount +=
              item.quantity * product.amount;
            monthlyData[order.date].totalCompleteQuantity += item.quantity;
          });
          monthlyData[order.date].totalCompleteOrder += 1;
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "adminCancel" ||
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "merchantCancel" ||
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "usercancel"
        ) {
          product.items.forEach((item) => {
            monthlyData[order.date].totalCancelledAmount +=
              item.quantity * product.amount;
            monthlyData[order.date].totalCancelledQuantity += item.quantity;
          });
          monthlyData[order.date].totalCancelledOrder += 1;
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "recievedBack"
        ) {
          product.items.forEach((item) => {
            monthlyData[order.date].totalReturnedAmount +=
              item.quantity * product.amount;
            monthlyData[order.date].totalReturnedQuantity += item.quantity;
          });
          monthlyData[order.date].totalReturnedOrder += 1;
        } else if (
          product.currentStatus[product.currentStatus.length - 1]
            .currentStatus === "Returned"
        ) {
          product.items.forEach((item) => {
            monthlyData[order.date].totalReturnedPendingAmount +=
              item.quantity * product.amount;
            monthlyData[order.date].totalReturnedPendingQuantity +=
              item.quantity;
          });
          monthlyData[order.date].totalReturnedPendingOrder += 1;
        } else {
          product.items.forEach((item) => {
            monthlyData[order.date].pendingAmount +=
              item.quantity * product.amount;
            monthlyData[order.date].pendingQuantity += item.quantity;
          });
          monthlyData[order.date].pendingOrder += 1;
        }
      });
    });

    req.monthlyData = monthlyData;
    console.log("hhkj");
    console.log(monthlyData);
    next();
  },

  //admin month wise
  adminDashboard: async (req, res, next) => {
    // Get week-wise new users data
    // First, get the monthly data from the server-side
    const results = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status.currentStatus": {
            $in: ["usercancel", "merchantCancel", "adminCancel"],
          },
        },
      },
      {
        $project: {
          yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          status: "$products.status.currentStatus",
          sellRate: "$products.sellRate",
          actualRate: "$products.actualRate",
          quantity: { $arrayElemAt: ["$products.items.quantity", 0] }, // Accessing the first element of the array using $arrayElemAt operator
          payableAmount: "$products.payableAmount",
        },
      },
      {
        $group: {
          _id: {
            yearMonth: "$yearMonth",
          },
          sellRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$sellRate" },
                { $toDouble: "$quantity" }, // Removed [0] as we already extracted the first element using $arrayElemAt
              ],
            },
          },
          actualRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$actualRate" },
                { $toDouble: "$quantity" }, // Removed [0] as we already extracted the first element using $arrayElemAt
              ],
            },
          },
          payableAmount: { $sum: { $toDouble: "$payableAmount" } },
          productCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.yearMonth": 1 },
      },
    ]);

    console.log(results);

    next();
  },
};
