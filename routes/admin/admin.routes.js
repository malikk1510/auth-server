const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  adminSigninController,
  adminSignupController,
} = require("../../controllers/admin/admin.controllers");
const { validationFunction } = require("../../services/admin/admin.services");
//routes

// signin
router.post(
  "/api/user/admin/signin",

  adminSigninController
);

// signup
router.post(
  "/api/user/admin/signup",

  adminSignupController
);

//export
module.exports = router;
