var express = require("express");
var router = express.Router();
const merchantController = require("../controllers/merchantControllers");
const multer = require("multer");
function merchantauth(req, res, next) {
  if (req.session && req.session.merchant && req.session.merchantLoggedIn) {
    res.redirect("/merchant/home");
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
router.get("/", merchantauth, function (req, res, next) {
  res.render("merchant/index", {
    title: "merchant",
    merchantLoggedin: null,
  });
});
router.get("/profile", merchantverify, merchantController.getProfile);
router.get("/signup", merchantauth, merchantController.getSignIn);
router.get("/login", merchantauth, merchantController.getLogin);
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
module.exports = router;
