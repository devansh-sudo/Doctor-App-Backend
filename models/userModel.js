const mongoose = require("mongoose");

const secretsSchema = mongoose.Schema({
    stripeCustomerId: String,
})

const userSchema = mongoose.Schema(
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
        dob: {
            type: Date,
        },
        phone: {
            type: String,
            unique: [true, "Phone is already taken"],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        notifcation: {
            type: Array,
            default: [],
        },
        seennotification: {
            type: Array,
            default: [],
        },
        image: {
            type: String,
        },
        secrets: {
            type: secretsSchema
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
