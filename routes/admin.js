var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");
const filterController = require("../controllers/filterController");
const couponController = require("../controllers/couponController");
const orderControllers = require("../controllers/orderControllers");
const productController = require("../controllers/productController");
const userControllers = require("../controllers/userControllers");
const merchantControllers = require("../controllers/merchantControllers");
const addressControllers = require("../controllers/addressControllers");

// Middleware to check if admin is authenticated
function adminAuth(req, res, next) {
  if (req.session && req.session.admin && req.session.adminLoggedIn) {
    res.redirect("/admin/home");
  } else {
    next();
  }
}

// Middleware to verify admin authentication
function adminVerify(req, res, next) {
  if (req.session && req.session.admin && req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

router.get(
  "/",
  adminVerify,
  userControllers.adminUserDashboard,
  merchantControllers.adminMerchantyDashboard,
  orderControllers.adminDashboard,
  productController.adminProductDashboard,
  adminController.getHome
);

router.get("/login", adminAuth, adminController.getLogin); // Login page
router.get(
  "/home",
  adminVerify,
  userControllers.adminUserDashboard,
  merchantControllers.adminMerchantyDashboard,
  orderControllers.adminDashboard,
  productController.adminProductDashboard,
  adminController.getHome
);

router.get("/userList", adminVerify, adminController.getUser); // User list
router.get("/userBlockList", adminVerify, adminController.getBlockUser); // Blocked user list
router.get("/userActiveList", adminVerify, adminController.getActiveUser); // Active user list
router.get("/merchantList", adminVerify, adminController.getMerchant); // Merchant list
router.get(
  "/merchantBlockedList",
  adminVerify,
  adminController.getBlockMerchant
); // Blocked merchant list
router.get(
  "/merchantActiveList",
  adminVerify,
  adminController.getActiveMerchant
); // Active merchant list

router.get("/addcategory", adminVerify, filterController.getAddCategory); // Add category page
router.get(
  "/viewcategory",
  adminVerify,
  filterController.getAllCategory,
  filterController.getViewCategory
); // View category page
router.post("/addcategory", adminVerify, filterController.postAddCategory); // Add category submission

router.post("/addcoupon", adminVerify, couponController.postAddCoupon); // Add coupon submission
router.get(
  "/addcoupon",
  adminVerify,
  filterController.getAllCategory,
  couponController.getAddCoupon
); // Add coupon page
router.get("/viewCoupon", adminVerify, couponController.getViewCoupon); // View coupon page
router.get("/editCoupon/:Id", adminVerify, couponController.getEditCoupon); // Edit coupon page

router.post("/login", adminAuth, adminController.postSignin); // Login submission
router.get("/0124", adminAuth, adminController.getSignUp); // Sign up page
router.post("/0124", adminAuth, adminController.postSignup); // Sign up submission

router.post("/emailpassexists", adminController.emailPasswordVerify); // Check email and password exists
router.post("/emailmobileexists", adminController.emailMobileVerify); // Check email and mobile exists
router.post("/sendotp", adminController.sendOtp); // Send OTP
router.post("/verifyotp", adminController.verifyOtp); // Verify OTP

router.post(
  "/statusUserUpdate/:userId",
  adminVerify,
  adminController.statusUserUpdate
); // Update user status
router.post(
  "/statusCodeUpdate/:userId",
  adminVerify,
  couponController.statusCodeUpdate
); // Update coupon status
router.post(
  "/statusCategoryUpdate/:userId",
  adminVerify,
  filterController.statusFilterUpdate
); // Update category status
router.post(
  "/statusBannerUpdate/:userId",
  adminVerify,
  filterController.statusFilterUpdate
); // Update banner status
router.post(
  "/statusMerchantUpdate/:userId",
  adminVerify,
  adminController.statusMerchantUpdate
); // Update merchant status

router.get("/userprofile/:userId", adminVerify, adminController.getUserProfile); // User profile page
router.get(
  "/merchantprofile/:userId",
  adminVerify,
  adminController.getMerchantProfile
); // Merchant profile page

router.get(
  "/orderList",
  adminVerify,
  orderControllers.adminOrderList,
  adminController.orderList
); // Order list
router.get(
  "/orderList/:Data",
  adminVerify,
  orderControllers.adminStatusOrderList,
  adminController.orderFilterList
); // Filtered order list

router.get(
  "/productList",
  adminVerify,
  filterController.getAllCategory,
  productController.getAdminProductList
); // Admin product list
router.get(
  "/productList/:type",
  adminVerify,
  filterController.getAllCategory,
  productController.getAdminFilterProductList
); // Admin filtered product list

router.get("/logout", adminController.logout); // Logout

router.get("/addBanner", adminVerify, adminController.getAddBanner); // Add banner page
router.post("/addBanner", adminVerify, adminController.postAddBanner); // Add banner submission
router.get("/viewBanner", adminVerify, adminController.getBannerList); // View banner list

router.get(
  "/salesMerchantReport",
  adminVerify,
  orderControllers.salesMerchantReport,
  adminController.salesMerchantReport
); // Sales merchant report
router.get(
  "/salesOrderReport",
  adminVerify,
  orderControllers.postSalesMerchant,
  orderControllers.getsalesSalesReport,
  adminController.salesSalesReport
); // Sales order report

router.get("/editBanner/:id", adminVerify, adminController.getEditBannerList); // Edit banner page
router.post("/editBanner/:id", adminVerify, adminController.postEditBannerList); // Edit banner submission
router.post("/changebanner/:id", adminController.changebanner); // Change banner

module.exports = router;
