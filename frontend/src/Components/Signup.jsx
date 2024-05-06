import React, { useState } from 'react';
import '../CSS/Signup.css';
import axios from './axios.js';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import Logo from '../Images/Signup.svg';
import Footer from './Footer';
import Navbar from './Navbar';

const Signup = () => {
  const navigate = useNavigate();

  const [userSignUp, setUserSignUp] = useState(() => {
    return {
      username: '',
      email: '',
      password: '',
    };
  });

  let name, value;
  const HandleSignUp = e => {
    name = e.target.name;
    value = e.target.value;

    // setUserSignUp({ ...userSignUp, [name]: value });
    setUserSignUp(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const Submitup = async e => {
    console.log('clicked');
    e.preventDefault();
    try {
      const res = await axios.post('/register', userSignUp);
      if (res.status === 201) {
        alert(res.data.msg);
        navigate('/Login');
      } else if (res.status === 409) {
        alert('User already exists');
      }
    } catch (err) {
      alert('User already exists');
    }
  };

  console.log(userSignUp);
  return (
    <>
      <Navbar />
      <div className="signup-container">
        <img src={Logo} alt="" />
        <div className="signup">
          <form>
            <div>
              <center>
                <h4 style={{ fontSize: '500' }}>Signup</h4>
              </center>
            </div>
            <div>
              <PersonIcon id="Icon" />
              <input
                type="text"
                placeholder="username"
                name="username"
                onChange={HandleSignUp}
                value={userSignUp.username}
                required
                autoComplete="false"
              />
            </div>

            <div>
              <EmailIcon id="Icon" />
              <input
                type="email"
                placeholder="email"
                name="email"
                onChange={HandleSignUp}
                value={userSignUp.email}
                required
                autoComplete="false"
              />
            </div>

            <div>
              <LockIcon id="Icon" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={HandleSignUp}
                value={userSignUp.password}
                required
                autoComplete="false"
              />
            </div>
            <div>
              <center>
                <input type="submit" value="Submit" onClick={Submitup} />
              </center>
            </div>
          </form>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
};

export default Signup;
