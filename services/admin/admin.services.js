require("custom-env").env(process.env.NODE_ENV);
const { validationResult } = require("express-validator");
const Admin = require("../../modals/admin/admin.model");
const HttpError = require("../../modals/custom-errors/http-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Validation error function
const validationFunction = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(`${errors.array()[0].msg}`, 400);
    console.log("error: ", error);
    return next(error);
  }
  next();
};

//generating token
const generateAuthToken = async (data) => {
  const { _id, email, SECRET } = data;
  if (SECRET) {
    var token = await jwt.sign({ _id: _id.toString(), email }, SECRET, {
      expiresIn: "10d",
    });
  }
  return token;
};

//verify user while signinng
const verifyAdmin = async (data) => {
  const { email, password } = data;

  var admin = await Admin.findOne({ email });

  if (!admin) {
    const error = new HttpError("Invalid admin!", 404);
    return { error };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const error = new HttpError("Invalid admin!", 404);
    return { error };
  }
  return { admin };
};

// creating user/ signup
const adminSignupService = async (data) => {
  try {
    const isAdmin = await Admin.findOne({ email: data.email });
    if (isAdmin) {
      const error = new HttpError("Admin already exists!", 400);
      return {
        error,
      };
    }
    const admin = new Admin(data);
    await admin.save();
    const { _id } = admin;
    const { email } = admin.email;
    const { SECRET } = process.env;
    const token = await generateAuthToken({ _id, email, SECRET });
    // admin.password = undefined;
    const users = await Admin.find();
    return {
      data: {
        admin,
        token,
        users,
      },
    };
  } catch (err) {
    console.log("err: ", err);
    const error = new HttpError("Something went wrong!", 500);
    return { error };
  }
};

//finding user in database
const adminSigninService = async (data) => {
  console.log("data: ", data);
  const { email, password } = data;
  try {
    const response = await verifyAdmin({ email, password });

    const { error, admin } = response;

    if (error) {
      return { error };
    }
    const { _id } = admin;
    const { SECRET } = process.env;
    const token = await generateAuthToken({ _id, email, SECRET });
    admin.password = undefined;
    const users =await Admin.find();
    return {
      data: {
        admin,
        token,
        users,
      },
    };
  } catch (err) {
    console.log("err:", err);
    const error = new HttpError("Something went wrong!", 500);
    return { error };
  }
};

module.exports = {
  validationFunction,
  adminSigninService,
  adminSignupService,
};
