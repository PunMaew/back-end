const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    address: {
      provincea: { type: String, required: true },
      districta: { type: String, required: false, default: null },
      area: { type: String, required: false, default: null },
      zipCodea: { type: String, required: true },
    },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    roleId: { type: String, default: '6d6a5444-c3c1-49a2-80f2-8a95d3f33761', required: false },
    contactId: { type: String, default: null, required: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
// const User = new Schema({userSchema}, { collection: 'data' });
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
