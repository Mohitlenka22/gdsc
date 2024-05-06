import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/userSchema.js';
import authenticate from '../middlewares/authenticate.js';
import sendEmail from '../middlewares/sendEmail.js';
import project from '../models/projectSchema.js';
import Member from '../models/memberSchema.js';

const router = express.Router();

//test route
router.get('/', (req, res) => {
  res.send('Hello world!. & Backend');
});

//Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Fill fields properly.');
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ msg: 'User already exists.' });
    }
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json({ msg: 'User Created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Otp
router.post('/otp', async (req, res) => {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(404).json({ err: 'Fill fields properly.' });
  }

  try {
    const user = await User.findOne({ username: username, otpExpire: { $gt: Date.now() } }).select('+password');
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist or OTP expired" });
    } else if (otp !== user.otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }
    let token = await user.generateAuthToken();
    // Set the cookie and headers before sending the response
    res.cookie('connect', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: new Date(Date.now() + 900000),
      secure: true,
      sameSite: 'none',
    });
    console.log('Cookie set:', res.getHeaders());
    return res.status(200).json({ msg: 'Successfully logged in.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ err: 'Fill fields properly.' });
  }

  try {
    const user = await User.findOne({ username: username }).select('+password');
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }

    const loginUser = await bcrypt.compare(password, user.password);
    if (!loginUser) {
      return res.status(500).json({ msg: 'Invalid Credentials' });
    }

    let otp = await user.generateOtp();
    console.log(otp);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Otp for Login',
        text: `otp: ${otp}`,
      });

      return res.status(200).json({ msg: 'Email sent. Please check your email for the OTP.' });
    } catch (error) {
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save();
      console.log(error.message);
      return res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//GetData route

router.get('/getdata', authenticate, (req, res, next) => {
  if (!req.user) {
    res.status(500).send('Error.');
  }
  res.status(200).send(req.user);
  next();
});

//forgotpassword

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send('Email Not found.');
    }
    const resetToken = await user.generateResetToken();

    const resetUrl = `https://mohitlenka.netlify.app/${resetToken}`;

    const message = `
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
        

        `;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password reset Request.',
        text: message,
      });

      res.status(200).send('Email sent');
    } catch (error) {
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;
      await user.save();
      console.log(error.message);
    }
  } catch (error) {}
});

//Reset password
router.put('/passwordreset/:resetToken', async (req, res) => {
  const resetpasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  try {
    const user = await User.findOne({
      resetpasswordToken: resetpasswordToken,
      resetpasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(404).send('Invalid token');
    }
    user.password = req.body.password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save();
    res.status(200).send('password changed successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//logout route

router.get('/logout', async (req, res) => {
  res.clearCookie('connect', {
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.status(200).send({ msg: 'Successfully logged Out.' });
});

router.post('/create-project', authenticate, async (req, res) => {
  const { username, projectName, projectDesc } = req.body;

  if (!username || !projectName || !projectDesc) {
    return res.status(404).json({ err: 'Fill fields properly.' });
  }
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }
    const Project = new project({ projectName, projectDesc });
    const response = await Project.save();
    console.log(response);
    user.projectsId.push({ projectid: response._id });
    await user.save();
    return res.status(201).send('Project Created');
  } catch (err) {}
});

router.post('/get-projectIdlist', authenticate, async (req, res) => {
  const { username } = req.body;
  console.log(username);
  if (!username) {
    return res.status(400).json({ err: 'Fill fields properly.' });
  }
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }
    console.log(user);
    return res.status(200).send(user.projectsId);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/projects', authenticate, async (req, res) => {
  const { projectIdlist } = req.body;
  console.log(projectIdlist);

  if (!projectIdlist || projectIdlist.length === 0) {
    return res.status(400).send('Bad Request');
  }

  let projectList = [];
  try {
    for (const projectId of projectIdlist) {
      // console.log(projectId);
      const Project = await project.findById(projectId);
      console.log(Project);
      if (Project) {
        projectList.push(Project);
      } else {
        console.log(`Project with ID ${projectId} not found`);
      }
    }
    return res.status(200).json({ projects: projectList });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
