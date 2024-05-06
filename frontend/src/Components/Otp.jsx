import React, { useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from './axios';
import { Storage } from './storage';
import OtpLogo from '../Images/TWOFA.svg';
import '../CSS/Otp.css';
import Footer from './Footer';

const Otp = () => {
  const navigate = useNavigate();
  const username = Storage.getUsername();
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const email = location?.state?.email;
  const isMember = location?.state?.isMember;
  console.log(isMember)
  const SubmitLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/otp', {
        username: username,
        otp: otp,
      });
      if (res.status === 200) {
        alert(res.data.msg);
        sessionStorage.setItem('username', username);
        navigate('/projects');
      } else {
        console.log(res);
        alert(res.data);
        navigate('/login');
      }
    } catch (err) {
      alert('Invalid Otp or Otp Expired');
      navigate('/login');
    }
  };
  const memberSubmit = async e => {
    console.log("member")
    e.preventDefault();
    try {
      const res = await axios.post('/member/verify', {
        uemail: email,
        otp: otp,
      });
      if (res.status === 200) {
        alert(res.data.msg);
        sessionStorage.setItem('memail', email);
        navigate('/member/dashboard');
      } else {
        // console.log(res);
        alert(res.data);
        navigate('/login');
      }
    } catch (err) {
      alert('Invalid Otp or Otp Expired');
      navigate('/login');
    }
  };

  const HandleSubmit = e => {
    setOtp(e.target.value);
  };

  console.table({
    username: username,
    otp: otp,
  });

  return (
    <>
      <div className="otp-container">
        <img className="otp-logo" src={OtpLogo} alt="error" />
        <div className="form-container">
          <form method="post" onSubmit={isMember ? memberSubmit : SubmitLogin}>
            <h2 style={{ textAlign: 'center' }}>Two Factor Authentication</h2>
            <div className="input_login" style={{ position: 'relative', left: '1rem', top: '1rem' }}>
              <label htmlFor="otp">
                <KeyIcon />
              </label>
              <input type="text" name="otp" id="otp" placeholder="OTP" value={otp} onChange={HandleSubmit} required />
            </div>
            <div className="input_login" style={{ position: 'relative', left: '1rem', top: '1rem' }}>
              <input type="submit" id="submt" value="Login" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Otp;
