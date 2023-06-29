const asyncHandler = require("express-async-handler");
const Tests = require("../models/TestModel");
const validateToken = require("../middleware/validateTokenHandler");

const testList = [
  validateToken,
  asyncHandler(async (req, res) => {
    try {
      const testList = await Tests.find({},{
        testName: 1,
        price: 1
      });
      return res.status(200).send({ tests: testList });
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }),
];

module.exports = {
  testList
};
