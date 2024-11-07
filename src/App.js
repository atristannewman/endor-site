import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SplashPage from './SplashPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<SplashPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;