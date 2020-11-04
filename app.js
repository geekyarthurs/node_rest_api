const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
exports.app = app;

require("dotenv/config");

app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const postsRoute = require("./routes/posts");
const authsRoute = require("./routes/auth");

app.use("/user", authsRoute);
app.use("/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("We are on home.");
});

app.listen(3000);
