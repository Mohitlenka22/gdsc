import React, { useEffect, useState } from 'react';
import '../CSS/Card.css';
import Card from './Card';
import Navbar from './Navbar';
import AlertDialog from './AlertDialog';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Project = () => {
  const navigate = useNavigate();
  const [projectsId, setProjectsId] = useState([]);
  const [projects, setProjects] = useState([]);
  const body = {
    username: sessionStorage.getItem('username'),
  };

  const getProjectIdlist = async () => {
    try {
      const res = await axios.post('/get-projectIdlist', body);
      if (res.status === 403) {
        navigate('/login');
      }
      let list = res.data?.map(val => {
        return val['projectid'];
      });
      setProjectsId(list);
      getProjects(list);
    } catch (err) {
      navigate('/login');
    }
  };

  useEffect(() => {
    getProjectIdlist();
  }, []);

  const getProjects = async list => {
    try {
      if (list.length > 0) {
        const body = {
          projectIdlist: list,
        };
        const res = await axios.post('/projects', body);
        setProjects(res.data.projects);
        console.log(res.data.projects);
      }
    } catch (err) {}
  };

  // if (projects.length <= 0) {
  //   return ' ';
  // }
  return (
    <>
      <Navbar isLogged={true} />
      <div className="Project-container">
        <h1>Welcome Back Lead, Here Your Projects.</h1>
        <div class="card-container">
          {projects.map(project => (
            <Card {...project} key={project._id} />
          ))}
        </div>
      </div>
      <AlertDialog />

     
    </>
  );
};

export default Project;
