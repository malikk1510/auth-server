//requiring modules
console.log("environment", process.env.NODE_ENV);
require("custom-env").env(process.env.NODE_ENV);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin/admin.routes");
const cors = require("cors");

//setting connection b/w node and database!
mongoose
  .connect(process.env.MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(cors());
app.use(bodyparser.json()); // parsing req body
app.use(adminRoutes);

//.....
app.listen(4000, () => {
  console.log("server is up on port 4000");
});
// error handler
app.use((error, req, res, next) => {
  // console.log("error calling");
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message });
});
