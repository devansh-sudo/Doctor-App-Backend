const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
            unique: [true, "Phone is already taken"],
        },
        notifcation: {
            type: Array,
            default: [],
        },
        image: {
            type: String,
        },
        fcm_token:{
            type : String
        },
        token:{
            type : String
        }
    },
    {
        timestamps: true, versionKey: false
    }
);

module.exports = mongoose.model("Admin", adminSchema);
