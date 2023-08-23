import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';


dotenv.config({ path: './config.env' });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "Please fill feilds Properly."] },
    password: { type: String, minlength: 6, select: false },
    resetpasswordToken: String,
    resetpasswordExpire: Date,
    token: String,
    otp: String,
    otpExpire: Date,
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
    this.token = token;
    await this.save();
    return token;
};

userSchema.methods.generateResetToken = async function () {
    const resetToken = await crypto.randomBytes(20).toString("hex");
    this.resetpasswordToken = await crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpire = await Date.now() + 10 * (60 * 1000);
    await this.save();
    return resetToken;
};

userSchema.methods.generateOtp = async function () {
    const otp = Math.floor((9999 - 1000) * Math.random() + 1000)
    this.otp = otp;
    this.otpExpire = await Date.now() + (300 * 1000)
    await this.save();
    return otp;
}

const User = mongoose.model("testusers", userSchema);

export default User;