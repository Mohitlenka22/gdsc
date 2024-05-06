import React from 'react';
import "../CSS/Footer.css";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear()
  return (
    <div>
      <footer>
        <p>&copy; CopyRights  All rights are reserved - {year}</p>
      </footer>
    </div>
  );
};
export default Footer;
