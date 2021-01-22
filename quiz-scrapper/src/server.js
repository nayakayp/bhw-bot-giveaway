const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 8000;
const path = require("path");
const botRouter = require("./routes/route");
const app = express();

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", botRouter);

app.listen(PORT, console.log(`listening on http://localhost:${PORT}`));

module.exports = app;
