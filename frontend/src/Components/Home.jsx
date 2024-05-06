import React from 'react';
import '../CSS/Home.css';
import { Link } from 'react-router-dom';
import Logo from '../Images/Teamlogo.svg';
import Footer from './Footer';
import Navbar from './Navbar';

const Home = () => {
  return (
    <div className="body">
      <Navbar />

      <main>
        <section className="image-section">
          <img src={Logo} alt="Error" />
          <p className="para">
            A Team Management Web app simplifies the process of creating and managing teams with members, streamlining collaboration and
            productivity. Through intuitive interfaces, users can effortlessly form teams, assigning roles and responsibilities to members.
            Team leaders or administrators have the ability to invite users, and organize team resources such as communication channels. The
            app fosters effective communication and collaboration among team members through features like task assignment .
          </p>
          <div className="btn-container">
            <Link id="web_login" to="/member">
              Member
            </Link>
            <Link id="web_login" to="/signup">
              Register Here
            </Link>
          </div>
        </section>
      </main>
      <div className="footer-home">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
