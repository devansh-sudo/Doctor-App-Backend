const https = require("https")
const fs = require('fs')
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();
const app = express();

const port = process.env.PORT || 3000;
app.use(express.static('public'))
app.use(express.urlencoded({extended: true, limit: '3mb'}))


app.use(cors())
app.use(express.json());
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1/admin" , require("./routes/adminRoutes"))
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes"))
app.use("/api/v1/tests", require("./routes/testsRoutes"))
app.use(errorHandler);

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}
https.createServer(options, app).listen(port, console.log(`server runs on port ${port}`))


// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
