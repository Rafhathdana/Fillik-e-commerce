var Merchant = require("../models/merchantSchema");
var Product = require("../models/productSchema");
var filterproduct = require("../models/filterSchema");
var Order = require("../models/orderSchema");
const otp = require("../config/otp");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const multer = require("multer");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");
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
      const productcode = Date.now().toString();

      const images = [];
      console.log(req.file, req.files);
      console.log(req.body);
      if (req.files) {
        const files = req.files.images;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const filePath = `public/images/productImages/`;
          const fileName = `product-${productcode}-${i}.${file.name
            .split(".")
            .pop()}`;

          file.mv(filePath + fileName, async (err) => {
            if (err) {
              throw err;
            }

            images.push(fileName);

            if (i === files.length - 1) {
              // All files uploaded, proceed with creating the product
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

              // Create new product after all data is available
              await newProduct.save();

              res.redirect("/merchant/login");
            }
          });
        }
      } else {
        console.error("No images were uploaded");
        res.redirect("/merchant/signup");
      }
    } catch (error) {
      console.log(error);
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
      const id = req.params.Id;
      console.log(id);
      const product = await Product.findById(id);
      console.log(product);
      const images = [];
      console.log(req.files, req.body);
      if (req.files && req.files["images[]"]) {
        const files = req.files["images[]"];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const filePath = `public/images/productImages/`;
          const fileName = `product-${product.productcode}-${i}.${file.name
            .split(".")
            .pop()}`;

          await file.mv(filePath + fileName);
          images.push(fileName);
        }
      } else {
        console.error("No images were uploaded");
        res.redirect("/merchant/signup");
        return;
      }

      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        colour: req.body.colour,
        pattern: req.body.pattern,
        originalPrice: parseInt(req.body.originalPrice),
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
      };

      await Product.findByIdAndUpdate(id, updatedProduct);

      res.redirect("/merchant/login");
    } catch (error) {
      console.log(error);
      res.redirect("/merchant/signup");
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
  getAdminFilterProductList: async (req, res, next) => {
    try {
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 1;
      const startIndex = (page - 1) * count;
      const orderBy = { $sort: { createdAt: -1 } };
      let tupe = req.params.type;
      const isActive = tupe === "true"; // Convert tupe to boolean
      const match = { isActive: isActive }; // Use isActive in the match object to filter products
      const productList = await Product.aggregate([
        { $match: match },
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
        orderBy,
        { $skip: startIndex },
        { $limit: count },
      ]);
      const totalProductsCount = await Product.countDocuments(match);
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
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  productquantity: async (productId, size) => {
    try {
      let canceled = "canceled";
      let sizeValue;

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
      let productsList;
      const startIndex = (page - 1) * count;

      if (filter) {
        productsList = await Product.find(filter)
          .sort(sort)
          .skip(startIndex)
          .limit(count)
          .lean();
      } else {
        productsList = await Product.find()
          .sort(sort)
          .skip(startIndex)
          .limit(count)
          .lean();
      }

      const totalCount = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / count);
      const endIndex = Math.min(count, totalCount - startIndex);

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
          wishlist: req.wishlist,
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
          wishlist: req.wishlist,
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
      if (req.session.userLoggedIn) {
        res.render("user/productDetailView", {
          title: "Users List",
          fullName: req.session.user.fullName,
          loggedin: req.session.userLoggedIn,
          cartItems: req.cartItems,
          wishlist: req.wishlist,
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
          wishlist: req.wishlist,
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
