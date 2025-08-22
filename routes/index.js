const router = require("express").Router();

//paths
const user = require("./user");
const patient = require("./patient");
const doctor = require("./doctor");

// routes
router.use("/user", user);
router.use("/patient", patient);
router.use("/doctor", doctor);


module.exports = router;
