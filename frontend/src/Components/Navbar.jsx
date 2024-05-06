import React from 'react';
import NavLogo from '../Images/NavLogo.svg';
import '../CSS/Navbar.css';
import axios from './axios';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ isLogged, isMember }) => {
  const navigate = useNavigate();
  const Logout = async () => {
    try {
      const res = await axios.get('/logout');
      if (res.status === 200) {
        navigate('/login');
      } else {
        alert('Error occured');
      }
    } catch (err) {
      console.log(err.name);
    }
  };
  const memberLogout = async () => {
    try {
      const res = await axios.get('/member-api/logout');
      if (res.status === 200) {
        navigate('/member');
      } else {
        alert('Error occured');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="Navbar">
      <header>
        <h2 style={{ color: '#fff' }}>Team Management</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLogged ? (
              <li>
                <Link onClick={isMember ? memberLogout : Logout}>Logout</Link>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
