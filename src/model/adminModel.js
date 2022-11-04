const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const adminSchema = new Schema(
    {
        firstName: { type: String, required: true ,minLength:3 ,maxlength:30},
        lastName: { type: String, required: true ,minLength:3 ,maxlength:30},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minLength: 6 },
        role: { type: String, default: "ADMIN" },
        active: { type: Boolean, default: false },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        accessToken: { type: String, default: null }, // JWT token
        emailToken: { type: String, default: null },
        emailTokenExpires: { type: Date, default: null },

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
const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // 10 rounds
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};