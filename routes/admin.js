var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");

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

router.get("/", adminAuth, adminController.getLogin);
router.get("/login", adminAuth, adminController.getLogin);
router.get("/home", adminVerify, adminController.getHome);
router.get("/userList", adminVerify, adminController.getUser);
router.get("/merchantList", adminVerify, adminController.getMerchant);
router.get("/addcategory", adminVerify, adminController.getAddCategory);
router.get("/viewcategory", adminVerify, adminController.getViewCategory);
router.post("/addcategory", adminVerify, adminController.postAddCategory);

router.post("/login", adminAuth, adminController.postSignin);
router.get("/signup", adminAuth, adminController.getSignUp);
router.post("/signup", adminAuth, adminController.postSignup);

router.post(
  "/statusUserUpdate/:userId",
  adminVerify,
  adminController.statusUserUpdate
);
router.delete(
  "/deleteCategory/:Id",
  adminVerify,
  adminController.deleteCategory
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
router.get("/logout", adminController.logout);

module.exports = router;
