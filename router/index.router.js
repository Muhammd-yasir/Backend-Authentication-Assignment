const { Router } = require("express");
const { authRouter } = require("./auth.route");

const router = Router();

router.use("/auth", authRouter);

module.exports = router;




