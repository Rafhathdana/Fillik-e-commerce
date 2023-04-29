var Merchant = require("../models/merchantSchema");
var Product = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Order = require("../models/orderSchema");
const otp = require("../controllers/otp");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const multer = require("multer");
const mongoose = require("mongoose");
module.exports = {
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
      res.render("merchant/viewProducts", {
        title: "product",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        author: "Merchant#123!",
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
        author: "Merchant#123!",
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
  postAddProduct: async (req, res, next) => {
    try {
      const images = [];
      let inumb = 0;
      const productcode = Date.now().toString();
      const filePath = `${__dirname}/../public/images/productImages/`;
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
          moreinfo: req.body.moreinfo,
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
  //admin
  getAdminProductList: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const startIndex = (page - 1) * count;
      const orderBy = { $sort: { createdAt: -1 } };
      const match = {}; // add match object to filter products

      const productList = await Product.aggregate([
        { $match: match }, // add match stage
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
        { $sort: { createdAt: -1 } },
        { $skip: startIndex },
        { $limit: count },
      ]);
      console.log(productList);
      const totalProductsCount = await Product.countDocuments(match); // add match object to countDocuments method
      const totalPages = Math.ceil(totalProductsCount / count);

      let category = await filterproduct.find({ categoryname: "Category" });
      let colour = await filterproduct.find({ categoryname: "Colour" });
      let pattern = await filterproduct.find({ categoryname: "Pattern" });
      let genderType = await filterproduct.find({ categoryname: "GenderType" });

      const endIndex = Math.min(startIndex + count - 1, totalProductsCount - 1);

      const pagination = {
        totalCount: totalProductsCount,
        totalPages: totalPages,
        page: page,
        count: count,
        startIndex: startIndex,
        endIndex: endIndex,
      };
      console.log(pagination);
      res.render("admin/viewProducts", {
        title: "admin",
        fullName: req.session.admin.fullName,
        adminLoggedIn: req.session.adminLoggedIn,
        author: "Admin#1233!",
        productList,
        category,
        colour,
        pattern,
        genderType,
        pagination, // pass pagination object to the view
      });
    } catch (error) {
      next(error);
    }
  },
};
