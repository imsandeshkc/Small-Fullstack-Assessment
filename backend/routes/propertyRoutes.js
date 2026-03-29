const express = require("express");
const { getProperties } = require("../controllers/propertyController");

const router = express.Router();

router.get("/", getProperties);

module.exports = router;