import React from 'react';
import './Footer.scss';
import Github from 'resource/github.png';
import Email from 'resource/email.png';
import Facebook from 'resource/facebook.png';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-copyright"><i className="far fa-copyright"></i> 2019 Developed by kevin.koo</div>
      <div className="footer-sns">
        <ul>
          <li><a href="https://github.com/planetbk9/React-Project/tree/master/Time-Manager"><img src={Github} alt="github"/></a></li>
          <li><a href="mailto:planetbk9@gmail.com"><img src={Email} alt="email"/></a></li>
          <li><a href="https://www.facebook.com/chulhoe.koo.3"><img src={Facebook} alt="facebook"/></a></li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;