const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"))
})

app.listen(4000);
