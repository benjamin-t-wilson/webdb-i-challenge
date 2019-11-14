const express = require("express");
const accountRouter = require("./accountRouter");

const router = express.Router();

router.use("/accounts", accountRouter);

module.exports = router;
