const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const https = require('https');
const fs = require('fs');

connectDb();
const app = express();

const port = process.env.PORT || 3001;

let options = {}
    options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/api.supremebackoffice.com/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/api.supremebackoffice.com/privkey.pem')
    };

app.use((req, res, next) => {
if (req.path !== '/api/v1/payment/webhook') {
    express.json({ type: '*/*' })(req, res, next);
} else {
    next();
}
});

app.use((req, res, next) => {
if (req.path === '/api/v1/payment/webhook') {
    express.raw({ type: '*/*' })(req, res, next);
} else {
    next();
}
});

app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1/admin" , require("./routes/adminRoutes"))
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes"))
app.use("/api/v1/payment", require("./routes/paymentRoutes"))
app.use("/api/v1/tests", require("./routes/testsRoutes"))
app.use(errorHandler);

const server = https.createServer(options, app); // Assuming 'app' is your Express app
server.listen(port, () => {
    console.log(`Server is running on port ${port} over HTTPS`);
});