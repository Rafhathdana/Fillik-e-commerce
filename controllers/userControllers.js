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
  getProductView: async (req, res, next) => {
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
      if (req.session.userLoggedIn) {
        res.render("user/productDetailView", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          cartItems: req.cartItems,
          productItem,
          productsList,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
        });
      } else {
        res.render("user/productDetailView", {
          title: "Users List",
          loggedin: false,
          cartItems: req.cartItems,
          productItem,
          productsList,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getProductlist: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
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
      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });
      if (req.session.userLoggedIn) {
        res.render("user/productlist", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
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
          count,
          cartItems: req.cartItems,
          page,
          totalPages,
          startIndex,
          endIndex,
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
  postSignin: async (req, res) => {
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

              res.redirect("/");
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
      console.log(req.body.mobile);
      if (!req.session.otP) {
        req.session.otP = Math.floor(100000 + Math.random() * 900000);
      } else {
      }
      console.log(req.session.otP);
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
      const filter = req.filterData;
      console.log(filter);
      let productsList;
      if (filter) {
        productsList = await Products.find(filter)
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("hel");
        console.log(productsList);
      } else {
        productsList = await Products.find()
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("gad");
        console.log(productsList);
      }
      const totalCount = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
      console.log(totalCount);
      const startIndex = (page - 1) * count;

      const endIndex = Math.min(
        startIndex + count,
        await Products.countDocuments(filter)
      );
      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });

      if (req.session.userLoggedIn) {
        res.render("user/productlist", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          cartItems: req.cartItems,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
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
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
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
  getFilter: async (req, res, next) => {
    try {
      let { minPrice, maxPrice, category, genderType, colour, sizes } =
        req.query;

      const filter = {};

      if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice) {
        filter.price = { $gte: minPrice };
      } else if (maxPrice) {
        filter.price = { $lte: maxPrice };
      }

      if (category) {
        filter.category = category;
      }

      if (genderType) {
        filter.genderType = genderType;
      }

      if (colour) {
        filter.colour = colour;
      }

      if (sizes) {
        filter.sizes = { $in: sizes };
      }

      req.filterData = filter;
      console.log(req.filterData);
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  postFilter: async (req, res, next) => {
    try {
      const { minPrice, maxPrice, category, genderType, colour, sizes } =
        req.body;
      // Construct the filter object
      const filter = {};

      if (minPrice && maxPrice) {
        filter.ourPrice = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice) {
        filter.ourPrice = { $gte: minPrice };
      } else if (maxPrice) {
        filter.ourPrice = { $lte: maxPrice };
      }

      if (category) {
        filter.category = category;
      }

      if (genderType) {
        filter.genderType = genderType;
      }

      if (colour) {
        filter.colour = colour;
      }

      if (sizes) {
        filter.sizes = { $in: sizes };
      }

      req.filterData = filter;
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
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
          quantity: 1,
          size: req.body.size,
        };
        console.log(cartItem);
        console.log(req.body.productId + " added to cart");
      } else {
        cartItem = placeData;
        cartItem.quantity += 1;
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
            images: "$product.images[0]",
            name: "$product.name",
            ourPrice: "$product.ourPrice/100",
            orginalPrice: "$product.orginalPrice",
            size: "$size",
            quantity: "$quantity",
          },
        },
      ]);
      console.log(items[0].images[0]);
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
    if (req.cartItems) {
      res.status(200).send({
        items,
        success: true,
        message: " successfull",
      });
    } else {
      res.status(500).send({
        items: [],
        success: false,
        message: " errror",
      });
    }
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
          ourPrice: "$product.ourPrice/100",
          orginalPrice: "$product.orginalPrice",
          size: "$size",
          quantity: "$quantity",
        },
      },
    ]);

    req.cartItems = items;
    console.log(req.cartItems);
    if (req.cartItems) {
      res.status(200).send({
        items,
        success: true,
        message: " successfull",
      });
    } else {
      res.status(500).send({
        items: [],
        success: false,
        message: " errror",
      });
    }
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

  productHome: async (req, res, next) => {
    try {
      const count = 20;
      const page = parseInt(req.query.page) || 1;
      const filter = req.filterData;
      console.log(filter);
      let productsList;
      if (filter) {
        productsList = await Products.find(filter)
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("hel");
        console.log(productsList);
      } else {
        productsList = await Products.find()
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("gad");
        console.log(productsList);
      }
      const totalCount = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
      console.log(totalCount);
      const startIndex = (page - 1) * count;

      const endIndex = Math.min(
        startIndex + count,
        await Products.countDocuments(filter)
      );
      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });

      if (req.session.userLoggedIn) {
        res.render("user/index", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          cartItems: req.cartItems,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
          category,
          colour,
          pattern,
          genderType,
        });
      } else {
        res.render("user/index", {
          title: "Product List",
          loggedin: false,
          productsList,
          cartItems: req.cartItems,
          count,
          page,
          totalPages,
          startIndex,
          endIndex,
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
};
