const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 9000000000000000 * 900000000000 });
var User = require("../models/userSchema");
var Products = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Cart = require("../models/cartSchema");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const otp = require("../controllers/otp");
const mongoose = require("mongoose");
const Banner = require("../models/bannersSchema");
const orderControllers = require("./orderControllers");
const productController = require("./productController");
const moment = require("moment");
module.exports = {
  getSignUp: (req, res, next) => {
    res.render("user/signup", {
      title: "user",
      err_msg: req.session.errmsg,
      loggedin: false,
      cartItems: req.cartItems,
      noShow: true,
    });
    req.session.errmsg = null;
  },
  getSignIn: (req, res, next) => {
    res.render("user/signin", {
      title: "user",
      err_msg: req.session.errmsg,
      loggedin: false,
      noShow: true,
      cartItems: req.cartItems,
    });
    req.session.errmsg = null;
  },

  getProductlist: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const totalCount = await Products.countDocuments();
      const startIndex = (page - 1) * count;

      // Calculate the total number of pages based on the count and the total count
      const totalPages = Math.ceil(totalCount / count);

      // Generate a random offset based on the total count and the page size
      const randomOffset = Math.floor(Math.random() * (totalCount - count));

      const productsList = await Products.find()
        .skip(randomOffset + startIndex)
        .limit(count)
        .lean();

      const endIndex = Math.min(startIndex + count, totalCount);
      const pagination = {
        totalCount: totalCount, // change this to `totalCount` instead of `totalProductsCount`
        totalPages: totalPages,
        page: page,
        count: count,
        startIndex: startIndex,
        endIndex: endIndex,
      };
      if (req.session.userLoggedIn) {
        res.render("user/productlist", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          pagination, // add pagination to the render parameters
          category,
          colour,
          pattern,
          genderType,
        });
      } else {
        res.render("user/productlist", {
          title: "Product List",
          loggedin: false,
          productsList,
          cartItems: req.cartItems,
          pagination, // add pagination to the render parameters
          category,
          colour,
          pattern,
          genderType,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  postSignup: async (req, res) => {
    try {
      const vUser = await User.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (!vUser) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hashedPassword,
          mobile: req.body.mobile,
          status: false,
          emailverified: false,
          mobileverification: true,
          isActive: true,
        });

        await User.create(newUser);
        req.session.errmsg = null;
        console.log(newUser);
        res.redirect("/login");
      } else {
        // User exists
        req.session.errmsg = "email or mobile phone exists Already";
        console.log(error);
        res.redirect("/signup");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/signup");
    }
  },
  postSignin: async (req, res, next) => {
    try {
      const newUser = await User.findOne({ email: req.body.email });
      if (newUser) {
        if (newUser.isActive === true) {
          bcrypt.compare(req.body.password, newUser.password).then((status) => {
            if (status) {
              console.log("user exist");
              req.session.user = newUser;
              req.session.userLoggedIn = true;
              console.log(newUser);

              next();
            } else {
              console.log("password is not matching");
              req.session.errmsg = "Invalid Username or Password";
              res.status(400).redirect("/login");
            }
          });
        } else {
          req.session.errmsg = "Account was Blocked Contact US";
          res.status(402).redirect("/login");
        }
      } else {
        req.session.errmsg = "Invalid Username or Password";
        res.status(400).redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  },
  emailVerify: async (req, res, next) => {
    const response = {};
    try {
      const vUser = await User.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (vUser) {
        response.success = false;
        res.status(200).send({
          response,
          success: false,
          message: "User found",
        });
      } else {
        res.status(500).send({ success: true, message: "No user found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Error verifying user" });
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
  logout: (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },

  productFilterList: async (req, res, next) => {
    try {
      const count = 20;
      const page = parseInt(req.query.page) || 1;
      const filter = req.filterData || {};
      const sort = req.sort || { createdAt: -1 };
      console.log(count, page, filter, sort);
      productsList = await Products.find(filter)
        .sort(sort)
        .skip((page - 1) * count)
        .limit(count)
        .lean();
      console.log(productsList);
      const totalCount = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
      const startIndex = (page - 1) * count;
      const endIndex = Math.min(startIndex + count, totalCount);

      const categories = await filterproduct.aggregate([
        {
          $match: {
            categoryname: {
              $in: ["Category", "Colour", "Pattern", "GenderType"],
            },
          },
        },
        { $group: { _id: "$categoryname", values: { $addToSet: "$value" } } },
      ]);

      const pagination = {
        totalCount,
        totalPages,
        page,
        count,
        startIndex,
        endIndex,
      };

      const loggedIn = req.session.userLoggedIn || false;
      const fullName = req.session.user?.fullName || "";

      res.render("user/product", {
        title: "Product List",
        noShow: true,
        loggedIn,
        fullName,
        productsList,
        categories,
        pagination,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  searchProductFilterList: async (req, res, next) => {
    try {
      const count = 20;
      const page = parseInt(req.query.page) || 1;
      const filter = req.filterData || {};
      const sort = req.sort || { createdAt: -1 };
      filter.name = { $regex: `.*${req.body.value}.*`, $options: "i" };
      console.log(count, page, filter, sort);

      let productsList = await Products.find(filter)
        .sort(sort)
        .skip((page - 1) * count)
        .limit(count)
        .lean();
      console.log(productsList);
      const totalCount = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
      const startIndex = (page - 1) * count;
      const endIndex = Math.min(startIndex + count, totalCount);

      const categories = await filterproduct.aggregate([
        {
          $match: {
            categoryname: {
              $in: ["Category", "Colour", "Pattern", "GenderType"],
            },
          },
        },
        { $group: { _id: "$categoryname", values: { $addToSet: "$value" } } },
      ]);

      const pagination = {
        totalCount,
        totalPages,
        page,
        count,
        startIndex,
        endIndex,
      };

      const loggedIn = req.session.userLoggedIn || false;
      const fullName = req.session.user?.fullName || "";

      res.render("user/product", {
        title: "Product List",
        noShow: true,
        loggedIn,
        fullName,
        productsList,
        categories,
        pagination,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  getCart: async (req, res, next) => {
    try {
      const count = 10;
      const page = 1;
      const productsList = await Products.find()
        .skip((page - 1) * count)
        .limit(count)
        .lean();

      const totalPages = Math.ceil((await Products.countDocuments()) / count);
      const startIndex = (page - 1) * count;

      const endIndex = Math.min(
        startIndex + count,
        await Products.countDocuments()
      );
      const productItem = await Products.findById(req.params.productId);

      let cartList = await Cart.aggregate([
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

      res.render("user/cart", {
        title: "Users List",
        fullName: req.session.user.fullName,
        loggedin: req.session.userLoggedIn,
        cartList,
        productsList,
        userAddresses: req.userAddressess,
        couponsList: req.couponsList,
        startIndex,
        endIndex,
        totalPages,
        productItem,
      });
    } catch (error) {
      next(error);
    }
  },
  cachePostCart: async (req, res, next) => {
    try {
      const place = req.body.productId + req.body.size;
      const placeData = cache.get(place) || {};

      let cartItem;
      if (!placeData.productId) {
        cartItem = {
          productId: req.body.productId,
          quantity: req.body.quantity || 1,
          size: req.body.size,
        };
        console.log(cartItem);
        console.log(req.body.productId + " added to cart");
      } else {
        cartItem = placeData;
        cartItem.quantity = req.body.quantity || cartItem.quantity + 1;
        console.log(cartItem);
        console.log(req.body.productId + " quantity increased in cart");
      }

      cache.set(place, cartItem);
      console.log("Cart updated in cache");

      res.status(200).send({
        success: true,
        message: " successfull",
      });
    } catch (error) {
      console.error("Error updating cart in cache:", error);
      res.sendStatus(500);
      next(error);
    }
  },
  postAddCart: async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const { productId, size, quantity = 1 } = req.body;
      if (!productId || !size) {
        throw new Error("Missing required parameters");
      }
      const cartItem = { productId, size };
      const cart = await Cart.findOneAndUpdate(
        { userId, ...cartItem },
        { $set: { quantity: quantity } }, // Add $set operator to update quantity property
        { upsert: true, new: true }
      );
      if (cart) {
        res.status(200).json({
          success: true,
          message: " successfull",
        });
      } else {
        return res.sendStatus(500);
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
  getUserCart: async (req, res, next) => {
    try {
      let items = await Cart.aggregate([
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
        {
          $project: {
            productId: "$productId",
            images: "$product.images",
            name: "$product.name",
            ourPrice: "$product.ourPrice",
            orginalPrice: "$product.orginalPrice",
            size: "$size",
            quantity: "$quantity",
            id: "$_id",
          },
        },
      ]);
      req.cartItems = items;
      next();
    } catch (error) {
      next(error);
    }
  },
  getCartLocal: async (req, res, next) => {
    const cart = cache.mget(cache.keys()) || {};
    const items = [];

    for (const key in cart) {
      const item = cart[key];
      try {
        console.log(item.productId);
        console.log(item.quantity);
        const product = await Products.findOne(
          {
            _id: new mongoose.Types.ObjectId(item.productId),
          },
          {
            images: 1,
            name: 1,
            ourPrice: 1,
            orginalPrice: 1,
            _id: 0,
          }
        );
        console.log(product);
        if (product) {
          items.push({
            productId: item.productId,
            images: product.images,
            name: product.name,
            ourPrice: product.ourPrice,
            orginalPrice: product.orginalPrice,
            size: item.size,
            quantity: item.quantity,
          });
        }
      } catch (error) {
        console.log("error in finding product: ", error);
      }
    }
    req.cartItems = items;
    next();
  },
  getCartVariableLocal: async (req, res, next) => {
    const cart = cache.mget(cache.keys()) || {};
    const items = [];

    for (const key in cart) {
      const item = cart[key];
      try {
        const product = await Products.findOne(
          {
            _id: new mongoose.Types.ObjectId(item.productId),
          },
          {
            images: 1,
            name: 1,
            ourPrice: 1,
            orginalPrice: 1,
            _id: 0,
          }
        );
        console.log(product);
        if (product) {
          items.push({
            productId: item.productId,
            images: product.images,
            name: product.name,
            ourPrice: product.ourPrice,
            orginalPrice: product.orginalPrice,
            size: item.size,
            quantity: item.quantity,
          });
        }
      } catch (error) {
        console.log("error in finding product: ", error);
      }
    }

    req.cartItems = items;
    console.log(req.cartItems);

    res.render("user/sidecart", {
      title: "cart List",
      loggedin: false,
      cartItems: req.cartItems,
      noShow: true,
    });
  },
  getVariableCart: async (req, res, next) => {
    let items = await Cart.aggregate([
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
      {
        $project: {
          productId: "$productId",
          images: "$product.images",
          name: "$product.name",
          ourPrice: "$product.ourPrice",
          orginalPrice: "$product.orginalPrice",
          size: "$size",
          quantity: "$quantity",
        },
      },
    ]);

    req.cartItems = items;
    console.log(req.cartItems, "logged");
    res.render("user/sidecart", {
      title: "cart List",
      loggedin: req.session.userLoggedIn,
      cartItems: req.cartItems,
      noShow: true,
    });
    return;
  },
  getMainVariableCart: async (req, res, next) => {
    let cartList = await Cart.aggregate([
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
    console.log(cartList);
    res.render("user/cartdesign", {
      title: "Users cartdesign",
      noShow: true,
      fullName: req.session.user.fullName,
      loggedin: req.session.userLoggedIn,
      cartList,
      userAddresses: req.userAddressess,
    });
    return;
  },
  forgetPassword: async (req, res, next) => {
    res.render("user/forgetPassword", {
      title: "user",
      err_msg: req.session.errmsg,
      loggedin: false,
    });
    req.session.errmsg = null;
  },
  getProfile: async (req, res, next) => {
    res.render("user/profile", {
      title: "profile",
      fullName: req.session.user.fullName,
      loggedin: req.session.userLoggedIn,
      userData: req.session.user,
    });
  },
  getEditProfile: async (req, res, next) => {
    res.render("user/editProfile", {
      title: "Edit profile",
      fullName: req.session.user.fullName,
      loggedin: req.session.userLoggedIn,
      userEdit: req.session.user,
    });
  },

  // new methods
  banner: async (req, res, next) => {
    var banner = await Banner.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(3);
    req.banner = banner;
    next();
    // do something with the banner data
  },
  productHome: async (req, res, next) => {
    try {
      const filter = req.filterData || {};
      console.log(filter);
      const count = parseInt(req.query.count) || 20;
      const page = parseInt(req.query.page) || 1;
      const totalCount = await Products.countDocuments(filter);

      // Calculate the total number of pages based on the count and the total count
      const totalPages = Math.ceil(totalCount / count);

      // Generate a random sort field and direction
      const sortOptions = [
        { field: "createdAt", direction: -1 },
        { field: "category", direction: 1 },
      ];

      const randomIndex = Math.floor(Math.random() * sortOptions.length);
      const { field, direction } = sortOptions[randomIndex];
      const randomSort = { [field]: direction };

      const skip = (page - 1) * count;
      const safeSkip = Math.max(0, skip); // Ensure skip is non-negative

      const productsList = await Products.find(filter)
        .sort(randomSort)
        .skip(safeSkip)
        .limit(count)
        .lean();

      console.log(totalCount);

      const startIndex = (page - 1) * count;
      const endIndex = Math.min(startIndex + count, totalCount);
      const pagination = {
        totalCount: totalCount,
        totalPages: totalPages,
        page: page,
        count: count,
        startIndex: startIndex,
        endIndex: endIndex,
      };
      if (req.session.userLoggedIn) {
        res.render("user/index", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          cartItems: req.cartItems,
          pagination,
          banner: req.banner,
          category: req.category,
          colour: req.colour,
          pattern: req.pattern,
          genderType: req.genderType,
        });
      } else {
        res.render("user/index", {
          title: "Product List",
          loggedin: false,
          productsList,
          cartItems: req.cartItems,
          pagination,
          banner: req.banner,
          category: req.category,
          colour: req.colour,
          pattern: req.pattern,
          genderType: req.genderType,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  userOrdersList: async (req, res, next) => {
    try {
      console.log(req.ordersList);
      res.render("user/ordersList", {
        title: "Users List",
        fullName: req.session.user.fullName,
        loggedin: req.session.userLoggedIn,
        ordersList: req.ordersList,
        pagination: req.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  OrdersList: async (req, res, next) => {
    try {
      console.log(req.ordersList[0]);
      res.render("user/ordersView", {
        title: "Users List",
        fullName: req.session.user.fullName,
        loggedin: req.session.userLoggedIn,
        ordersList: req.ordersList[0],
      });
    } catch (error) {
      next(error);
    }
  },
  deleteItemCrt: async (req, res, next) => {
    try {
      if (req.session.userLoggedIn) {
        console.log(req.body.id);
        const result = await Cart.deleteOne({
          _id: new mongoose.Types.ObjectId(req.body.id),
        });
        console.log(`${result.deletedCount} item(s) deleted from cart`);
      } else {
        console.log(req.body);
        const place = req.body.id + req.body.size;
        console.log(place);
        cache.del(place);
        console.log(`Item at place ${place} deleted from cache`);
      }
      res.status(200).send({
        success: true,
      });
    } catch (error) {
      next(error);
      res.status(201).send({ success: false });
    }
  },
  signinconvert: async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const cacheKeys = cache.keys();
      const cartItems = [];

      // Get all cart items from cache
      for (const key of cacheKeys) {
        const cacheItem = cache.get(key);
        if (cacheItem && cacheItem.productId && cacheItem.size) {
          cartItems.push({
            productId: cacheItem.productId,
            size: cacheItem.size,
            quantity: cacheItem.quantity || 1,
          });
        }
      }

      // Add cart items to user's cart in the database
      for (const cartItem of cartItems) {
        const dbCartItem = await Cart.findOneAndUpdate(
          { userId, ...cartItem },
          { quantity: cartItem.quantity },
          { upsert: true, new: true }
        );
        if (!dbCartItem) {
          console.log("Error adding cart item to database:", cartItem);
        } else {
          console.log("Cart item added to database:", dbCartItem);
        }
      }

      // Clear cache after adding to user's cart in the database
      if (cache.clear && typeof cache.clear === "function") {
        cache.clear();
      }

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error adding cart items to database",
      });
    }
  },

  getPaymentSucces: (req, res) => {
    res.render("user/paymentSuccess", {
      title: "Users List",
      fullName: req.session.user.fullName,
      loggedin: req.session.userLoggedIn,
    });
  },
  changeProductQuantity: async (req, res, next) => {
    var count = req.body.count;
    if (count == "-1") {
      var count = -1;
    } else {
      var count = 1;
    }
    var quantity = parseInt(req.body.quantity);
    var size = req.body.size;
    var productId = req.body.proId;
    var cartId = req.body.cartId;
    console.log(count, quantity, size, productId, cartId);
    try {
      // const sellcount = await orderControllers.productcount(productId, size);
      // console.log("Sell count:", sellcount);
      // const itemcount = await productController.productquantity(
      //   productId,
      //   size
      // );
      let sizes;
      if (size === "S") {
        sizes = "small";
      } else if (size === "M") {
        sizes = "medium";
      } else if (size === "L") {
        sizes = "large";
      } else if (size === "XL") {
        sizes = "extraLarge";
      }

      let k = await Products.find(
        { _id: productId },
        { [`Quantity.${sizes}`]: 1 }
      );
      let balance = k[0].Quantity[sizes];
      console.log(balance);
      if (balance === 0) {
        res.status(200).json({ noStock: true });
      }
      if (balance > quantity + 1) {
        await Cart.updateOne(
          {
            _id: new mongoose.Types.ObjectId(cartId),
            productId: new mongoose.Types.ObjectId(productId),
            size: size,
          },
          { quantity: quantity + count }
        );
      } else {
        await Cart.updateOne(
          {
            _id: new mongoose.Types.ObjectId(cartId),
            productId: new mongoose.Types.ObjectId(productId),
            size: size,
          },
          { quantity: balance }
        );
      }
      res.status(200).json({
        message: "Product quantity updated successfully.",
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", success: false });
    }
  },
  adminUserDashboard: async (req, res, next) => {
    const weekUserData = await User.aggregate([
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
    // Get month-wise new users Userdata
    const monthUserData = await User.aggregate([
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

    // Get year-wise new users Userdata
    const yearUserData = await User.aggregate([
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
    req.userReport = [weekUserData, monthUserData, yearUserData];
    next();
  },
};
