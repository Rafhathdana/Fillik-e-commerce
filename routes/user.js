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

// Middleware: Check if user is authenticated, redirect to home page if already logged in
function userauth(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    next();
  }
}

// Middleware: Check if user is verified, redirect to login page if not
function verify(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Middleware: Check if user is logged in, handle cart based on user session
function cart(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    userController.getUserCart(req, res, next);
  } else {
    userController.getCartLocal(req, res, next);
  }
}

// Middleware: Check if user is logged in, handle wishlist based on user session
function wish(req, res, next) {
  if (req.session && req.session.user && req.session.userLoggedIn) {
    userController.getUserWishlist(req, res, next);
  } else {
    userController.getUserLocalWishList(req, res, next);
  }
}

// Login section
router.get("/forgetPassword", userauth, userController.forgetPassword); // Forget password page

// Login and sign up section
router.get("/signup", userauth, cart, userController.getSignUp);
router.get("/login", userauth, cart, userController.getSignIn);
router.get("/otpLogin", userauth, cart, userController.getSignOtpIn);
router.post(
  "/verifyotpLogin",
  userauth,
  cart,
  wish,
  userController.verifyMobileOtp,
  userController.signinconvert
); // OTP login

// Login after submission
router.post("/emailOtp", userauth, userController.sendOtpEmail); // Send emailed OTP
router.post("/emailexists", userController.emailVerify); // Check email exists
router.post("/mobileexists", userController.mobileVerify); // Check mobile exists
router.post("/sendotp", userController.sendOtp); // OTP send section
router.post("/verifyotp", userController.verifyOtp); // OTP verify section
router.post("/verifyedotp", userController.verifyedOtp); // Verify OTP when forget password occurs

// Login and sign up post methods
router.post("/signup", userauth, cart, userController.postSignup);
router.post(
  "/login",
  userauth,
  cart,
  wish,
  userController.postSignin,
  userController.signinconvert
);

// Filter
router.post(
  "/searchItem",
  wish,
  filterController.postFilter,
  userController.searchProductFilterList
); // Search post method

// Home
router.get(
  "/",
  filterController.getFilter,
  cart,
  wish,
  userController.banner,
  filterController.getAllCategory,
  userController.productHome
);

// Product filter
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

// Product list
router.get(
  "/productlist",
  filterController.getAllCategory,
  filterController.getFilter,
  cart,
  wish,
  productController.productList
);

// Detailed product view
router.get(
  "/productview/:productId",
  cart,
  wish,
  productController.getProductView
);

// Wishlist area
router.post("/wishlist", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddWishList(req, res, next)
    : userController.cachePostWishList(req, res, next);
}); // Add to wishlist submission

router.get(
  "/wishlist",
  filterController.getAllCategory,
  filterController.getFilter,
  cart,
  wish,
  userController.WishListData
); // Wishlist page

// Address area
router.post("/addAddress", verify, addressControllers.postAddress); // Address submission
router.delete("/deleteAddress", verify, addressControllers.deleteAddress); // Delete address

// Order area
router.post(
  "/addOrder",
  verify,
  orderControllers.postOrder,
  orderControllers.payment
); // Order submission
router.get(
  "/ordersList",
  verify,
  cart,
  wish,
  orderControllers.getUserOrdersList,
  userController.userOrdersList
); // Ordered list
router.get(
  "/ordersView/:id",
  verify,
  cart,
  wish,
  orderControllers.getOrdersList,
  userController.OrdersList
); // Order detailed view
router.post("/updateOrderStatus", verify, orderControllers.updateOrder); // Change order status

// Cart area
router.get(
  "/cart",
  verify,
  couponController.getCouponsList,
  addressControllers.getAddress,
  userController.getCart
); // Cart page
router.post("/addToCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.postAddCart(req, res, next)
    : userController.cachePostCart(req, res, next);
}); // Add to cart submission

router.post("/postFromCart", (req, res, next) => {
  req.session.userLoggedIn
    ? userController.getVariableCart(req, res, next)
    : userController.getCartVariableLocal(req, res, next);
}); // Add cart
router.post(
  "/postFromMainCart",
  verify,
  addressControllers.getAddress,
  userController.getMainVariableCart
); // Getting cart page reload
router.delete("/deleteFromCart", userController.deleteItemCrt); // Delete from cart
router.post("/changeQuantity", verify, userController.changeProductQuantity); // Change quantity
router.post("/applyCoupon", verify, couponController.applyCoupon); // Code apply area

// Cart after submission
router.post("/verifyPayment", verify, orderControllers.verifyPaymentPost); // Verify payment success or not
router.get("/cancelledpayment/:id", verify, orderControllers.removeOrder); // Cancelled payment, then delete order
router.get(
  "/paymentSuccess/:id",
  verify,
  orderControllers.removeCartItemAndQuantity,
  userController.getPaymentSucces
); // Payment success page

// Profile area
router.post("/changeprofile", userController.changePhoto); // Change profile
// Profile
router.get(
  "/profile",
  verify,
  addressControllers.getAddress,
  userController.getProfile
);
// Edit your profile
router.get("/editprofile", verify, userController.getEditProfile);
router.post("/profile", verify, userController.editUserProfile); // Post to edit profile
router.post("/updatePassword", userController.updatePassword); // Change password

// Other pages
router.get("/about", cart, wish, userController.about); // About page
router.get("/contact", cart, wish, userController.contact); // Contact page
router.post("/contact", verify, contactController.addUserComplaint); // Contact form submit of user
router.post("/contactguest", contactController.addGuestComplaint); // Contact form submit
router.get("/logout", userController.logout); // Logout

module.exports = router;
