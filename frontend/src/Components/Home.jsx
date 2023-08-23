import React from 'react';
import Logo from './gdsc_logo.png';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='home_container'>
            <img id='logo' src={Logo} alt="" />
            <h1 id='web_lead' >Web Team Lead</h1>
            <Link id='web_login' to='/login' >Login</Link>
        </div>
    )
}

export default Home
