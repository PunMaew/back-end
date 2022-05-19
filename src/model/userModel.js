const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        firstName: { type: String, unique: true, required: true },
        lastName: { type: String, unique: true, required: true },
        email: { type: String, required: true, unique: true },
        active: { type: Boolean, default: false },
        location: 
            {
                province: { type: String, required: true },
                district: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
        password: { type: String, required: true },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        emailToken: { type: String, default: null },
        emailTokenExpires: { type: Date, default: null },
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
const User = mongoose.model('user', userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // 10 rounds
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};