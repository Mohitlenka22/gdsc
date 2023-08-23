import React, { useEffect, useState } from 'react'
import './Form.css'
import axios from './axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from './Navbar'

const Form = () => {

    const navigate = useNavigate();
    let { _id } = useParams();
    const [updateuser, setUpdateuser] = useState({
        uname: '', role: '', uemail: '', phone: ''
    });

    const fetchMember = async () => {
        try {
            if (_id !== "Add") {
                const res = await axios.get(`/member-api/getone/${_id}`);

                if (res.status === 200) {
                    const data = res.data;
                    setUpdateuser(data)
                }
                else {
                    alert("Not Found");
                    navigate("/login")
                }
            }
        } catch (err) {
            navigate("/login");
        }
    }

    useEffect(() => {
        fetchMember();
    }, [_id])

    //Updating
    let name, value
    const HandleUpdate = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUpdateuser({ ...updateuser, [name]: value });
        console.log(updateuser)
    }

    const SubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`/member-api/edit/${_id}`, updateuser);
            if (res.status === 200) {
                alert(res.data);
                navigate("/home");
            }
            else {
                alert(res.data);
            }
        } catch (err) {
            navigate('/login')
        }
    }

    const SubmitUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/member-api/post", updateuser);
            console.log(res)
            if (res.status === 201) {
                alert("user created successfully");
                navigate("/home");
            }
            else {
                navigate("/user/Add")
            }
        } catch (err) {
            console.log(err.name)
            navigate("/user/Add")
        }
    }

    return (
        <>
            <Navbar />
            <Link id='back_link' to='/home' >Back</Link>
            <div className='Form_container'>
                <div className='input_tag'>
                    <label htmlFor="name">Name</label><br />
                    <input type='text' name='uname' value={updateuser.uname} id='uname' autoComplete='off' onChange={HandleUpdate} required />
                </div>
                <div className='input_tag'>
                    <label htmlFor="role">Role</label><br />
                    <input type='text' name='role' value={updateuser.role} id='role' autoComplete='off' onChange={HandleUpdate} required />
                </div>
                <div className='input_tag'>
                    <label htmlFor="email">Email</label><br />
                    <input type='email' name='uemail' id='uemail' value={updateuser.uemail} autoComplete='off' onChange={HandleUpdate} required />
                </div>
                <div className='input_tag'>
                    <label htmlFor="phone">Phone</label><br />
                    <input type='tel' name='phone' id='phone' value={updateuser.phone} autoComplete='off' onChange={HandleUpdate} required />
                </div>
                <div className='submt_form'>
                    {(_id !== "Add") ? <button className='btn_btn' style={{ 'backgroundColor': 'rgb(12, 188, 12)' }} onClick={SubmitUpdate}>Update</button>
                        : (<button className='btn_btn' style={{ 'backgroundColor': '#223ff5' }} onClick={SubmitUser}>Add</button>)}

                </div>
            </div>
        </>
    )
}


export default Form;
