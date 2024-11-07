import React from 'react';
import ReactDOM from 'react-dom/client';
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { services } from './config';

const root = ReactDOM.createRoot(document.getElementById('root'));

const stytchOptions = {
  cookieOptions: {
    opaqueTokenCookieName: 'stytch_session',
    jwtCookieName: 'stytch_session_jwt',
    path: '',
    availableToSubdomains: false,
    domain: '',
  }
};

const stytch = new StytchUIClient(services.stytch);

root.render(
  <React.StrictMode>
    <StytchProvider stytch={stytch} stytchOptions={stytchOptions}>
      <App />
    </StytchProvider>
  </React.StrictMode>
);

reportWebVitals();
