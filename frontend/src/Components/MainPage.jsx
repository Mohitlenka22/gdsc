import React, {  useEffect, useState } from 'react';
import './MainPage.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import { Link, useNavigate } from 'react-router-dom';
import axios from './axios'
import Navbar from './Navbar';


const MainPage = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axios.get("/member-api/getall");
            if (response.status === 200) {
                setMembers(response.data);
            }
            else {
                navigate("/login")
            }
        }
        catch (err) {
            navigate('/login')
        }
    }
    useEffect(() => {
        fetchData();
    }, [members]);

    const SubmitDelete = async (member) => {
        let a = window.confirm(`Are you sure to delete user ${member.uname}`);
        if (a) {
            try {
                const res = await axios.delete(`member-api/delete/${member._id}`);
                if (res) {
                    alert("user deleted successfully");
                    navigate("/home");
                }
                else {
                    alert("something went wrong!");
                }
            } catch (err) {
                console.log(err.name)
            }
        }
    }
    return (
        <div className='main_Container'>
            <Navbar />
            <div className='content'>
                <div style={{ 'marginLeft': '2rem' }}>
                    <h1>Welcome Lead, </h1>
                </div>
                <div className='heading'>
                    <h1 id='hhead'>View/Edit/Delete Core Team Members</h1>
                    <Link className='add_btn' to='/user/Add'> Add </Link>
                </div>
                {members.map((member) => {
                    return (
                        <div className='Card' key={member._id}>
                            <div className='Card-content'>
                                <h3>{member.uname}</h3>
                                <div className='button-group'>
                                    <Link to={`/user/${member._id}`} id='edit_btn' style={{ 'backgroundColor': 'rgb(28, 172, 28)' }} ><EditIcon fontSize='small' /></Link>
                                    <Link id='edit_btn' style={{ 'backgroundColor': 'rgb(255, 0, 0)' }} onClick={() => SubmitDelete(member)} ><DeleteIcon fontSize='small' /></Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default MainPage
