const express = require("express");

const {
    registerAdmin,
    loginAdmin,
    appointmentList,
    appointmentEdit,
    appointmentCancel,
    appointmentShow,
    reportUpload,
    allAppointment,
    removeReport
} = require("../controllers/adminController")
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/appointmentList", appointmentList);
router.patch("/appointmentEdit", appointmentEdit);
router.patch("/appointmentCancel", appointmentCancel);
router.post("/appointmentShow", appointmentShow);
router.post("/reportUpload/:id", reportUpload);
router.post("/removeReport/:id", removeReport);
router.get("/allappointment", allAppointment);


module.exports = router;
