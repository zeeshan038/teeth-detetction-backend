const notification = require("../models/notifications")


/**
 * @desciption get all notifications
 * @route GET /api/doctor/notifications
 * @access Public
 */
module.exports.getAllNotifications = async (req, res) => {
    const { _id } = req.user;
    console.log("id" , _id);

    try {
        const notifications = await notification.find({userId:_id});
        return res.status(200).json({
            status: true,
            notification: notifications

        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message

        })
    }
}