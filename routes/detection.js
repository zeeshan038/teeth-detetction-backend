const express = require("express");
const router = express.Router();
const { teathDetection } = require("../controllers/detection");
const upload = require("../utils/multer");

const verifyUser = require("../middlewares/verifyUser");

router.use(verifyUser)

router.post("/teeth-detection", upload.single("image"), teathDetection);
module.exports = router;
 