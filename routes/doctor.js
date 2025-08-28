//NPM Packages
const router = require("express").Router();

//Controllers
const { getAllAppoinments, acceptAppoinmment, rejectAppoinment } = require("../controllers/doctor");

const verifyUser = require("../middlewares/verifyUser");

//middleware
router.use(verifyUser);
router.get('/appoinments' , getAllAppoinments);
router.put('/appointment/:id' , acceptAppoinmment);
router.put('/reject/:id', rejectAppoinment);

module.exports = router;
 