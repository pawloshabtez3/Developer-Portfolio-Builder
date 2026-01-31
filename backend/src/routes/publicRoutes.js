const express = require("express");
const { getPublicPortfolio } = require("../controllers/publicController");

const router = express.Router();

router.get("/:username", getPublicPortfolio);

module.exports = router;
