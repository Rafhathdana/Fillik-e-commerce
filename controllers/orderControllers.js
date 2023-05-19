var Admin = require("../models/adminSchema");
const mongoose = require("mongoose");
var Users = require("../models/userSchema");
var Merchants = require("../models/merchantSchema");
var Address = require("../models/addressSchema");
var Cart = require("../models/cartSchema");
var Order = require("../models/orderSchema");
var coupon = require("../models/couponSchema");
const otp = require("../config/otp");
const razorPay = require("./payementController");
var Product = require("../models/productSchema");

const {
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const cartSchema = require("../models/cartSchema");
const payementController = require("./payementController");
const { order } = require("paypal-rest-sdk");
const productSchema = require("../models/productSchema");
module.exports = {
  postOrder: async (req, res, next) => {
    const userId = req.session.user._id;
    const ordercode = Date.now().toString();
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
    const currentDateTime = new Date();
    const code = await coupon.findOne({
      couponCode: req.body.couponCode,
      status: true,
      expiryDate: { $gte: currentDateTime },
    });
    if (code) {
      var userUsedCount = await Order.countDocuments({
        userId: req.session.user._id,
        "coupons.couponsId": code._id,
      });
    }
    const userAddress = await Address.findById(req.body.addressId);
    let total = 0;

    const products = [];

    for (const cartItem of cartList) {
      const product = cartItem.product[0];
      const itemTotal = product.ourPrice * cartItem.quantity;
      total += itemTotal;
      let sizes;
      if (cartItem.size === "S") {
        sizes = "small";
      } else if (cartItem.size === "M") {
        sizes = "medium";
      } else if (cartItem.size === "L") {
        sizes = "large";
      } else if (cartItem.size === "XL") {
        sizes = "extraLarge";
      }

      const k = await Product.find(
        { _id: new mongoose.Types.ObjectId(product._id) },
        { [`Quantity.${sizes}`]: 1 }
      );
      const balance = k[0].Quantity[sizes];
      console.log(balance);
      if (balance < cartItem.quantity) {
        return res.status(200).json({ noStock: true });
      } else {
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
          payableAmount: itemTotal,
          status: [
            {
              currentStatus: "initiated",
            },
          ],
        });
      }
    }

    total = parseFloat(total.toFixed(2));
    let discountAmount = 0;
    if (code) {
      if (userUsedCount < code.countAccess) {
        const percentageAmount = (total / 100) * code.maxPercentage;
        if (total >= code.minRupees && percentageAmount > code.maxDiscount) {
          discountAmount = code.maxDiscount;
        } else if (
          total >= code.minRupees &&
          percentageAmount < code.maxDiscount
        ) {
          discountAmount = percentageAmount;
        }
      }
    }
    const gst = parseFloat((total / 100) * 18).toFixed(2);
    const deliveryCharge = 40;
    total =
      parseFloat(total) +
      parseFloat(gst) +
      parseFloat(deliveryCharge) -
      parseFloat(discountAmount);
    total = parseFloat(total.toFixed(2));

    const newOrder = new Order({
      userId: req.session.user._id,
      orderCode: ordercode,
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
        couponsId: code
          ? code._id
            ? code._id
            : "fghvjcfgcncg"
          : "fghvjcfgcncg",
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
    console.log(newOrder);
    try {
      const response = await newOrder.save();
      const orderId = response._id;
      req.order = {
        _id: orderId,
        totalAmount: total,
      }; // Add orderId and totalAmount to the request object cons
      next();
    } catch (err) {
      res.status(400).send({ success: false });
      return next(err);
    }
  },

  payment: async (req, res, next) => {
    let total = req.order.totalAmount; // Get total from the order object
    total = parseInt(total);
    const orderId = req.order._id; // Get orderId from the order object
    console.log(total);
    if (req.body.paymentMethod === "COD") {
      Order.findOneAndUpdate(
        { _id: orderId },
        {
          $push: {
            status: {
              currentStatus: "placed",
            },
          },
        }
      ).then(() => {
        res.json({ codStatus: true, orderId: orderId });
      });
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
      const strId = orderId.toString();
      payementController.generateRazorpay(strId, total).then((response) => {
        console.log(response, "responsee");
        console.log(strId, "ordeereeee");
        res.json({ razorpay: true, response });
      });
    }
  },
  removeCartItemAndQuantity: async (req, res, next) => {
    console.log("done Upto here12");

    const userId = req.session.user._id;
    const orderId = req.params.id;
    const orderDetails = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$products" },
    ]);
    console.log(orderDetails);

    for (const product of orderDetails) {
      const productId = product.products.productId;
      let size = product.products.items[0].size;
      let quantity = product.products.items[0].quantity;

      if (size === "S") {
        size = "small";
      } else if (size === "M") {
        size = "medium";
      } else if (size === "L") {
        size = "large";
      } else if (size === "XL") {
        size = "extraLarge";
      }

      console.log(size);
      await Product.updateOne(
        { _id: productId },
        { $inc: { [`Quantity.${size}`]: -quantity } }
      );
      console.log("done Upto herew2");
    }
    console.log("done Upto here2");

    await Cart.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    next();
  },

  removeOrder: async (req, res, next) => {
    const userId = req.session.user._id;
    const orderId = req.params.id;
    await Order.deleteOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    res.redirect("/cart");
  },

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
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productsdetail",
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
      const { oid, pid, size, pvd, qty } = req.body;

      const order = await Order.findOne({
        _id: new mongoose.Types.ObjectId(oid),
        "products._id": new mongoose.Types.ObjectId(pid),
      });
      // Check if the latest status is initiated
      const latestStatus = order.status[order.status.length - 1].currentStatus;
      if (latestStatus === "initiated") {
        throw new Error("Unable to update cart when the status is initiated");
      }

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
      let sizee;
      if (
        req.body.orderStatus == "merchantCancel" ||
        req.body.orderStatus == "adminCancel" ||
        req.body.orderStatus == "usercancel" ||
        req.body.orderStatus == "recievedBack"
      ) {
        if (size === "S") {
          sizee = "small";
        } else if (size === "M") {
          sizee = "medium";
        } else if (size === "L") {
          sizee = "large";
        } else if (size === "XL") {
          sizee = "extraLarge";
        }
        var qtyr = parseInt(qty);
        await Product.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(pvd) },
          { $inc: { [`Quantity.${sizee}`]: qtyr } }
        );
      }
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
    const data = req.params.Data;
    let match = { "products.merchantId": new mongoose.Types.ObjectId(mid) };
    if (data) {
      const filter = { "products.status.currentStatus": data };
      match = { ...match, ...filter };
    }

    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            {
              $match: match,
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
                      orderCode: "$orderCode",
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
    console.log(orderList[0].products[0]);
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
  //merchant

  merchantStatusOrderList: async (req, res, next) => {
    const mid = req.session.merchant._id;
    const count = parseInt(req.query.count) || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;
    const data = req.params.Data;

    try {
      const result = await Order.aggregate([
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
                        orderCode: "$orderCode",
                        productId: "$$this.productId",
                        items: "$$this.items",
                        currentStatus: {
                          $arrayElemAt: ["$$this.status", -1],
                        },
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
                $count: "totalCount",
              },
            ],
          },
        },
        {
          $unwind: "$orders",
        },
        {
          $unwind: "$orders.products",
        },
        {
          $match: {
            "orders.products.currentStatus.currentStatus": data,
          },
        },
        { $sort: { _id: 1 } },
        { $skip: startIndex },
        { $limit: count },
      ]);
      const orderList = result;
      console.log(orderList[0]);

      const totalOrdersCount = orderList ? orderList.length : 0;

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
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      next(error);
    }
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
    const resultSuccess = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status.currentStatus": {
            $nin: ["usercancel", "merchantCancel", "adminCancel", "Returned"],
          },
        },
      },
      {
        $match: {
          "products.status.currentStatus": {
            $in: ["Completed"],
          },
        },
      },
      {
        $project: {
          status: "$products.status.currentStatus",
          sellRate: "$products.sellRate",
          actualRate: "$products.actualRate",
          quantity: { $arrayElemAt: ["$products.items.quantity", 0] },
          payableAmount: "$products.payableAmount",
          gst: "$gst",
          delivery: "$deliveryCharge",
          coupon: "$coupons.discountAmount",
          total: "$totalAmount",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          sellRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$sellRate" },
                { $toDouble: "$quantity" },
              ],
            },
          },
          actualRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$actualRate" },
                { $toDouble: "$quantity" },
              ],
            },
          },
          payableAmount: { $sum: { $toDouble: "$payableAmount" } },
          productCount: { $sum: 1 },
          gst: { $sum: { $toDouble: "$gst" } },
          delivery: { $sum: { $toDouble: "$delivery" } },
          coupon: { $sum: { $toDouble: "$coupon" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    const resultPending = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status.currentStatus": {
            $nin: [
              "usercancel",
              "merchantCancel",
              "adminCancel",
              "Returned",
              "Completed",
              "recievedBack",
            ],
          },
        },
      },
      {
        $project: {
          status: "$products.status.currentStatus",
          sellRate: "$products.sellRate",
          actualRate: "$products.actualRate",
          quantity: { $arrayElemAt: ["$products.items.quantity", 0] },
          payableAmount: "$products.payableAmount",
          gst: "$gst",
          delivery: "$deliveryCharge",
          coupon: "$coupons.discountAmount",
          total: "$totalAmount",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          sellRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$sellRate" },
                { $toDouble: "$quantity" },
              ],
            },
          },
          actualRate: {
            $sum: {
              $multiply: [
                { $toDouble: "$actualRate" },
                { $toDouble: "$quantity" },
              ],
            },
          },
          payableAmount: { $sum: { $toDouble: "$payableAmount" } },
          productCount: { $sum: 1 },
          gst: { $sum: { $toDouble: "$gst" } },
          delivery: { $sum: { $toDouble: "$delivery" } },
          coupon: { $sum: { $toDouble: "$coupon" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);
    const resultCancelled = await Order.aggregate([
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
          total: "$totalAmount",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    const resultReturned = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status.currentStatus": {
            $nin: ["usercancel", "merchantCancel", "adminCancel"],
          },
        },
      },
      {
        $match: {
          "products.status.currentStatus": {
            $in: ["Returned"],
          },
        },
      },
      {
        $project: {
          total: "$totalAmount",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    const resultReturnSuccess = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status.currentStatus": {
            $in: ["recievedBack"],
          },
        },
      },
      {
        $project: {
          total: "$totalAmount",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);
    req.resultSellRate = [
      resultSuccess,
      resultPending,
      resultReturnSuccess,
      resultReturned,
      resultCancelled,
    ];
    console.log(req.resultSellRate);
    next();
  },

  postSalesMerchant: async (req, res, next) => {
    const filter = {};
    var start, end;
    const selector = req.body.selector || req.query.selector;
    if (selector) {
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
        console.log(weekStart, "weekstart");
        console.log(weekEnd, "weekEnd");
      } else if (selector.startsWith("day")) {
        day = new Date(selector.slice(4));
        day.setHours(0, 0, 0, 0);
      }

      if (weekStart && weekEnd) {
        start = weekStart;
        end = weekEnd;
      }

      if (year && month) {
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
      }

      if (day) {
        start = new Date(day);
        end = new Date(day);
        end.setDate(end.getDate() + 1);
        end.setSeconds(end.getSeconds() - 1);
      }
      if (year) {
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
      }
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }
    req.filterData = filter;
    next();
  },
  getSalesMerchant: async (req, res, next) => {
    const mid = req.session.merchant._id;
    const count = parseInt(req.query.count) || 50;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;
    const filter = req.filterData;
    let match = { "products.merchantId": new mongoose.Types.ObjectId(mid) };
    if (filter) {
      match = { ...match, ...filter };
    }
    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            {
              $match: match,
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
                      orderCode: "$orderCode",
                      updatedAt: "$updatedAt",
                    },
                  },
                },
              },
            },
            { $skip: startIndex },
            { $limit: count },
            { $sort: { updatedAt: -1 } }, // Sort by the createdAt field in ascending order
          ],
          totalCount: [
            {
              $match: match,
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

    const salesList = result.orders;
    const totalOrdersCount = result.totalCount[0]
      ? result.totalCount[0].totalCount
      : 0;

    const totalPages = Math.ceil(totalOrdersCount / count);

    const endIndex = Math.min(startIndex + count, totalOrdersCount);

    req.salesList = salesList;
    console.log(req.salesList[0], "rafhath", "rafees");
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
  salesMerchantReport: async (req, res, next) => {
    const count = parseInt(req.query.count) || 50;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;

    const pipeline = [
      {
        $unwind: "$products",
      },
      {
        $addFields: {
          lastStatus: { $arrayElemAt: ["$products.status", -1] },
          quantityI: { $arrayElemAt: ["$products.items", 0] },
        },
      },
      {
        $lookup: {
          from: "merchants",
          localField: "products.merchantId",
          foreignField: "_id",
          as: "merchant",
        },
      },
      {
        $unwind: "$merchant",
      },
      {
        $group: {
          _id: "$merchant._id",
          completedAmountCount: {
            $sum: {
              $cond: [
                { $eq: ["$lastStatus.currentStatus", "Completed"] },
                { $multiply: ["$products.actualRate", "$quantityI.quantity"] },
                0,
              ],
            },
          },
          completedCount: {
            $sum: {
              $cond: [
                { $eq: ["$lastStatus.currentStatus", "Completed"] },
                1,
                0,
              ],
            },
          },
          userCancelCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$lastStatus.currentStatus",
                    ["usercancel", "merchantcancel", "admincancel"],
                  ],
                },
                1,
                0,
              ],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [
                {
                  $not: {
                    $in: [
                      "$lastStatus.currentStatus",
                      [
                        "usercancel",
                        "merchantcancel",
                        "admincancel",
                        "recievedBack",
                        "Returned",
                        "Completed",
                      ],
                    ],
                  },
                },
                1,
                0,
              ],
            },
          },
          returnedCount: {
            $sum: {
              $cond: [{ $eq: ["$lastStatus.currentStatus", "Returned"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalAmount: "$completedAmountCount",
          completedCount: 1,
          userCancelCount: 1,
          merchantCancelCount: 1,
          pendingCount: 1,
          returnedCount: 1,
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "totalCount" }],
          paginatedResults: [{ $skip: startIndex }, { $limit: count }],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    console.log(result);
    const salesMerchantList = result[0].paginatedResults || [];
    console.log(salesMerchantList);
    const totalOrdersCount = result[0].totalCount[0]
      ? result[0].totalCount[0].totalCount
      : 0;

    const totalPages = Math.ceil(totalOrdersCount / count);

    const endIndex = Math.min(startIndex + count, totalOrdersCount);

    req.salesMerchantList = salesMerchantList;
    req.pagination = {
      totalCount: totalOrdersCount,
      totalPages: totalPages,
      page: page,
      count: count,
      startIndex: startIndex,
      endIndex: endIndex,
    };

    next();
  },
  getsalesSalesReport: async (req, res, next) => {
    const count = parseInt(req.query.count) || 50;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;
    const filter = req.filterData;
    let match = {}; // Initialize match object
    if (filter) {
      match = { ...match, ...filter };
    }
    const pipeline = [
      {
        $match: match, // Add $match stage to filter documents
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the output
          orderCode: 1,
          totalAmount: 1,
          gst: 1,
          deliveryCharge: 1,
          discountAmount: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          status: 1,
          updatedAt: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          paginatedResults: [{ $skip: startIndex }, { $limit: count }],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    console.log(result);
    const salesSalesReport = result[0].paginatedResults || [];
    console.log(salesSalesReport);
    const totalOrdersCount = result[0].metadata[0]
      ? result[0].metadata[0].totalCount
      : 0;

    const totalPages = Math.ceil(totalOrdersCount / count);

    const endIndex = Math.min(startIndex + count, totalOrdersCount);

    req.salesSalesReport = salesSalesReport;
    req.pagination = {
      totalCount: totalOrdersCount,
      totalPages: totalPages,
      page: page,
      count: count,
      startIndex: startIndex,
      endIndex: endIndex,
    };

    next();
  },
  adminStatusOrderList: async (req, res, next) => {
    const count = parseInt(req.query.count) || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * count;
    const data = req.params.Data;

    try {
      const result = await Order.aggregate([
        {
          $facet: {
            orders: [
              {
                $project: {
                  _id: "$_id",
                  products: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$products",
                          as: "product",
                          cond: { $eq: ["$$product.status", data] },
                        },
                      },
                      in: {
                        id: "$$this._id",
                        orderCode: "$orderCode",
                        productId: "$$this.productId",
                        items: "$$this.items",
                        currentStatus: {
                          $arrayElemAt: ["$$this.status", -1],
                        },
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
                $count: "totalCount",
              },
            ],
          },
        },
        { $sort: { _id: 1 } },
        { $skip: startIndex },
        { $limit: count },
      ]);

      console.log(result);

      const orderList = result[0].orders;
      console.log(orderList);

      const totalOrdersCount = result[0].totalCount[0].totalCount;

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
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      next(error);
    }
  },
};
