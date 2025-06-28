

/**
 * @desciption Signup User
 * @route POST /api/user/signup
 * @access Public
 */
module.exports.test = async (req, res) => {
  return res.status(200).json({
    status : true,
    message: "testing",
  });
};