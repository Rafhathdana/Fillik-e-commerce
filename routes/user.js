var express = require("express");
var router = express.Router();
const userController = require("../controllers/userControllers");
const otp = require("../controllers/otp");

/* GET home page. */
function userauth(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    res.redirect("/");
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
function cart(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    userController.getUserCart(req, res, next);
  } else {
    userController.getCartLocal(req, res, next);
  }
}
router.get("/", userController.getFilter, cart, userController.productHome);

router.get("/signup", userauth, cart, userController.getSignUp);

router.get("/login", userauth, cart, userController.getSignIn);
router.get(
  "/home",
  verify,
  userController.getFilter,
  cart,
  userController.productFilterList
);
router.post(
  "/postfilter",
  userController.postFilter,
  cart,
  userController.productFilterList
);
router.get(
  "/productlist",
  userController.getFilter,
  cart,
  userController.productFilterList
);
router.get("/cart", verify, userController.getCart);
router.get("/productview/:productId", cart, userController.getProductView);
router.get("/profile", verify, userController.getProfile);
router.get("/editprofile", verify, userController.getEditProfile);
router.post("/signup", userauth, cart, userController.postSignup);
router.post("/login", userauth, cart, userController.postSignin);
router.post("/sendotp", userController.sendOtp);
router.post("/verifyotp", userController.verifyOtp);
router.get("/logout", userController.logout);
router.post("/addToCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddCart(req, res, next)
    : userController.cachePostCart(req, res, next);
}); //need to test after login

router.post("/postFromCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.getVariableCart(req, res, next)
    : userController.getCartVariableLocal(req, res, next);
}); //pending after logedin

router.get("/forgetPassword", userauth, userController.forgetPassword);
router.post("/emailexists", userController.emailVerify);
module.exports = router;
