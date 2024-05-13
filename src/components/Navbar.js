import React from 'react';
//import { NavLink } from 'react-router-dom';
import logo from '../assets/images/sutantra-seva-trust-logo.png';
import '../App.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='container'>
        <div className='navbar-container'>
          <div className='logo'>

          <img className='logo-img' src={logo} alt='React Jobs' />
          
            {/* <NavLink className='logo-link' to='/'>
              
              <span className='logo-text'>React Jobs</span>
            </NavLink> */}
            
          </div>
          <h2>Sutantra Narayani Seva Trust</h2>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
