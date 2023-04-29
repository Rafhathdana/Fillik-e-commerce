var express = require("express");
var router = express.Router();
const merchantController = require("../controllers/merchantControllers");
const productController = require("../controllers/productController");
const multer = require("multer");
const orderControllers = require("../controllers/orderControllers");
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
router.get("/", merchantverify, merchantController.getDashBoard); //almost
router.get("/signup", merchantauth, merchantController.getSignIn); //almost
router.get("/login", merchantauth, merchantController.getLogin); //almost
router.get("/addproduct", merchantverify, productController.getAddProduct); //almost exept crop
router.post("/addproduct", merchantverify, productController.postAddProduct); //almost
router.get("/productList", merchantverify, productController.getProductList);
router.get("/profile", merchantverify, merchantController.getProfile);
router.post("/signup", merchantauth, merchantController.postSignup);
router.post("/login", merchantauth, merchantController.postSignin);
router.get(
  "/editproduct/:Id",
  merchantverify,
  productController.getEditProduct
);
router.post(
  "/editproduct/:Id",
  merchantverify,
  productController.postEditProduct
);
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
router.put(
  "/updateOrderStatus",
  merchantverify,
  orderControllers.OrderStatusUpdate 
);
module.exports = router;
