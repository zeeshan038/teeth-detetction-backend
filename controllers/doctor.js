const appoinment =require("../models/appoinment");
const Notification = require("../models/notifications");

/**
 * @desciption get all appoinments
 * @route GET /api/doctor/appoin
 * @access Public
 */
module.exports.getAllAppoinments = async(req , res)=>{
    const {_id} = req.user;
    try {
        const appointments = await appoinment.find({doctorId:_id}).populate("patientId");
        return res.status(200).json({
            status: true,
            msg: "Appointments fetched successfully",
            appointments,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: error.message,
        });
    }
}

/**
 * @desciption accept appointment
 * @route GET /api/doctor/appointment/:id
 * @access Public
 */
module.exports.acceptAppoinmment = async(req , res)=>{
    const {id}=req.params;
    console.log("id" , id)
    try {
        console.log("first")
        const acceptAppoinmment = await appoinment.findByIdAndUpdate(
            id,
            { status: "confirmed" },
            { new: true }
        );

        console.log("second")
        if (!acceptAppoinmment) {
            return res.status(404).json({
                status: false,
                msg: "Appointment not found",
            });
        }
        console.log("3rdd")

        // Create notification for the patient
        await Notification.create({
            userId: acceptAppoinmment.patientId,
            type: "appointment",
            message: "Your appointment has been accepted",
        });
       return res.status(200).json({
           status: true,
           msg: "Appointment accepted successfully",
           acceptAppoinmment,
       })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: error.message,
        });
    }
}
/**
 * @desciption reject appointment
 * @route GET /api/doctor/rejeect/:id
 * @access Public
 */
module.exports.rejectAppoinment = async(req,res)=>{
    const {id}=req.params;
    try {
        const acceptAppoinmment = await appoinment.findByIdAndUpdate(
            id,
            { status: "cancelled" },
            { new: true }
        );

        if (!acceptAppoinmment) {
            return res.status(404).json({
                status: false,
                msg: "Appointment not found",
            });
        }

        // Create notification for the patient
        await Notification.create({
            userId: acceptAppoinmment.patientId,
            type: "appointment",
            message: "Your appointment has been rejected",
        });
       return res.status(200).json({
           status: true,
           msg: "Appointment declined successfully",
           acceptAppoinmment,
       })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: error.message,
        });
    }
}