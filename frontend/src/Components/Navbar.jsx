import React from 'react';
import banner from './banner.svg'
import './Navbar.css';
import axios from './axios';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const Logout = async () => {
    try {
      const res = await axios.get("/logout");
      if (res.status === 200) {
        navigate("/login");
      }
      else {
        alert('Error occured')
      }
    } catch (err) {
      console.log(err.name);
    }
  }
  return (
    <div className='Navbar'>

        <img id='nav_img' src={banner} alt="" />
      <button id='logout' onClick={Logout}>Logout</button>
    </div>
  )
}

export default Navbar

