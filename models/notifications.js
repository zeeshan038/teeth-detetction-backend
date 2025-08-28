//NPM Package
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

// Reuse existing model if compiled already
module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)