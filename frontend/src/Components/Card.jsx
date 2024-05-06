import React from 'react';
import '../CSS/Card.css';
import { Link } from 'react-router-dom';

const Card = ({ projectName, projectDesc, _id, isMember }) => {
  return (
    <Link to={!isMember && `/dashboard/${projectName}/${_id}`}>
      <div className="card">
        <h2>Project Name:  {projectName}</h2>
        <p>Project Description: {projectDesc}</p>
      </div>
    </Link>
  );
};

export default Card;
