const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        testName: {
            type: String,
            required: 'TestName is Required'
        },
        price: {
            type: Number,
            required: 'Price is Required'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Tests", userSchema);
