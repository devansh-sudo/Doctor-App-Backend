const express = require("express");

const {
    registerAdmin,
    loginAdmin,
    appointmentList,
    appointmentEdit,
    appointmentCancel
} = require("../controllers/adminController")
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/appointmentList", appointmentList);
router.patch("/appointmentEdit", appointmentEdit);
router.patch("/appointmentCancel", appointmentCancel);


module.exports = router;
