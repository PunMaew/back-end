const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    tel: { type: String, required:false ,default: null},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false },
    role: { type: String, default: "USER" },
    address: {
      province: { type: String, required: true ,default: null},
      district: { type: String, required: false, default:" "},
      subDistrict: { type: String, required: false, default: " " },
      zipCode: { type: String, required: true ,default: null},
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    accessToken: { type: String, default: null }, // JWT token
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    //idealCat: { type: Array, required: false },
    idealCat:[{
      id: {type: mongoose.Schema.Types.ObjectId, require: true},
      answer : {type: String, require: true}
  }],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    versionKey: false
  }
);

mongoose.pluralize(null);
const User = mongoose.model("user", userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // 10 rounds
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};
