var express = require("express");
var router = express.Router();
const merchantController = require("../controllers/merchantControllers");
const multer = require("multer");
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
router.get("/profile", merchantverify, merchantController.getProfile);
router.get("/home", merchantverify, merchantController.getProductList);
router.post("/signup", merchantauth, merchantController.postSignup);
router.post("/login", merchantauth, merchantController.postSignin);
router.get("/addproduct", merchantverify, merchantController.getAddProduct);
router.get(
  "/editproduct/:Id",
  merchantverify,
  merchantController.getEditProduct
);
router.post(
  "/editproduct/:Id",
  merchantverify,
  merchantController.postEditProduct
);
router.get("/editprofile", merchantverify, merchantController.getEditProfile);
router.post("/editprofile", merchantverify, merchantController.postEditProfile);
router.post("/addproduct", merchantController.postAddProduct);
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
module.exports = router;
