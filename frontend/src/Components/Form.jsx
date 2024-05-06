import React, { useEffect, useState } from 'react';
import '../CSS/Form.css';
import axios from './axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Form = () => {
  const navigate = useNavigate();
  const { project, _id } = useParams();
  console.log(project, _id);

  const [updateuser, setUpdateuser] = useState({
    uname: '',
    role: '',
    uemail: '',
    phone: '',
  });

  const fetchMember = async () => {
    try {
      if (project === 'view') {
        const res = await axios.get(`/member-api/getone/${_id}`);

        if (res.status === 200) {
          const data = res.data;
          console.log('member ', data);
          setUpdateuser(data);
        } else {
          alert('Not Found');
          navigate('/login');
        }
      }
    } catch (err) {
      navigate('/login');
    }
  };
  console.log('hello');

  useEffect(() => {
    fetchMember();
  }, [project]);

  //Updating
  let name, value;
  const HandleUpdate = e => {
    name = e.target.name;
    value = e.target.value;
    setUpdateuser({ ...updateuser, [name]: value });
    console.log(updateuser);
  };

  const SubmitUpdate = async e => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/member-api/edit/${project}`, updateuser);
      if (res.status === 200) {
        alert(res.data);
        // navigate('/home');
      } else {
        alert(res.data);
      }
    } catch (err) {
      navigate('/login');
    }
  };

  const SubmitUser = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`/member-api/post/${_id}/${sessionStorage.getItem('username')}`, updateuser);
      // send username
      console.log(res);
      if (res.status === 201) {
        alert('user created successfully');
        navigate(`/dashboard/${project}/${_id}`);
      } else {
        navigate(`/user/${project.projectName}`);
      }
    } catch (err) {
      console.log(err.name);
      navigate(`/user/${project.projectName}`);
    }
  };

  return (
    <>
      <Navbar />
      {project !== 'view' ? (
        <Link id="back_link" to={`/dashboard/${project}/${_id}`}>
          Back
        </Link>
      ) : (
        ''
      )}
      {project === 'view' ? <h1 style={{ textAlign: 'center' }}>View Details</h1> : ''}
      <form action="post" onSubmit={SubmitUser}>
        <div className="Form_container">
          <div className="input_tag">
            <label htmlFor="name">Name</label>
            <br />
            <input
              type="text"
              name="uname"
              value={updateuser.uname}
              id="uname"
              autoComplete="off"
              onChange={HandleUpdate}
              required
              disabled={project === 'view' ? true : false}
            />
          </div>
          <div className="input_tag">
            <label htmlFor="role">Role</label>
            <br />
            <input
              type="text"
              name="role"
              value={updateuser.role}
              id="role"
              autoComplete="off"
              onChange={HandleUpdate}
              required
              disabled={project === 'view' ? true : false}
            />
          </div>
          <div className="input_tag">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              name="uemail"
              id="uemail"
              value={updateuser.uemail}
              autoComplete="off"
              onChange={HandleUpdate}
              required
              disabled={project === 'view' ? true : false}
            />
          </div>
          <div className="input_tag">
            <label htmlFor="phone">Phone</label>
            <br />
            <input
              type="tel"
              name="phone"
              id="phone"
              value={updateuser.phone}
              autoComplete="off"
              onChange={HandleUpdate}
              required
              disabled={project === 'view' ? true : false}
            />
          </div>
          <div className="submt_form">
            {project === 'view' ? '' : <input type="submit" className="btn_btn" style={{ backgroundColor: '#223ff5' }} value="Add" />}
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default Form;
