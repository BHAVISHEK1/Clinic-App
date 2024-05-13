import React from 'react';
import '../App.css'; // Import the CSS file
import Button from './Button';

const Card = ({ children, bg = 'bg-gray-100' }) => {
  return <div className={`card ${bg}`}>{children} <Button/></div>;
};

export default Card;
