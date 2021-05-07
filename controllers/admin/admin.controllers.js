const adminServices = require("../../services/admin/admin.services");

//signup
const adminSignupController = async (req, res, next) => {
  const response = await adminServices.adminSignupService({ ...req.body });
  const { error, data } = response;
  if (error) {
    return next(error);
  }
  return res.status(201).json(data);
};

//signin
const adminSigninController = async (req, res, next) => {
  const response = await adminServices.adminSigninService({ ...req.body });
  const { error, data } = response;
  if (error) {
    return next(error);
  }
  return res.json(data);
};

module.exports = {
  adminSigninController,
  adminSignupController
};
