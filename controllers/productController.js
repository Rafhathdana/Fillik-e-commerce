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
      const startIndex = (page - 1) * count;

      const matchObj = {
        merchantid: new mongoose.Types.ObjectId(req.session.merchant._id),
      };

      const [productList, totalProductsCount] = await Promise.all([
        Product.aggregate([
          { $match: matchObj },
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
        ]),
        Product.countDocuments(matchObj),
      ]);

      const totalPages = Math.ceil(totalProductsCount / count);
      if (page > totalPages) {
        throw new Error("Requested page does not exist");
      }

      const endIndex = Math.min(count, totalProductsCount - startIndex);

      const pagination = {
        totalCount: totalProductsCount,
        totalPages: totalPages,
        page: page,
        count: count,
        startIndex: startIndex,
        endIndex: endIndex,
      };
      console.log(productList);

      res.render("merchant/viewProducts", {
        title: "product",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        author: "Merchant#123!",
        productList,
        pagination,
        category: req.category,
        colour: req.colour,
        pattern: req.pattern,
        genderType: req.genderType,
      });
    } catch (error) {
      next(error);
    }
  },

  getAddProduct: async (req, res, next) => {
    try {
      res.render("merchant/addProduct", {
        title: "product",
        author: "Merchant#123!",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        category: req.category,
        colour: req.colour,
        pattern: req.pattern,
        genderType: req.genderType,
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
          orginalPrice: parseInt(req.body.orginalPrice),
          sellerPrice: parseInt(req.body.sellerPrice),
          ourPrice: parseInt((req.body.sellerPrice / 100) * 105),
          genderType: req.body.genderType,
          Quantity: {
            small: parseInt(req.body.small),
            medium: parseInt(req.body.medium),
            large: parseInt(req.body.large),
            extraLarge: parseInt(req.body.extraLarge),
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

      res.render("merchant/editProduct", {
        title: "product",
        author: "Merchant#123!",
        brandName: req.session.merchant.brandName,
        merchantLoggedin: req.session.merchantLoggedIn,
        productEdit,
        category: req.category,
        colour: req.colour,
        pattern: req.pattern,
        genderType: req.genderType,
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
        category: req.category,
        colour: req.colour,
        pattern: req.pattern,
        genderType: req.genderType,
        pagination, // pass pagination object to the view
      });
    } catch (error) {
      next(error);
    }
  },
  productquantity: async (productId, size) => {
    try {
      let canceled = "canceled";
      let sizeValue;
      console.log("size count:", size);

      switch (size) {
        case "S":
          sizeValue = "Quantity.small";
          break;
        case "M":
          sizeValue = "Quantity.medium";
          break;
        case "L":
          sizeValue = "Quantity.large";
          break;
        case "XL":
          sizeValue = "Quantity.extraLarge";
          break;
        default:
          throw new Error("Invalid size value");
      }
      console.log(sizeValue);
      const itemCount = await Product.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
            isActive: true,
          },
        },
        {
          $project: {
            itemCount: `$${sizeValue}`,
          },
        },
      ]);
      console.log(itemCount);
      if (itemCount.length === 0) {
        return 0;
      }
      return itemCount[0].itemCount;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // USER
  productList: async (req, res, next) => {
    try {
      const count = 20;
      const page = parseInt(req.query.page) || 1;
      const filter = req.filterData;
      const sort = req.sort;
      console.log(filter);
      let productsList;

      if (filter) {
        productsList = await Product.find(filter)
          .sort(sort)
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("hel");
        console.log(productsList);
      } else {
        productsList = await Product.find()
          .sort(sort)
          .skip((page - 1) * count)
          .limit(count)
          .lean();
        console.log("gad");
        console.log(productsList);
      }

      const totalCount = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
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
        res.render("user/productList", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          productsList,
          pagination,
          cartItems: req.cartItems,
          category: req.category,
          colour: req.colour,
          pattern: req.pattern,
          genderType: req.genderType,
        });
      } else {
        res.render("user/productlist", {
          title: "Product List",
          loggedin: false,
          productsList,
          cartItems: req.cartItems,
          pagination, // add pagination to the render parameters
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
  getProductView: async (req, res, next) => {
    try {
      const count = 10;
      const page = 1;
      const productsList = await Product.find()
        .skip((page - 1) * count)
        .limit(count)
        .lean();

      const totalPages = Math.ceil((await Product.countDocuments()) / count);
      const startIndex = (page - 1) * count;

      const endIndex = Math.min(
        startIndex + count,
        await Product.countDocuments()
      );
      const productItem = await Product.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.productId),
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
      console.log(productItem);
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
  adminProductDashboard: async (req, res, next) => {
    const weekProductData = await Product.aggregate([
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
    // Get month-wise new Products Productdata
    const monthProductData = await Product.aggregate([
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

    // Get year-wise new Products Productdata
    const yearProductData = await Product.aggregate([
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
    req.productReport = [weekProductData, monthProductData, yearProductData];
    next();
  },
};
