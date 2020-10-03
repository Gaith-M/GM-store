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
// Static Folder
// ====================
app.use(express.static(path.join(__dirname, "public")));
// ====================
// Routes
// ====================
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./api_endpoints"));

// ===================
// Error Handling
// ===================
app.use((err, req, res, next) => {
  res.status(500).json(err.message);
});
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
