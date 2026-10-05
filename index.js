const express = require("express");
require("dotenv").config();
const { connectDB } = require("./lib/helpers/db");
const bodyParser = require("body-parser");
const router = require("./router/index.router")

const app = express();

app.use(bodyParser.json());
app.use("/api", router)




const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
});