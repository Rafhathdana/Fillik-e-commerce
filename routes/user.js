var express = require("express");
var router = express.Router();
const userController = require("../controllers/userControllers");
const otp = require("../controllers/otp");
const addressControllers = require("../controllers/addressControllers");
const orderControllers = require("../controllers/orderControllers");
const filterController = require("../controllers/filterController");
const couponController = require("../controllers/couponController");
const productController = require("../controllers/productController");

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
router.get(
  "/",
  filterController.getFilter,
  cart,
  userController.banner,
  filterController.getAllCategory,
  userController.productHome
);

router.get("/signup", userauth, cart, userController.getSignUp);

router.get("/login", userauth, cart, userController.getSignIn);
router.get("/otpLogin", userauth, cart, userController.getSignOtpIn);

router.post(
  "/postfilter",
  filterController.postFilter,
  userController.productFilterList
);
router.get(
  "/postfilter",
  filterController.getFilter,
  cart,
  productController.productList
);
router.get(
  "/productlist",
  filterController.getAllCategory,
  filterController.getFilter,
  cart,
  productController.productList
);
router.get(
  "/cart",
  verify,
  couponController.getCouponsList,
  addressControllers.getAddress,
  userController.getCart
);
router.get("/productview/:productId", cart, productController.getProductView);
router.get(
  "/profile",
  verify,
  addressControllers.getAddress,
  userController.getProfile
);
router.get("/editprofile", verify, userController.getEditProfile);
router.get(
  "/ordersList",
  verify,
  orderControllers.getUserOrdersList,
  userController.userOrdersList
);
router.get(
  "/ordersView/:id",
  verify,
  orderControllers.getOrdersList,
  userController.OrdersList
);
// router.get("/ordersView/:id", verify, orderControllers.getOrderview);
router.post("/signup", userauth, cart, userController.postSignup);
router.post(
  "/login",
  userauth,
  cart,
  userController.postSignin,
  userController.signinconvert
);
router.post("/sendotp", userController.sendOtp);
router.post("/verifyotp", userController.verifyOtp);
router.post(
  "/verifyotpLogin",
  userauth,
  cart,
  userController.verifyMobileOtp,
  userController.signinconvert
);
router.get("/logout", userController.logout);
router.post("/addToCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddCart(req, res, next)
    : userController.cachePostCart(req, res, next);
}); //need to test after login
router.post("/addAddress", verify, addressControllers.postAddress); //need to test after login
router.delete("/deleteAddress", verify, addressControllers.deleteAddress); //need to test after login
router.post(
  "/addOrder",
  verify,
  orderControllers.postOrder,
  orderControllers.payment
); //need to test after login
router.post("/applyCoupon", verify, couponController.applyCoupon); //need to test after login

router.post("/postFromCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.getVariableCart(req, res, next)
    : userController.getCartVariableLocal(req, res, next);
}); //pending after logedin

router.post(
  "/postFromMainCart",
  verify,
  addressControllers.getAddress,
  userController.getMainVariableCart
);

router.get("/forgetPassword", userauth, userController.forgetPassword);
router.post("/emailexists", userController.emailVerify);
router.delete("/deleteFromCart", userController.deleteItemCrt);
router.post("/updateOrderStatus", verify, orderControllers.updateOrder);
router.post("/verifyPayment", verify, orderControllers.verifyPaymentPost);
router.get(
  "/paymentSuccess/:id",
  verify,
  orderControllers.removeCartItemAndQuantity,
  userController.getPaymentSucces
);
router.get("/cancelledpayment/:id", verify, orderControllers.removeOrder);
router.post("/changeQuantity", verify, userController.changeProductQuantity);
router.post(
  "/searchItem",
  filterController.postFilter,
  userController.searchProductFilterList
);
router.post("/profile", verify, userController.editUserProfile);
module.exports = router;
