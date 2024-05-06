import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import axios from './axios';
import { useNavigate } from 'react-router-dom';

export default function AlertDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [project, setProject] = useState({
    projectName: '',
    projectDesc: '',
  });

  const body = {
    username: sessionStorage.getItem('username'),
    projectName: project.projectName,
    projectDesc: project.projectDesc,
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/create-project', body);
      if (res.status === 201) {
        alert('Project created');
        navigate('/projects');
        setOpen(false);
        setProject({
          projectName: '',
          projectDesc: '',
        });
      }
    } catch (error) {
      alert('Something went Wrong, Try it again');
      setOpen(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  return (
    <React.Fragment>
      <button className="butn" onClick={handleClickOpen}>
        <span>
          <AddIcon />
          Create Project
        </span>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" style={{ fontWeight: 'bold', marginTop: '1rem' }}>
          {'Add Project'}
        </DialogTitle>
        <DialogContent style={{ overflow: 'hidden' }}>
          <div className="form-container" style={{ boxShadow: 'none' }}>
            <form method="post">
              <div className="input_login" style={{ position: 'relative', bottom: '5rem', right: '4rem' }}>
                <input
                  type="text"
                  name="projectName"
                  id="name"
                  placeholder="Project Name"
                  required
                  value={project.projectName}
                  style={{ width: '30rem' }}
                  onChange={handleChange}
                />
              </div>
              <div className="input_login" style={{ position: 'relative', bottom: '5rem' }}>
                <textarea
                  name="projectDesc"
                  id="desc"
                  placeholder="Project Description"
                  cols={60}
                  rows={9}
                  value={project.projectDesc}
                  style={{ width: '30rem', minHeight: '180px', position: 'relative', right: '4rem' }}
                  onChange={handleChange}
                ></textarea>
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
