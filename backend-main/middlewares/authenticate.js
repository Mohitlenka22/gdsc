import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/userSchema.js";

dotenv.config({ path: './config.env' });

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.connect;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const loginUser = await User.findOne({ _id: user._id });
        if (!loginUser) {
            res.status(401).send("Authorization Failed.");
        }
        req.user = loginUser;
        next();
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export default authenticate;