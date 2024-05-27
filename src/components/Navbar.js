import React from 'react';
import logo from '../assets/images/sutantra-seva-trust-logo.png';
import '../App.css';

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='container'>
        <div className='navbar-container'>
          <div className='logo'>
            <img className='logo-img' src={logo} alt='React Jobs' />
          </div>
          <h2>Sutantra Narayani Seva Trust</h2>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
