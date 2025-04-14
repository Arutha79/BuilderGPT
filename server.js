const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("OK " + process.env.GPT_NAME));
app.listen(3000);