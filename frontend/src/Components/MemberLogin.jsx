import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import Loginlogo from '../Images/login_img.svg';
import Footer from './Footer';
import '../CSS/Login.css';
import EmailIcon from '@mui/icons-material/Email';

const MemberLogin = () => {
  const [useremail, setUserEmail] = useState('');

  const HandleSubmit = e => {
    setUserEmail(e.target.value);
  };
  const navigate = useNavigate();

  const SubmitOtp = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/member/otp', {
        uemail: useremail,
      });
      if (res.status === 200) {
        alert(res.data.msg);
        navigate('/otp', { state: { email: useremail, isMember: true } });
      } else {
        alert(res.data);
      }
    } catch (err) {}
  };

  return (
    <>
      <div className="login_container">
        <div className="login-img-container">
          <img src={Loginlogo} alt="" />
        </div>
        <div className="form-container">
          <form method="post" onSubmit={SubmitOtp}>
            <h1 style={{ textAlign: 'center' }}>Member Login</h1>
            <div className="input_login">
              <label htmlFor="name">
                <EmailIcon />
              </label>
              <input type="email" name="uemail" id="email" value={useremail} autoComplete="off" onChange={HandleSubmit} required />
            </div>
            <div className="input_login">
              <input type="submit" id="submt" value="Submit" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberLogin;
