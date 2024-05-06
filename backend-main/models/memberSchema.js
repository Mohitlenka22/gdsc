import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const memberSchema = new mongoose.Schema({
  uname: { type: String, required: true },
  role: { type: String, required: true },
  uemail: { type: String, required: true },
  phone: { type: String, required: true },
  token: { type: String },
  task: { type: String },
  projectid: { type: String },
  otp: { type: String },
  otpExpire: Date,
});

memberSchema.methods.generateOtp = async function () {
  const otp = Math.floor((9999 - 1000) * Math.random() + 1000);
  this.otp = otp;
  this.otpExpire = (await Date.now()) + 300 * 1000;
  await this.save();
  return otp;
};
memberSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  this.token = token;
  await this.save();
  console.log(token);
  return token;
};

const Member = mongoose.model('members', memberSchema);

export default Member;
