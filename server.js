const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();
const app = express();

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1/admin" , require("./routes/adminRoutes"))
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes"))
app.use("/api/v1/tests", require("./routes/testsRoutes"))
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
