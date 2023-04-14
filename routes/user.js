var express = require("express");
var router = express.Router();
const userController = require("../controllers/userControllers");
const otp = require("../controllers/otp");

/* GET home page. */
function userauth(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    res.redirect("/home");
  } else {
    next();
  }
}
function verify(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}
router.get("/", userController.getFilter,
userController.getCartLocal,
userController.productHome)











router.get(
  "/signup",
  userauth,
  userController.getCartLocal,
  userController.getSignUp
);
router.get(
  "/login",
  userauth,
  userController.getCartLocal,
  userController.getSignIn
);
router.get(
  "/home",
  verify,
  userController.getFilter,
  userController.getCartLocal,
  userController.productFilterList
);
router.post(
  "/postfilter",
  userController.postFilter,
  userController.getCartLocal,
  userController.productFilterList
);
router.get(
  "/productlist",
  userController.getFilter,
  userController.getCartLocal,
  userController.productFilterList
);
router.get("/cart", verify, userController.getCart);
router.get(
  "/productview/:productId",
  userController.getCartLocal,
  userController.getProductView
);
router.get("/profile", verify, userController.getProfile);
router.get("/editprofile", verify, userController.getEditProfile);
router.post(
  "/signup",
  userauth,
  userController.getCartLocal,
  userController.postSignup
);
router.post(
  "/login",
  userauth,
  userController.getCartLocal,
  userController.postSignin
);
router.post("/sendotp", userController.sendOtp);
router.post("/verifyotp", userController.verifyOtp);
router.get("/logout", userController.logout);
router.post(
  "/addToCart",
  userController.cachePostCart,
  userController.postAddCart
);
router.get("/forgetPassword", userauth, userController.forgetPassword);
module.exports = router;
