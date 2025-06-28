//NPM Packages
const router = require("express").Router();

//Controllers
const { test } = require("../controllers/user");

router.get("/test" , test)

module.exports = router;
