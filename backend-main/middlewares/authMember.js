import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Member from '../models/memberSchema.js';

dotenv.config({ path: './config.env' });

const authMember = async (req, res, next) => {
  try {
    const token = req.cookies.member;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await Member.findOne({ _id: user._id });
    if (!loginUser) {
      res.status(401).send('Authorization Failed.');
    }
    req.user = loginUser;
    next();
  } catch (error) {
    res.status(403).send(error.message);
  }
};

export default authMember;
