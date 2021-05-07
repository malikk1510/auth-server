const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")
//string, boolean , number, aaray, object
const adminSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
});
//Before saving !
adminSchema.pre("save", async function (next) {
  // we use pre keyword for before work , nd the first param is wht r we doing
  if (this.isModified("password")) {
    // if we r modifying
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//crud - create, read, update delete
const AdminModal = mongoose.model("AdminModal", adminSchema); //AdminModals, AdminModals

module.exports = AdminModal;
