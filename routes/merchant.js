var express = require("express");
var router = express.Router();
const merchantController = require("../controllers/merchantControllers");
const productController = require("../controllers/productController");
const multer = require("multer");
const orderControllers = require("../controllers/orderControllers");
const filterController = require("../controllers/filterController");

// Middleware
// Middleware to check if merchant is authenticated
function merchantauth(req, res, next) {
  if (req.session && req.session.merchant && req.session.merchantLoggedIn) {
    res.redirect("/merchant/");
  } else {
    next();
  }
}

// Middleware to verify merchant authentication
function merchantverify(req, res, next) {
  if (req.session && req.session.merchant && req.session.merchantLoggedIn) {
    next();
  } else {
    res.redirect("/merchant/login");
  }
}

// Dashboard
router.get(
  "/",
  merchantverify,
  orderControllers.dashboard,
  orderControllers.monthWise,
  merchantController.getDashBoard
);

// Sign in and up
router.get("/signup", merchantauth, merchantController.getSignIn); // Sign up page
router.get("/login", merchantauth, merchantController.getLogin); // Login page
router.get("/otpLogin", merchantauth, merchantController.getSignOtpIn);
router.get(
  "/addproduct",
  merchantverify,
  filterController.getAllCategory,
  productController.getAddProduct
); // Add product page
router.post("/addproduct", merchantverify, productController.postAddProduct); // Add product submission
router.get(
  "/productList",
  merchantverify,
  filterController.getAllCategory,
  productController.getProductList
); // Product list
router.post("/signup", merchantauth, merchantController.postSignup); // Sign up submission
router.post("/login", merchantauth, merchantController.postSignin); // Login submission
router.post("/mobileexists", merchantController.mobileVerify); // Check mobile exists
router.get("/forgetPassword", merchantauth, merchantController.forgetPassword); // Forget password page
router.post(
  "/verifyotpLogin",
  merchantauth,
  merchantController.verifyMobileOtp
); // OTP login
router.post("/emailOtp", merchantauth, merchantController.sendOtpEmail); // Send emailed OTP
router.post("/verifyedotp", merchantauth, merchantController.verifyedOtp); // Verify OTP when forget password is occurred
router.post("/updatePassword", merchantController.updatePassword); // Change password
router.get("/profile", merchantverify, merchantController.getProfile); // Profile page
router.get(
  "/editproduct/:Id",
  merchantverify,
  filterController.getAllCategory,
  productController.getEditProduct
); // Edit product page
router.post("/editproduct/:Id", productController.postEditProduct); // Edit product submission
router.get("/editprofile", merchantverify, merchantController.getEditProfile); // Edit profile page
router.post("/editprofile", merchantverify, merchantController.postEditProfile); // Edit profile submission
router.get("/logout", merchantController.logout); // Logout
router.delete(
  "/deleteProduct/:Id",
  merchantverify,
  merchantController.deleteProduct
); // Delete product
router.post(
  "/statusUpdateProduct/:userId",
  merchantverify,
  merchantController.statusProductUpdate
); // Update product status
router.post("/emailpassexists", merchantController.emailPasswordVerify); // Check email and password exists
router.post("/emailmobileexists", merchantController.emailMobileVerify); // Check email and mobile exists
router.post("/sendotp", merchantController.sendOtp); // Send OTP
router.post("/verifyotp", merchantController.verifyOtp); // Verify OTP

router.get(
  "/orderList",
  merchantverify,
  orderControllers.merchantOrderList,
  merchantController.orderList
); // Order list
router.get(
  "/orderList/:Data",
  merchantverify,
  orderControllers.merchantStatusOrderList,
  merchantController.orderFilterList
); // Filtered order list
router.get(
  "/orderedDetails/:id",
  merchantverify,
  orderControllers.merchantProductOrder
); // Order details
router.get(
  "/salesReport",
  merchantverify,
  orderControllers.postSalesMerchant,
  orderControllers.getSalesMerchant,
  merchantController.salesList
); // Sales report
router.post(
  "/salesReport",
  merchantverify,
  orderControllers.postSalesMerchant,
  orderControllers.getSalesMerchant,
  merchantController.salesList
); // Sales report submission
router.post("/updateOrderStatus", merchantverify, orderControllers.updateOrder); // Update order status
router.post("/changeprofile", merchantverify, merchantController.changePhoto); // Change profile photo

module.exports = router;
