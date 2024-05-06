import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import '../CSS/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import Loginlogo from '../Images/login_img.svg';
import Footer from './Footer';
import { Storage } from './storage';

const Login = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  console.log(user);
  let name, value;
  const HandleSubmit = e => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };
  const navigate = useNavigate();

  const SubmitOtp = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', {
        username: user.username,
        password: user.password,
      });
      if (res.status === 200) {
        alert(res.data.msg);
        navigate('/otp');
      }
    } catch (err) {}
  };

  Storage.setUsername(user.username);

  return (
    <>
      <div className="login_container">
        <div className="login-img-container">
          <img src={Loginlogo} alt="" />
        </div>
        <div className="form-container">
          <form method="post" onSubmit={SubmitOtp}>
            <h1 style={{ textAlign: 'center' }}>Login</h1>
            <div className="input_login">
              <label htmlFor="name">
                <PersonIcon />
              </label>
              <input type="text" name="username" id="name" placeholder="username" value={user.username} onChange={HandleSubmit} required />
            </div>
            <div className="input_login">
              <label htmlFor="passwd">
                <LockIcon />
              </label>
              <input
                type="password"
                name="password"
                id="passwd"
                placeholder="password"
                value={user.password}
                onChange={HandleSubmit}
                required
              />
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

export default Login;
