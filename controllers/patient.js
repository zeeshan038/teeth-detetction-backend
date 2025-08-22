const Appoinment = require("../models/appoinment");
const User = require("../models/User");

/**
 * @desciption get all doctors
 * @route GET /api/doctors
 * @access Public
 */
module.exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "nurse" });
        return res.status(200).json({
            status: true,
            msg: "Doctors fetched successfully",
            doctors,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: error,
        });
    }
};

/**
 * @desciption get specific doctor
 * @route GET /api/doctors/:id
 * @access Public
 */
module.exports.getSpecificDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await User.findById(id);
        return res.status(200).json({
            status: true,
            msg: "Doctor fetched successfully",
            doctor,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: error,
        });
    }
};

/**
 * @desciption book appointment
 * @route POST /api/book-appointment/:doctorId
 * @access Public
 */
module.exports.bookAppointment = async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    const { doctorId } = req.params;
    console.log(doctorId);
    const { time, date } = req.body;

    if (!doctorId || !date || !time) {
        return res.status(400).json({ status: false, msg: "doctorId, date, and time are required" });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(doctorId)) {
        return res.status(400).json({ status: false, msg: "Invalid doctorId" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
        return res.status(400).json({ status: false, msg: "Invalid date or time format" });
    }

    try {
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                status: false,
                msg: "Doctor not found",
            });
        }
        const bookAppointment = await Appoinment.create({
            doctorId,
            patientId: _id,
            date,
            time,
        });
        return res.status(200).json({
            status: true,
            msg: "Appointment booked successfully",
            bookAppointment,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: error,
        });
    }
}

