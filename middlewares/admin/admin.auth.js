require("custom-env").env(process.env.NODE_ENV);
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/custom-errors/http-error");
const Admin = require("../../models/admin/admin.model");

//authentication for protected routes
const adminAuth = async (req, res, next) => {
  //middleware function
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //getting token from headers & deleting bearer from token
    // console.log('token: ', token);
    const decoded = await jwt.verify(token, process.env.SECRET); // verfying if user have this token
    const user = await Admin.findOne({ _id: decoded._id }); // fnding user by id, the id we gave while generating tokens

    if (!user) {
      const error = new HttpError("Invalid admin!", 400);
      next(error);
    }

    req.token = token; // storing token in req object so tht we can acces it later
    req.user = user; // storing user in req object so tht we can acces it later
    next();
  } catch (err) {
    console.log("err: ", err);
    const error = new HttpError("Acess denied!", 401);
    next(error);
  }
};
module.exports = adminAuth;
