const router = require("express").Router();

//paths
const user = require("./user");

// routes
router.use("/user", user);


module.exports = router;
