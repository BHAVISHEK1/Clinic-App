import React from 'react';
import '../App.css';

const Hero = ({
  title = 'Patient Data',
  subtitle = 'Manage and Handle Patient Data',
}) => {
  return (
    <section className='hero'>
      <h1 className='title'>{title}</h1>
      {/* <p className='subtitle'>{subtitle}</p> Add subtitle if needed */}
    </section>
  );
};

export default Hero;
