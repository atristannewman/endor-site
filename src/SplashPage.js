import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './logo.png';

function SplashPage() {
  useEffect(() => {
    // Function to check for a specific cookie
    const checkCookie = (cookieName) => {
        const cookies = document.cookie.split('; ');
        return cookies.some(cookie => cookie.startsWith(`${cookieName}=`));
    };

    // Check for the cookie
    if (checkCookie('your_cookie_name')) {
        console.log('Cookie exists!');
        // Handle the case where the cookie exists
    } else {
        console.log('Cookie does not exist.');
        // Handle the case where the cookie does not exist
    }
  }, []);
  return (
    <div className="SplashPage">
      <header className="App-header">
        <div className="header-buttons">
          <Link to="/register">
            <button className="register">Register</button>
          </Link>
        </div>
        <img src={logo} alt="Flock Logo" style={{ width: '10%', height: 'auto', marginBottom: '10px' }} />
        <h3>your mvp</h3>
        <p>
          caption of your mvp
        </p>
        <h2>Benefits</h2>
        <ul>
          <li>* The list</li>
          <li>* of your mvp's</li>
          <li>* benefits</li>
        </ul>
      </header>
    </div>
  );
}

export default SplashPage;