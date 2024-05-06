import React from 'react';
import ApproveLogo from '../Images/approve.svg';
import Navbar from './Navbar';
import Footer from './Footer';
import '../CSS/Template.css';
import { Link } from 'react-router-dom';

const Template = ({ text, approve }) => {
  console.log(text);
  return (
    <>
      <Navbar isLogged={false} />
      <div className="approve-container">
        <img className="Approve-logo" src={ApproveLogo} alt="" />
        <h1>{text}</h1>
        {approve ? (
          <div style={{ position: 'relative', top: '5rem', right: '26rem' }}>
            <Link to="/member">Back to login</Link>
          </div>
        ) : (
          ''
        )}
      </div>
      <Footer />
    </>
  );
};

export default Template;
