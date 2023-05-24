var express = require("express");
var router = express.Router();
const merchantController = require("../controllers/merchantControllers");
const productController = require("../controllers/productController");
const multer = require("multer");
const orderControllers = require("../controllers/orderControllers");
const filterController = require("../controllers/filterController");
function merchantauth(req, res, next) {
  if (req.session && req.session.merchant && req.session.merchantLoggedIn) {
    res.redirect("/merchant/");
    console.log(req.session.merchantLoggedIn);
  } else {
    next();
  }
}
function merchantverify(req, res, next) {
  if (req.session && req.session.merchant && req.session.merchantLoggedIn) {
    console.log(req.session.merchantLoggedIn);
    next();
  } else {
    res.redirect("/merchant/login");
  }
}
router.get(
  "/",
  merchantverify,
  orderControllers.dashboard,
  orderControllers.monthWise,
  merchantController.getDashBoard
); //almost
router.get("/signup", merchantauth, merchantController.getSignIn); //almost
router.get("/login", merchantauth, merchantController.getLogin); //almost
router.get("/otpLogin", merchantauth, merchantController.getSignOtpIn);
router.get(
  "/addproduct",
  merchantverify,
  filterController.getAllCategory,
  productController.getAddProduct
); //almost exept crop
router.post("/addproduct", merchantverify, productController.postAddProduct); //almost
router.get(
  "/productList",
  merchantverify,
  filterController.getAllCategory,
  productController.getProductList
);
router.post("/signup", merchantauth, merchantController.postSignup);
router.post("/login", merchantauth, merchantController.postSignin);
router.post("/mobileexists", merchantController.mobileVerify);
router.get("/forgetPassword", merchantauth, merchantController.forgetPassword);
router.post(
  "/verifyotpLogin",
  merchantauth,
  merchantController.verifyMobileOtp
); //otp login
router.post("/emailOtp", merchantauth, merchantController.sendOtpEmail);
router.post("/verifyedotp", merchantauth, merchantController.verifyedOtp); //verify otp when forget password is occured
router.post("/updatePassword", merchantController.updatePassword); //change password
router.get("/profile", merchantverify, merchantController.getProfile);
router.get(
  "/editproduct/:Id",
  merchantverify,
  filterController.getAllCategory,
  productController.getEditProduct
);
router.post("/editproduct/:Id", productController.postEditProduct);
router.get("/editprofile", merchantverify, merchantController.getEditProfile);
router.post("/editprofile", merchantverify, merchantController.postEditProfile);
router.get("/logout", merchantController.logout);
router.delete(
  "/deleteProduct/:Id",
  merchantverify,
  merchantController.deleteProduct
);
router.post(
  "/statusUpdateProduct/:userId",
  merchantverify,
  merchantController.statusProductUpdate
);
router.post("/emailpassexists", merchantController.emailPasswordVerify);
router.post("/emailmobileexists", merchantController.emailMobileVerify);
router.post("/sendotp", merchantController.sendOtp);
router.post("/verifyotp", merchantController.verifyOtp);

router.get(
  "/orderList",
  merchantverify,
  orderControllers.merchantOrderList,
  merchantController.orderList
);
router.get(
  "/orderList/:Data",
  merchantverify,
  orderControllers.merchantStatusOrderList,
  merchantController.orderFilterList
);
router.get(
  "/orderedDetails/:id",
  merchantverify,
  orderControllers.merchantProductOrder
);
router.get(
  "/salesReport",
  merchantverify,
  orderControllers.postSalesMerchant,
  orderControllers.getSalesMerchant,
  merchantController.salesList
);
router.post(
  "/salesReport",
  merchantverify,
  orderControllers.postSalesMerchant,
  orderControllers.getSalesMerchant,
  merchantController.salesList
);
router.post("/updateOrderStatus", merchantverify, orderControllers.updateOrder);
router.post("/changeprofile",merchantverify, merchantController.changePhoto);
module.exports = router;
