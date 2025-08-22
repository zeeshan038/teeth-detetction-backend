//NPM Packages
const router = require("express").Router();

//Controllers
const { getAllDoctors, getSpecificDoctor, bookAppointment } = require("../controllers/patient");

const verifyUser = require("../middlewares/verifyUser");

//middleware
router.use(verifyUser);
router.get('/doctors' , getAllDoctors)
router.get('/doctor/:id' , getSpecificDoctor)
router.post('/book-appointment/:doctorId' , bookAppointment)


module.exports = router;
