import React, { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import axios from './axios';

const Login = () => {
    const [user, setUser] = useState({
        username: "", password: "", otp: ""
    });

    let name, value;
    const HandleSubmit = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }
    const navigate = useNavigate();

    const SubmitOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/otp", {
                "username": user.username,
                "password": user.password
            });
            if (res.status === 200) {
                alert(res.data)
            }
        } catch (err) {

        }

    }
    const SubmitLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/login", user);
            if (res.status === 200) {
                alert(res.data.msg)
                navigate("/home")
            }
            else {
                console.log(res)
                alert(res.data)
                navigate('/login')
            }
        }
        catch (err) {
            alert("Invalid Credentials")
            navigate("/login")
        }
    }

    return (

        <div className='login_container'>
            <form method='post' onSubmit={SubmitLogin}>
                <div className='input_login'>
                    <label htmlFor="name" ><PersonIcon /></label>
                    <input type="text" name='username' id='name' placeholder='username' value={user.username} onChange={HandleSubmit} required />
                </div>
                <div className='input_login'>
                    <label htmlFor="passwd" ><LockIcon /></label>
                    <input type="password" name='password' id='passwd' placeholder='password' value={user.password} onChange={HandleSubmit} required />
                </div>
                <div className='input_login'>
                    <input type='button' value="Generate Otp" id='sub_otp' onClick={SubmitOtp} />
                </div>
                <div className='input_login'>
                    <label htmlFor="otp" ><KeyIcon /></label>
                    <input type="text" name='otp' id='otp' placeholder='OTP' value={user.otp} onChange={HandleSubmit} required />
                </div>
                <div className='input_login'>
                    <input type='submit' id='submt' value="Login"  />
                </div>
            </form >
        </div >
    )
}

export default Login
