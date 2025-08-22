//NPM Packages
const router = require("express").Router();

//Controllers
const { getAllAppoinments } = require("../controllers/doctor");

const verifyUser = require("../middlewares/verifyUser");

//middleware
router.use(verifyUser);
router.get('/appoinments' , getAllAppoinments)


module.exports = router;
