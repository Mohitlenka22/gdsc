import express from 'express';
import Member from '../models/memberSchema.js';
import authenticate from '../middlewares/authenticate.js';
import sendEmail from '../middlewares/sendEmail.js';
import project from '../models/projectSchema.js';
import User from '../models/userSchema.js';
import authMember from '../middlewares/authMember.js';

const api = express.Router();

api.post('/approve/:member_id/:project_id', async (req, res) => {
  const { member_id, project_id } = req.params;

  try {
    const member = await Member.findById(member_id);
    const Project = await project.findById(project_id);

    console.log(member);

    if (!member || !Project) {
      return res.status(404).send('Not found');
    }
    const _valid = Project.members.some(existingMember => existingMember._id.equals(member._id));
    if (_valid) {
      return res.status(412).send('already exists');
    }
    member.projectid = project_id;
    await member.save();
    Project.members.push(member);
    await Project.save();

    console.log('Member added to project:', member_id, 'Project:', project_id);

    return res.status(201).send('Member added');
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Internal Server Error');
  }
});

api.delete('/reject/:member_id', async (req, res) => {
  const member_id = req.params.member_id;

  try {
    const member = await Member.findById(member_id);
    if (!member) {
      return res.status(404).send('Member Not Found');
    }

    await Member.deleteOne({ _id: member_id });
    console.log('heel');
    return res.status(204).send('Deleted Successfully');
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Internal Server Error');
  }
});

api.post('/member/verify', async (req, res) => {
  const { uemail, otp } = req.body;
  if (!uemail || !otp) {
    return res.status(400).send('Bad Request');
  }
  try {
    const member = await Member.findOne({ uemail: uemail, otpExpire: { $gt: Date.now() } });
    console.log(member);
    if (!member) {
      return res.status(404).send('Member Not Found');
    }
    if (otp !== member.otp || member.otpExpire < Date.now()) {
      return res.status(403).send('Invalid OTP');
    }
    let token = await member.generateAuthToken();

    res.cookie('member', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: new Date(Date.now() + 900000),
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).send('Success');
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Internal Server Error');
  }
});

api.post('/member/otp', async (req, res) => {
  const { uemail } = req.body;

  try {
    const member = await Member.findOne({ uemail: uemail });

    if (!member) {
      return res.status(404).send('Member Not Found');
    }

    let otp = await member.generateOtp();
    console.log(otp);

    try {
      await sendEmail({
        to: member.uemail,
        subject: 'Otp for Member Login',
        text: `otp: ${otp}`,
      });

      return res.status(200).json({ msg: 'Email sent. Please check your email for the OTP.' });
    } catch (error) {
      member.otp = undefined;
      member.otpExpire = undefined;
      await member.save();
      console.log(error.message);
      return res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

api.post('/member-api/post/:project_id/:username', authenticate, async (req, res) => {
  const { uname, role, uemail, phone } = req.body;
  const username = req.params.username;
  const project_id = req.params.project_id;
  console.log(project_id);
  if (!uname || !role || !uemail || !phone) {
    res.status(404).send({ msg: 'Please fill fields properly' });
  }
  if (!username) {
    res.status(404).send({ msg: 'Please fill fields properly' });
  }
  try {
    let mem;
    const member = await Member.findOne({ uname });
    if (!member) {
      const member = await Member({ uname, role, uemail, phone });
      mem = await member.save();
    } else {
      mem = member;
    }
    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
      res.status(404).send({ msg: 'Not Found' });
    }
    user.members.push(mem);
    await user.save();
    if (mem) {
      res.status(201).send({ msg: 'created successfully' });
      try {
        await sendEmail({
          to: mem.uemail,
          subject: 'Accept/ Reject Team Joining',
          text: `
          <a href=http://localhost:3000/approve/${mem._id}/${project_id}> Approve</a> <br/>
          <a href=http://localhost:3000/reject/${mem._id}>Reject </a>
          `,
        });

        res.status(200).send('Email sent');
      } catch (error) {
        console.log(error.message);
      }
    } else {
      res.status(500).send({ err: 'Error Occured' });
    }
  } catch (err) {
    res.status(404).send({ err: err.name });
  }
});

api.get('/member-api/getall/:project_id/:username', authenticate, async (req, res) => {
  const { project_id, username } = req.params;
  // console.log(project_id);
  const Project = await project.findById(project_id);
  const user = await User.findOne({ username });
  console.log(Project);
  console.log('hi');
  console.log(user);
  if (!user) {
    res.status(500).send('Error');
  }
  if (Project) {
    let members = user.members;
    let pmembers = Project.members;

    console.log(members, pmembers);
    res.status(200).json({ Projectmembers: Project.members });
  } else {
    res.status(500).send('Error');
  }
});

api.get('/member-api/getone/:_id', authenticate, async (req, res) => {
  const member = await Member.findOne({ _id: req.params._id });
  if (!member) {
    res.status(500).send('Error');
  }
  res.status(200).send(member);
});

api.post('/member-api/getonemember', authMember, async (req, res) => {
  const { email } = req.body;
  const member = await Member.findOne({ uemail: email });
  if (!member) {
    res.status(500).send('Error');
  }
  res.status(200).send(member);
});

api.patch('/member-api/edit/:_id', authenticate, async (req, res) => {
  try {
    const response = await Member.updateOne({ _id: req.params._id }, { $set: req.body });
    if (response) {
      res.status(200).send('updated');
    }
  } catch (err) {
    res.status(404).send(err.name);
  }
});

api.delete('/member-api/delete/:_id/:username/:projectId', authenticate, async (req, res) => {
  try {
    const memberId = req.params._id;
    const username = req.params.username;
    const projectId = req.params.projectId;

    // const response = await Member.deleteOne({ _id: memberId });
    // const response = true;
    // if (!response) {
    //   return res.status(404).send('User Not found');
    // }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User Not found');
    }

    const Project = await project.findById(projectId);
    if (!Project) {
      return res.status(404).send('Project Not found');
    }
    await project.updateOne({ projectId }, { $set: { members: project.members?.filter(member => member._id !== memberId) } });
    console.log(Project);

    return res.status(200).send('User deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
});

api.post('/member-api/email/:_id', authenticate, async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(404).json({ err: 'Fill fields properly.' });
  }
  try {
    const member = await Member.findOne({ _id: req.params._id });
    if (!member) {
      return res.status(404).json({ msg: "member doesn't exist" });
    }
    try {
      await sendEmail({
        to: member.uemail,
        subject: 'Notification Regarding Task Assignment',
        text: task,
      });

      // After sending the email, send the success response
      return res.status(200).json({ msg: `Email sent to ${member.uname}` });
    } catch (error) {
      member.task = undefined;
      await member.save();
      console.log(error.message);
      // Handle the error and send a response accordingly
      return res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  } catch (err) {
    res.status(500).send(err.name);
  }
});

api.get('/member/:project_id', authMember, async (req, res) => {
  const project_id = req.params.project_id;
  try {
    const Project = await project.findById(project_id);
    if (!Project) {
      return res.status(404).send('Not Found');
    }
    return res.status(200).send(Project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

api.get('/member-api/logout', async (req, res) => {
  res.clearCookie('member', {
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.status(200).send({ msg: 'Successfully logged out.' });
});

export default api;
