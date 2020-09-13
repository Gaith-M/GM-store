require("dotenv").config();
const cors = require("cors");
const path = require("path");
const passport = require("passport");
require("./middlewares/passport-config");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const DB = mongoose.connection;
const app = express();

const PORT = 3333 || process.env.PORT;

// ====================
// middlewares
// ====================
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: false,
    expectCt: {
      maxAge: 2592000,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// ====================
// Routes
// ====================
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./api_endpoints"));

// ===================
// Connecting to DB
// ===================
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
});
DB.once("open", () => console.log(`Connection Established`));
DB.on("error", (e) => console.log(e));

// ====================
// Starting Server
// ====================
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
