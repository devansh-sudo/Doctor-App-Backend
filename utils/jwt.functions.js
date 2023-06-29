const jwt = require("jsonwebtoken");
const signToken = (userId) =>{
    return jwt.sign(
        {
            user: {
                id: userId,
            },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "30 days" }
    );
}

module.exports = {signToken};