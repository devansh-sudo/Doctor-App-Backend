const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const https = require('https');
const fs = require('fs');

connectDb();
const app = express();

const port = process.env.PORT || 3001;

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/supremebackoffice.in/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/supremebackoffice.in/privkey.pem')
};

app.use(cors())
app.use(express.json());
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1/admin" , require("./routes/adminRoutes"))
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes"))
app.use("/api/v1/tests", require("./routes/testsRoutes"))
app.use(errorHandler);

const server = https.createServer(options, app); // Assuming 'app' is your Express app
server.listen(port, () => {
    console.log(`Server is running on port ${port} over HTTPS`);
});