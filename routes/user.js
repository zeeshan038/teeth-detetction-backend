//NPM Packages
const router = require("express").Router();

//Controllers
const {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
  getUserInfo,
  deleteUser,
  uploadProfilePicture,
  updatebio,
} = require("../controllers/user");

const verifyUser = require("../middlewares/verifyUser");
const upload = require("../utils/multer");
//Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/verify-token", verifyOTP);
router.put("/reset-password/:email", resetPassword);

//middleware
router.use(verifyUser);
router.put("/update-bio", updatebio);
router.put("/change-password", changePassword)
router.put("/edit-profile", editProfile);
router.get('/getuserInfo' , getUserInfo);
router.delete("/delete" , deleteUser);
router.post("/upload-image", upload.single("image"),uploadProfilePicture);


module.exports = router;
