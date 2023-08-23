import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/userSchema.js';
import authenticate from '../middlewares/authenticate.js';
import sendEmail from '../middlewares/sendEmail.js';

const router = express.Router();

//test route
router.get("/", (req, res) => {
    res.send("Hello world!. & Backend");
})

//Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(404).send("Fill feilds properly.");
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const user = new User({ username, email, password });
            const resp = await user.save();
            console.log(resp);
            if (resp) {
                res.status(200).json({ msg: "User Created" });
            }
            else {
                res.status(500).json({ err: "Error occured!" });
            }
        }
        else {
            res.status(404).json({ msg: "User already Exists." });
        }

    }
    catch (err) {
        res.status(500).json({ error: err.name });
    }
});

//Otp
router.post("/otp", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(404).json({ err: "Fill feilds properly." });
    }

    try {
        const user = await User.findOne({ username: username }).select("+password");
        if (!user) {
            res.status(404).json({ msg: "User doesn't Exists." });
        }
        let otp = await user.generateOtp();
        try {
            await sendEmail({
                to: user.email,
                subject: "Otp for Login",
                text: `otp: ${otp}`
            });

            res.status(200).send("Email sent");

        } catch (error) {
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();
            console.log(error.message);
        }


    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Login route
router.post("/login", async (req, res) => {
    const { username, password, otp } = req.body;

    if (!username || !password || !otp) {
        return res.status(404).json({ err: "Fill feilds properly." });
    }

    try {
        const user = await User.findOne({ username: username, otpExpire: { $gt: Date.now() } }).select("+password");
        if (!user) {
            return res.status(404).json({ msg: "User doesn't Exists or Otp Expired" });
        }
        else if (otp !== user.otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ "msg": "Invalid otp" })
        }
        else {

            const loginUser = await bcrypt.compare(password, user.password);
            let token = await user.generateAuthToken();
            res.cookie("connect", token, {
                domain: '.backend-gdsc.onrender.com',
                path: '/',
                httpOnly: true,
                maxAge: new Date(Date.now() + 900000),
                secure: true,
                sameSite: 'none'
            });
            res.set('Access-Control-Allow-Credentials', 'true');
            if (!loginUser) {
                return res.status(500).json({ msg: "Invalid Credentials" });
            }
            return res.status(200).json({ msg: "Succesfully Logged in." });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }

});

//GetData route

router.get("/getdata", authenticate, (req, res, next) => {
    if (!req.user) {
        res.status(500).send("Error.")
    }
    res.status(200).send(req.user);
    next();
});

//forgotpassword

router.post("/forgot", async (req, res) => {

    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(404).send("Email Not found.");
        }
        const resetToken = await user.generateResetToken();

        const resetUrl = `https://mohitlenka.netlify.app/${resetToken}`;

        const message =
            `
            <body style="background-color: black;opacity: 0.9;margin-top: 0px;display: flex; flex-direction: column">
            <center>
                <h2
                    style="background-color: rgb(8, 134, 31); color: #fff; font-family: Arial, Helvetica, sans-serif; padding: 20px 10px;">
                    mohitlenka.netlify.app
                </h2>
            </center>
            <h3
                style="color: #fff;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                Here's the request for password reset, link expires in 10 minutes.
            </h3>
            <p
                style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: large; font-weight: bold;">
                Link to change password is below:
            </p>
            <a href="${resetUrl}" clicktracking="off"
                style="display: block; text-align: center; margin: 20px 0; font-size: 1.2rem; font-weight: bold; color: rgb(128, 27, 125); text-decoration: none; border: 2px solid rgb(128, 27, 125); padding: 10px 20px;">
                ${resetUrl}
            </a>
            <footer
                style="background-color: rgb(52, 51, 51); opacity: 0.9;
                    color: #fff; opacity: 0.9; height: 3rem; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;position: relative; top: 15rem">
                &copy; All Rights Reserved - 2023
                <br />
                <a href="https://mohitlenka.netlify.app/" target="_blank" style="color: blue">mohitlenka.netlify.app</a> 
            </footer>
        </body>
        

        `
        try {
            await sendEmail({
                to: user.email,
                subject: "Password reset Request.",
                text: message
            });

            res.status(200).send("Email sent");

        } catch (error) {
            user.resetpasswordToken = undefined;
            user.resetpasswordExpire = undefined;
            await user.save();
            console.log(error.message);
        }


    } catch (error) {

    }
});

//Reset password
router.put('/passwordreset/:resetToken', async (req, res) => {
    const resetpasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    try {
        const user = await User.findOne({
            resetpasswordToken: resetpasswordToken,
            resetpasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            res.status(404).send("Invalid token");
        }
        user.password = req.body.password;
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;

        await user.save();
        res.status(200).send("password changed successfully.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//logout route

router.get("/logout", async (req, res) => {
    res.clearCookie("connect", {
        domain: '.backend-gdsc.onrender.com',
        path: '/',
        secure: true,
        sameSite: 'none'
    });
    res.status(200).send({ "msg": "Successfully logged Out." });
});

export default router;
