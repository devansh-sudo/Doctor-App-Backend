const express = require("express");
const {testList} = require("../controllers/testController");

const router = express.Router();

router.get("/list", testList);

module.exports = router;
