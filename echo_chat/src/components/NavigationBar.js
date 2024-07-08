import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { userData } from '../helper';

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { username } = userData();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-brand">EchoChat</a>
        <div className="navbar-toggle" onClick={toggleNavbar}>
          ☰
        </div>
        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
          <span className="navbar-text">
            Hi, {username}
          </span>
          <Link to={'/logout'} className="navbar-link">Logout</ Link>
        </div>
      </div>
    </nav>
  );
}
