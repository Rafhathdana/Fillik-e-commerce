var Merchant = require("../models/merchantSchema");
var Product = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Order = require("../models/orderSchema");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const multer = require("multer");
const mongoose = require("mongoose");
module.exports = {
  getLogin: (req, res, next) => {
    res.render("merchant/login", {
      title: "merchant",
      err_msg: req.session.merchanterrmsg,
      merchantLoggedin: null,
    });
    req.session.merchanterrmsg = null;
  },
  getSignIn: (req, res, next) => {
    res.render("merchant/signup", {
      title: "merchant",
      err_msg: req.session.merchanterrmsg,
      merchantLoggedin: null,
    });
    req.session.merchanterrmsg = null;
  },
  getHome: (req, res, next) => {
    res.render("merchant/productlist", {
      title: "product",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
    });
  },
  getProductList: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const productList = await Product.aggregate([
        {
          $match: {
            merchantid: new mongoose.Types.ObjectId(req.session.merchant._id),
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "colour",
            foreignField: "_id",
            as: "colour",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "pattern",
            foreignField: "_id",
            as: "pattern",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "genderType",
            foreignField: "_id",
            as: "genderType",
          },
        },
        {
          $skip: (page - 1) * count,
        },
        {
          $limit: count,
        },
      ]);

      const totalPages = Math.ceil((await Product.countDocuments()) / count);
      const startIndex = 0;

      const endIndex = Math.min(startIndex + count, productList.length);

      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });
      res.render("merchant/productlist", {
        title: "product",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        productList,
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
    } catch (error) {
      next(error);
    }
  },
  getAddProduct: async (req, res, next) => {
    try {
      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });

      res.render("merchant/addProduct", {
        title: "product",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        category,
        colour,
        pattern,
        genderType,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getEditProduct: async (req, res, next) => {
    try {
      let productEdit = await Product.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.Id),
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "colour",
            foreignField: "_id",
            as: "colour",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "pattern",
            foreignField: "_id",
            as: "pattern",
          },
        },
        {
          $lookup: {
            from: "filterdatas",
            localField: "genderType",
            foreignField: "_id",
            as: "genderType",
          },
        },
      ]);
      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });

      res.render("merchant/editProduct", {
        title: "product",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        productEdit,
        category,
        colour,
        pattern,
        genderType,
      });
    } catch (error) {
      console.log(error);
    }
  },
  postEditProduct: async (req, res, next) => {
    try {
      const { id } = req.query;
      console.log(req.params.Id);
      console.log(req.body.name);
      console.log(req.body);
      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        colour: req.body.colour,
        pattern: req.body.pattern,
        orginalPrice: req.body.orginalPrice,
        sellerPrice: req.body.sellerPrice,
        ourPrice: (req.body.sellerPrice / 100) * 105,
        genderType: req.body.genderType,
        Quantity: {
          small: req.body.small,
          medium: req.body.medium,
          large: req.body.large,
          extraLarge: req.body.extraLarge,
        },
      };

      // update the product with the new data
      const updatedProductDoc = await Product.findByIdAndUpdate(
        req.params.Id,
        updatedProduct
      );

      console.log(updatedProductDoc);
      res.redirect("/merchant/home");
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/editproduct/id");
    }
  },
  postAddProduct: async (req, res, next) => {
    try {
      const images = [];
      let inumb = 0;
      const productcode = Date.now().toString();
      const filePath = `${__dirname}/../public/images/`;
      console.log(filePath);
      console.log(productcode);

      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, filePath);
        },
        filename: function (req, file, cb) {
          const originalName = file.originalname;
          const fileNameParts = originalName.split(".");
          const fileExtension = fileNameParts[fileNameParts.length - 1];
          const fileName = `product-${productcode}-${inumb}.${fileExtension}`;
          console.log(productcode);
          images.push(fileName);
          inumb++;
          cb(null, fileName);
        },
      });

      const upload = multer({ storage });

      // use upload.array instead of upload.single
      upload.array("images", 10)(req, res, async (err) => {
        if (err) {
          console.error(err);
          res.redirect("/merchant/signup");
          return;
        }

        console.log(req.body.name);
        console.log(req.body);
        const newProduct = new Product({
          productcode: productcode,
          merchantid: req.session.merchant._id,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          colour: req.body.colour,
          pattern: req.body.pattern,
          orginalPrice: req.body.orginalPrice,
          sellerPrice: req.body.sellerPrice,
          ourPrice: (req.body.sellerPrice / 100) * 105,
          genderType: req.body.genderType,
          Quantity: {
            small: req.body.small,
            medium: req.body.medium,
            large: req.body.large,
            extraLarge: req.body.extraLarge,
          },
          images: images,
          isActive: true,
        });

        // create new product after all data is available
        await newProduct.save();

        console.log(newProduct);
        res.redirect("/merchant/login");
      });
    } catch (error) {
      console.log(error + "hai");
      res.redirect("/merchant/signup");
    }
  },
  postSignup: async (req, res) => {
    try {
      const vMerchant = await Merchant.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      }).exec();

      if (!vMerchant) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newMerchant = new Merchant({
          brandName: req.body.brandName,
          outletName: req.body.outletName,
          regNumber: req.body.regNumber,
          email: req.body.email,
          gpsCoordinates: req.body.gpsCoordinates,
          pin: req.body.pin,
          password: hashedPassword,
          mobile: req.body.mobile,
          status: false,
          emailverified: false,
          mobileverification: true,
          isActive: true,
        });

        await Merchant.create(newMerchant);
        req.session.merchanterrmsg = null;
        console.log(newMerchant);
        res.redirect("/merchant/login");
      } else {
        // User exists
        req.session.merchanterrmsg = "email or mobile phone exists Already";
        res.redirect("/merchant/signup");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/signup");
    }
  },
  postSignin: async (req, res) => {
    try {
      const newMerchant = await Merchant.findOne({ email: req.body.email });
      console.log(newMerchant);
      if (newMerchant) {
        if (newMerchant.isActive === true) {
          bcrypt
            .compare(req.body.password, newMerchant.password)
            .then((status) => {
              console.log("hai");
              if (status) {
                console.log("user exist");
                req.session.merchant = newMerchant;
                req.session.merchantLoggedIn = true;
                console.log(newMerchant);
                res.redirect("/merchant/home");
              } else {
                console.log("password is not matching");
                req.session.merchanterrmsg = "Invalid Username or Password";
                res.status(400).redirect("/merchant/login");
              }
            });
        } else {
          req.session.merchanterrmsg = "Account was Blocked Contact US";
          res.status(402).redirect("/merchant/login");
        }
      } else {
        req.session.merchanterrmsg = "Invalid Username or Password";
        res.status(400).redirect("/merchant/login");
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
  deleteProduct: async (req, res, next) => {
    try {
      let productdetails = await Product.findById(req.params.Id);
      if (
        productdetails.Orders.small.length == 1 &&
        productdetails.Orders.medium.length == 1 &&
        productdetails.Orders.large.length == 1 &&
        productdetails.Orders.extraLarge.length == 1
      ) {
        Product.deleteOne({ _id: req.params.Id })
          .then((response) => {
            if (response) {
              res.sendStatus(204);
            } else {
              res.status(400).json({ message: "unable to delete Product" });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Internal server error" });
          });
      } else {
        res.status(500).json({ message: "Can't able to delete" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  statusProductUpdate: async (req, res, next) => {
    try {
      const datainuser = await Product.findById(req.params.userId);
      console.log(datainuser); // Check if datainuser is being logged correctly

      let value;
      if (datainuser && datainuser.isActive) {
        value = false;
      } else {
        value = true;
      }
      Merchant.findOneAndUpdate(
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
  getProfile: async (req, res, next) => {
    res.render("merchant/profile", {
      title: "profile",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      merchantData: req.session.merchant,
    });
  },
  getEditProfile: async (req, res, next) => {
    res.render("merchant/editProfile", {
      title: "Edit Profile",
      brandName: req.session.merchant.brandName,
      merchantLoggedin: req.session.merchantLoggedIn,
      merchantEdit: req.session.merchant,
    });
  },
  postEditProfile: async (req, res) => {
    try {
      const vMerchant = await Merchant.findOne({
        _id: req.session.merchant._id,
      }).exec();
      const existingMerchant = await Merchant.findOne({
        $or: [{ email: req.body.email }, { mobilePhone: req.body.mobilePhone }],
      });
      if (!existingMerchant || existingMerchant._id.equals(vMerchant._id)) {
        vMerchant.brandName = req.body.brandName;
        vMerchant.outletName = req.body.outletName;
        vMerchant.regNumber = req.body.regNumber;
        vMerchant.email = req.body.email;
        vMerchant.mobilePhone = req.body.mobilePhone;
        vMerchant.gpsCoordinates = req.body.gpsCoordinates;
        vMerchant.pin = req.body.pin;
        await vMerchant.save();
        req.session.merchanterrmsg = null;
        console.log(vMerchant);
        res.redirect("/merchant/dashboard");
      } else {
        // User exists
        req.session.merchanterrmsg = "Email or mobile phone already exists";
        res.redirect("/merchant/editprofile");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/editprofile");
    }
  },
};
