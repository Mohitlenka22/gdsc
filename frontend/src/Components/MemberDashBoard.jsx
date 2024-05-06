import React, { useEffect, useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Logo from '../Images/dashboard.svg';
import '../CSS/dashboard.css';
import Footer from './Footer';
import Card from './Card';

const MemberDashBoard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [project, setProject] = useState({});
  const onLoadClick = async () => {
    try {
      const res = await axios.post('/member-api/getonemember', {
        email: sessionStorage.getItem('memail'),
      });
      if (res.status === 200) {
        console.log(res.data);
        getProject(res?.data?.projectid);
        setName(res.data.uname);
      } else {
        alert(res.data);
        navigate('/member');
      }
    } catch (err) {
      alert('error');
      navigate('/member');
    }
  };
  useEffect(() => {
    onLoadClick();
  }, []);

  const getProject = async id => {
    try {
      const res = await axios.get(`/member/${id}`);
      if (res.status === 200) {
        console.log(res.data);
        // setName(res.data);
        setProject(res.data);
      } else {
        // alert(res.data);
        navigate('/member');
      }
    } catch (err) {
      alert('error');
      navigate('/member');
    }
  };
  return (
    <div>
      <Navbar isLogged={true} isMember={true} />
      <div className="member-container">
        <img className='member-img' src={Logo} alt="" />
        <h1 className="member-head">Hello! &nbsp;{name}
        <br />
        <br />
        <span style={{"margin":"8px"}} >Your Projects</span>
        
        
         </h1>
        {/* <div>{project.projectName}</div> */}
        <div className="card-mem">
          <Card {...project} isMember={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemberDashBoard;
