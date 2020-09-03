require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const DB = mongoose.connection;
const app = express();

const PORT = 3333 || process.env.PORT;

// ====================
// middlewares
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: false,
    expectCt: {
      maxAge: 2592000,
    },
  })
);

// ====================
// Routes
// ====================
app.use("/api", require("./api_endpoints"));

// ====================
// Starting Server
// ====================
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

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
