const appoinment = require("../models/appoinment");

/**
 * @desciption get all appoinments
 * @route GET /api/doctor/appoin
 * @access Public
 */
module.exports.getAllAppoinments = async(req , res)=>{
    const {_id} = req.user;
    try {
        const appointments = await appoinment.find({doctorId:_id});
        return res.status(200).json({
            status: true,
            msg: "Appointments fetched successfully",
            appointments,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: error,
        });
    }
}