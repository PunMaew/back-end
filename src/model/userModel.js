const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: { type: String, required: true, unique: false },
    lastName: { type: String, required: true, unique: false },
    tel: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    active: { type: Boolean, default: false },
    role: { type: String, default: "USER" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    idealCat: [{
      id: { type: mongoose.Schema.Types.ObjectId, require: true },
      answer: { type: String, require: true }
    }],
    favor: [{
      itemId: { type: mongoose.Types.ObjectId, ref: 'finderHome', required: true }
    }],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);
userSchema.virtual('postInfo', {
  ref: "finderHome", 
  localField: 'favor',
  foreignField: '_id',
  justOne: true
})

mongoose.pluralize(null);
const User = mongoose.model("user", userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); 
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};
