import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png';
import Spinner from './Spinner';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const config = require('./config');

  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsButtonEnabled(isValidEmail && termsAccepted);
  }, [email, termsAccepted]);

  const handleRegisterClick = async () => {
    if (!termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    // Call backend to send magic link
    console.log('config.server', config.server)
    fetch(`${config.server.url}/api/authentication/magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }).then(response => {
      if (response.ok) {
        alert("Magic link sent to your email.");
      }
    }).finally(() => {
      setIsLoading(false);
    });
  };

  // SET UP: Add link to your terms and service to the terms and service agreement
  // link below the email entry field
  return (
    <div className="RegisterPage">
        <header className="App-header">
            <img src={logo} alt="Flock Logo" style={{ width: '50%', height: 'auto', marginBottom: '10px' }} />
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div>
                <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" style={{ fontSize: '10pt' }}>
                    I accept the <a href="" target="_blank" rel="noopener noreferrer">terms and conditions</a>
                </label>
            </div>
            <button 
                onClick={handleRegisterClick} 
                className="register-button"
                disabled={!isButtonEnabled || isLoading}
            >
              {isLoading ? 'Sending...' : 'Register'}
            </button>
        </header>
        {isLoading && <Spinner />}
      </div>
  );
}

export default RegisterPage;