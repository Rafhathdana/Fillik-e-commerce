var express = require("express");
var router = express.Router();
const userController = require("../controllers/userControllers");
const otp = require("../config/otp");
const addressControllers = require("../controllers/addressControllers");
const orderControllers = require("../controllers/orderControllers");
const filterController = require("../controllers/filterController");
const couponController = require("../controllers/couponController");
const productController = require("../controllers/productController");
const contactController = require("../controllers/contactController");

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
function wish(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    userController.getUserWishlist(req, res, next);
  } else {
    userController.getUserLocalWishList(req, res, next);
  }
}

//login and sign up section
router.get("/signup", userauth, cart, userController.getSignUp);
router.get("/login", userauth, cart, userController.getSignIn);
router.get("/otpLogin", userauth, cart, userController.getSignOtpIn);

//login and sign up post methods
router.post("/signup", userauth, cart, userController.postSignup);
router.post(
  "/login",
  userauth,
  cart,
  wish,
  userController.postSignin,
  userController.signinconvert
);
router.post("/sendotp", userController.sendOtp); // otp send section
router.post("/verifyotp", userController.verifyOtp); //otp verify section
router.post("/verifyedotp", userController.verifyedOtp); //verify otp when forget password is occured
router.post("/updatePassword", userController.updatePassword); //change password
router.post(
  "/verifyotpLogin",
  userauth,
  cart,
  wish,
  userController.verifyMobileOtp,
  userController.signinconvert
); //otp login

// home
router.get(
  "/",
  filterController.getFilter,
  cart,
  wish,
  userController.banner,
  filterController.getAllCategory,
  userController.productHome
);

// product filter

router.post(
  "/postfilter",
  filterController.postFilter,
  wish,
  userController.productFilterList
);
router.get(
  "/postfilter",
  filterController.getAllCategory,
  filterController.getFilter,
  cart,
  wish,
  productController.productList
);

// product list
router.get(
  "/productlist",
  filterController.getAllCategory,
  filterController.getFilter,
  cart,
  wish,
  productController.productList
);
// cart
router.get(
  "/cart",
  verify,
  couponController.getCouponsList,
  addressControllers.getAddress,
  userController.getCart
);

//detailed product view
router.get(
  "/productview/:productId",
  cart,
  wish,
  productController.getProductView
);
//profile
router.get(
  "/profile",
  verify,
  addressControllers.getAddress,
  userController.getProfile
);
//edit your profile
router.get("/editprofile", verify, userController.getEditProfile);
router.post("/profile", verify, userController.editUserProfile); //post to edit profile

router.get(
  "/ordersList",
  verify,
  cart,
  wish,
  orderControllers.getUserOrdersList,
  userController.userOrdersList
);
router.get(
  "/ordersView/:id",
  verify,
  cart,
  wish,
  orderControllers.getOrdersList,
  userController.OrdersList
);
// router.get("/ordersView/:id", verify, orderControllers.getOrderview);

router.get("/logout", userController.logout);
router.post("/addToCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddCart(req, res, next)
    : userController.cachePostCart(req, res, next);
}); //need to test after login
router.post("/wishlist", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddWishList(req, res, next)
    : userController.cachePostWishList(req, res, next);
}); //need to test after login
router.get(
  "/wishlist",filterController.getAllCategory,
  filterController.getFilter,
  cart,
  wish,
  userController.WishListData
); //need to test after login
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
router.post("/emailOtp", userauth, userController.sendOtpEmail);

router.post("/emailexists", userController.emailVerify);
router.post("/mobileexists", userController.mobileVerify);
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
  wish,
  filterController.postFilter,
  userController.searchProductFilterList
);

router.get("/about", cart, wish, userController.about);
router.get("/contact", cart, wish, userController.contact);
router.post("/contact", verify, contactController.addUserComplaint);
router.post("/contactguest", contactController.addGuestComplaint);
router.post("/changeprofile", userController.changePhoto);

module.exports = router;
