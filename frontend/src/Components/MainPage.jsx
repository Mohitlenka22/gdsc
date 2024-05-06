import React, { useEffect, useState } from 'react';
import '../CSS/MainPage.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from './axios';
import Navbar from './Navbar';
import { Storage } from './storage';
import Footer from './Footer';

const MainPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  console.log(members);

  const project = useParams();
  console.log(project);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/member-api/getall/${project._id}/${sessionStorage.getItem('username')}`);
      if (response.status === 200) {
        console.log(response.data);
        let list = response.data.Projectmembers;
        list = Object.values(
          list.reduce((acc, obj) => {
            acc[JSON.stringify(obj)] = obj;
            return acc;
          }, {})
        );
        setMembers(list);
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const SubmitDelete = async member => {
    let a = window.confirm(`Are you sure to delete user ${member.uname}`);
    if (a) {
      try {
        const res = await axios.delete(`member-api/delete/${member._id}/${sessionStorage.getItem('username')}/${project._id}`);
        if (res) {
          alert('user deleted successfully');
          setMembers([]);
        } else {
          alert('something went wrong!');
        }
      } catch (err) {
        navigate('/login');
      }
    }
  };
  return (
    <>
      <div className="main_Container">
        <Navbar isLogged={true} />
        <div className="content">
          <div style={{ marginLeft: '2rem' }}>
            <h1> Project Name:  {project.projectName}</h1>
            <h3>{Storage.getProjectdesc()}</h3>
          </div>
          <div className="heading">
            <span id="hhead">View/Edit/Delete Core Team Members</span>
            <Link className="add_btn" to={`/user/${project.projectName}/${project._id}`}>
              {' '}
              Add{' '}
            </Link>
          </div>
          <h1 style={{ textAlign: 'center'}}>{members.length === 0 && 'Waiting For Member Approval'}</h1>
          {members.map(member => {
            return (
              <div className="Card" key={member._id}>
                <div className="Card-content">
                  <h3>{member.uname}</h3>
                  <div className="button-group">
                    <Link to={`/user/view/${member._id}`} id="edit_btn" style={{ backgroundColor: 'rgb(28, 172, 28)' }}>
                      View
                    </Link>
                    <Link id="edit_btn" style={{ backgroundColor: 'rgb(255, 0, 0)' }} onClick={() => SubmitDelete(member)}>
                      <DeleteIcon fontSize="small" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'relative', top: '2rem' }}>
        <Footer />
      </div>
    </>
  );
};

export default MainPage;
