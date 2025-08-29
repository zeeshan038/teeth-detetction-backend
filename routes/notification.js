//NPM Packages
const router = require("express").Router();

//Controllers
const verifyUser = require("../middlewares/verifyUser");
const { getAllNotifications } = require("../controllers/notifications");
//middleware
router.use(verifyUser);
router.get('/notifications' , getAllNotifications)


module.exports = router;
