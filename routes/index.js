const router = require("express").Router();

//paths
const user = require("./user");
const patient = require("./patient");
const doctor = require("./doctor");
const notification = require('./notification');
const chat = require('./chat');
const detection = require('./detection');

// routes
router.use("/user", user);
router.use("/patient", patient);
router.use("/doctor", doctor);
router.use("/notification", notification);
router.use("/chat", chat);
router.use("/detection", detection);


module.exports = router;
