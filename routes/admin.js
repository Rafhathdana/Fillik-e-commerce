var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");
const filterController = require("../controllers/filterController");
const couponController = require("../controllers/couponController");
const orderControllers = require("../controllers/orderControllers");
const productController = require("../controllers/productController");
const userControllers = require("../controllers/userControllers");
const merchantControllers = require("../controllers/merchantControllers");

function adminAuth(req, res, next) {
  if (req.session && req.session.admin && req.session.adminLoggedIn) {
    res.redirect("/admin/home");
  } else {
    next();
  }
}
function adminVerify(req, res, next) {
  if (req.session && req.session.admin && req.session.adminLoggedIn) {
    console.log(req.session.adminLoggedIn);
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
router.get("/login", adminAuth, adminController.getLogin); //almost
router.get(
  "/home",
  adminVerify,
  userControllers.adminUserDashboard,
  merchantControllers.adminMerchantyDashboard,
  orderControllers.adminDashboard,
  productController.adminProductDashboard,
  adminController.getHome
);
router.get("/userList", adminVerify, adminController.getUser); //almost
router.get("/userBlockList", adminVerify, adminController.getBlockUser); //almost
router.get("/userActiveList", adminVerify, adminController.getActiveUser); //almost
router.get("/merchantList", adminVerify, adminController.getMerchant); //almost
router.get("/merchantBlockedList", adminVerify, adminController.getMerchant); //almost
router.get("/merchantActiveList", adminVerify, adminController.getMerchant); //almost
router.get("/addcategory", adminVerify, filterController.getAddCategory); //almost
router.get(
  "/viewcategory",
  adminVerify,
  filterController.getAllCategory,
  filterController.getViewCategory
); //almost
router.post("/addcategory", adminVerify, filterController.postAddCategory); //almost
router.post("/addcoupon", adminVerify, couponController.postAddCoupon);
router.get(
  "/addcoupon",
  adminVerify,
  filterController.getAllCategory,
  couponController.getAddCoupon
);
router.get("/viewCoupon", adminVerify, couponController.getViewCoupon); //almost
router.get("/editCoupon/:Id", adminVerify, couponController.getEditCoupon); //almost
router.post("/login", adminAuth, adminController.postSignin); //almost
router.get("/0124", adminAuth, adminController.getSignUp); //almost
router.post("/0124", adminAuth, adminController.postSignup); //almost
router.post("/emailpassexists", adminController.emailPasswordVerify); //almost
router.post("/emailmobileexists", adminController.emailMobileVerify); //almost
router.post("/sendotp", adminController.sendOtp); //almost
router.post("/verifyotp", adminController.verifyOtp); //almost
router.post(
  "/statusUserUpdate/:userId",
  adminVerify,
  adminController.statusUserUpdate
);
router.post(
  "/statusCodeUpdate/:userId",
  adminVerify,
  couponController.statusCodeUpdate
);
router.post(
  "/statusCategoryUpdate/:userId",
  adminVerify,
  filterController.statusFilterUpdate
);
router.post(
  "/statusMerchantUpdate/:userId",
  adminVerify,
  adminController.statusMerchantUpdate
);
router.get("/userprofile/:userId", adminVerify, adminController.getUserProfile);
router.get(
  "/merchantprofile/:userId",
  adminVerify,
  adminController.getMerchantProfile
);
router.get(
  "/orderList",
  adminVerify,
  orderControllers.adminOrderList,
  adminController.orderList
);
router.get(
  "/productList",
  adminVerify,
  filterController.getAllCategory,
  productController.getAdminProductList
);
router.get("/logout", adminController.logout);
router.get("/addBanner", adminVerify, adminController.getAddBanner);
router.post("/addBanner", adminVerify, adminController.postAddBanner);
router.get("/viewBanner", adminVerify, adminController.getBannerList);
router.get(
  "/salesMerchantReport",
  adminVerify,
  orderControllers.salesMerchantReport,
  adminController.salesMerchantReport
);
router.get(
  "/salesOrderReport",
  adminVerify,
  orderControllers.postSalesMerchant,
  orderControllers.getsalesSalesReport,
  adminController.salesSalesReport
);
module.exports = router;
